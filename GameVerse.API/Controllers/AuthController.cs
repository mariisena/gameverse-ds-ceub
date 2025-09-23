// GameVerse.API/Controllers/AuthController.cs

using Microsoft.AspNetCore.Mvc;
using GameVerse.Application.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using GameVerse.Domain;

namespace GameVerse.API.Controllers;

[ApiController]
[Route("api/[controller]")] // Define a rota base como /api/auth
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly IConfiguration _configuration;

    public AuthController(AuthService authService, IConfiguration configuration)
    {
        _authService = authService;
        _configuration = configuration;
    }

    // DTO (Data Transfer Object) para receber os dados do registro
    public record RegisterRequest(string FullName, string Username, string Email, string Password);

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var newUser = await _authService.RegisterUserAsync(
                request.FullName,
                request.Username,
                request.Email,
                request.Password
            );

            // Retorna um status 201 Created com os dados do usuário (sem a senha)
            return CreatedAtAction(nameof(Register), new { id = newUser.Id }, new { newUser.Id, newUser.Username, newUser.Email });
        }
        catch (Exception ex)
        {
            // Tratamento de erro básico
            return StatusCode(500, $"Ocorreu um erro interno: {ex.Message}");
        }
    }

    public record LoginRequest(string Identifier, string Password);

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var authenticatedUser = await _authService.LoginUserAsync(request.Identifier, request.Password);


        if (authenticatedUser == null)
        {
            // Retorna uma resposta genérica por segurança. Não diga se foi o usuário ou a senha que errou.
            return Unauthorized(new { message = "Credenciais inválidas." });
        }

        // Se o login for bem-sucedido, gere o token JWT
        var token = GenerateJwtToken(authenticatedUser);

        return Ok(new { message = "Login bem-sucedido!", token = token });
    }

    // 4. MÉTODO PRIVADO PARA GERAR O TOKEN
    private string GenerateJwtToken(User user)
    {
        // Pega a chave secreta do appsettings.json
        var jwtKey = _configuration["Jwt:Key"];
        if (string.IsNullOrEmpty(jwtKey))
        {
            throw new InvalidOperationException("A chave secreta do JWT não está configurada no appsettings.json");
        }

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        // Cria os "claims" (informações que vão dentro do token)
        var claims = new[]
        {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim("username", user.Username),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

        // Cria o token
        var token = new JwtSecurityToken(
            issuer: null,  // Quem emitiu (pode ser o seu site)
            audience: null, // Para quem se destina (pode ser o seu site)
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials);

        // Escreve o token como uma string
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
