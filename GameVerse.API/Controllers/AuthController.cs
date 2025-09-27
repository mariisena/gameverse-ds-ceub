// GameVerse.API/Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using GameVerse.Application.Services;
using GameVerse.Domain;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

namespace GameVerse.API.Controllers;

/// <summary>
/// Endpoints para registro e autenticação de usuários.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly IConfiguration _configuration;

    public AuthController(AuthService authService, IConfiguration configuration)
    {
        _authService = authService;
        _configuration = configuration;
    }

    /// <summary>
    /// DTO para requisição de registro de usuário.
    /// </summary>
    public record RegisterRequest(string FullName, string Username, string Email, string Password);

    /// <summary>
    /// Registra um novo usuário na plataforma.
    /// </summary>
    /// <param name="request">Dados do usuário para registro.</param>
    /// <returns>Retorna os dados do usuário recém-criado.</returns>
    /// <response code="201">Usuário criado com sucesso.</response>
    /// <response code="400">Dados inválidos fornecidos.</response>
    /// <response code="409">Email ou username já existem.</response>
    /// <response code="500">Ocorreu um erro interno.</response>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            // Validação básica de entrada
            if (string.IsNullOrWhiteSpace(request.Email) || 
                string.IsNullOrWhiteSpace(request.Username) || 
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Todos os campos são obrigatórios." });
            }

            var newUser = await _authService.RegisterUserAsync(
                request.FullName,
                request.Username,
                request.Email,
                request.Password
            );
            
            return CreatedAtAction(nameof(Register), new { id = newUser.Id }, 
                new { newUser.Id, newUser.Username, newUser.Email });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor.", details = ex.Message });
        }
    }

    /// <summary>
    /// DTO para requisição de login.
    /// </summary>
    public record LoginRequest(string Identifier, string Password);

    /// <summary>
    /// Autentica um usuário e retorna um token JWT.
    /// </summary>
    /// <param name="request">Credenciais de login (email ou username) e senha.</param>
    /// <returns>Retorna uma mensagem de sucesso e o token JWT.</returns>
    /// <response code="200">Login bem-sucedido.</response>
    /// <response code="400">Dados de entrada inválidos.</response>
    /// <response code="401">Credenciais inválidas.</response>
    /// <response code="500">Erro interno do servidor.</response>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            // Validação básica de entrada
            if (string.IsNullOrWhiteSpace(request.Identifier) || 
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Identifier e Password são obrigatórios." });
            }

            var authenticatedUser = await _authService.LoginUserAsync(request.Identifier, request.Password);

            if (authenticatedUser == null)
            {
                return Unauthorized(new { message = "Credenciais inválidas." });
            }

            var token = GenerateJwtToken(authenticatedUser);

            return Ok(new { message = "Login bem-sucedido!", token = token });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(500, new { message = "Erro de configuração.", details = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor.", details = ex.Message });
        }
    }

    /// <summary>
    /// Retorna as informações do usuário autenticado.
    /// </summary>
    /// <returns>Dados do usuário logado.</returns>
    /// <response code="200">Retorna as informações do usuário.</response>
    /// <response code="401">Usuário não autenticado.</response>
    /// <response code="500">Erro interno do servidor.</response>
    [HttpGet("me")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Token inválido ou ausente." });
            }

            var userInfo = new
            {
                Id = userIdClaim.Value,
                Email = User.FindFirst(ClaimTypes.Email)?.Value,
                Username = User.FindFirst("username")?.Value
            };

            return Ok(userInfo);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor.", details = ex.Message });
        }
    }

    private string GenerateJwtToken(User user)
    {
        try
        {
            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("A chave secreta do JWT não está configurada no appsettings.json");
            }
            
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("username", user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Erro ao gerar token JWT: {ex.Message}", ex);
        }
    }
}