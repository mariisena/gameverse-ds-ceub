using GameVerse.Application.Services;
using GameVerse.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GameVerse.API.Controllers;

/// <summary>
/// Endpoints para gerenciar jogos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly GameService _gameService;

    public GamesController(GameService gameService)
    {
        _gameService = gameService;
    }

    /// <summary>
    /// DTO para criação e atualização de jogos.
    /// </summary>
    public record GameRequest(string Title, string Description, string Genre, string Status);

    /// <summary>
    /// Cria um novo jogo.
    /// </summary>
    /// <remarks>
    /// Requer autenticação. O jogo será associado ao usuário autenticado.
    /// </remarks>
    /// <param name="request">Dados do jogo a ser criado.</param>
    /// <returns>O jogo recém-criado.</returns>
    /// <response code="201">Jogo criado com sucesso.</response>
    /// <response code="400">Dados inválidos fornecidos.</response>
    /// <response code="401">Usuário não autenticado.</response>
    /// <response code="500">Erro interno do servidor.</response>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateGame([FromBody] GameRequest request)
    {
        try
        {
            // Validação básica de entrada
            if (string.IsNullOrWhiteSpace(request.Title))
            {
                return BadRequest(new { message = "O título do jogo é obrigatório." });
            }

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Token inválido." });
            }

            if (!Guid.TryParse(userIdClaim, out var ownerId))
            {
                return BadRequest(new { message = "ID de usuário inválido." });
            }

            var newGame = new Game
            {
                Title = request.Title,
                Description = request.Description,
                Genre = request.Genre,
                Status = request.Status
            };

            var createdGame = await _gameService.CreateGameAsync(newGame, ownerId);
            return CreatedAtAction(nameof(GetGameById), new { id = createdGame.Id }, createdGame);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor.", details = ex.Message });
        }
    }

    private IActionResult Forbid(object value)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    /// Busca um jogo específico pelo seu ID.
    /// </summary>
    /// <param name="id">O ID do jogo.</param>
    /// <returns>Os detalhes do jogo.</returns>
    /// <response code="200">Retorna o jogo solicitado.</response>
    /// <response code="400">ID inválido fornecido.</response>
    /// <response code="404">Jogo não encontrado.</response>
    /// <response code="500">Erro interno do servidor.</response>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetGameById(Guid id)
    {
        try
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new { message = "ID do jogo inválido." });
            }

            var game = await _gameService.GetGameByIdAsync(id);
            if (game == null)
            {
                return NotFound(new { message = "Jogo não encontrado." });
            }
            
            return Ok(game);
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
    /// Lista todos os jogos cadastrados.
    /// </summary>
    /// <returns>Uma lista de todos os jogos.</returns>
    /// <response code="200">Retorna a lista de jogos.</response>
    /// <response code="500">Erro interno do servidor.</response>
    [HttpGet]
    public async Task<IActionResult> GetAllGames()
    {
        try
        {
            var games = await _gameService.GetAllGamesAsync();
            return Ok(games);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor.", details = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza os dados de um jogo existente.
    /// </summary>
    /// <remarks>
    /// Requer autenticação. Apenas o dono do jogo pode atualizá-lo.
    /// </remarks>
    /// <param name="id">O ID do jogo a ser atualizado.</param>
    /// <param name="request">Os novos dados do jogo.</param>
    /// <returns>Nenhum conteúdo.</returns>
    /// <response code="204">Jogo atualizado com sucesso.</response>
    /// <response code="400">Dados inválidos fornecidos.</response>
    /// <response code="401">Usuário não autenticado.</response>
    /// <response code="403">Usuário não tem permissão para editar este jogo.</response>
    /// <response code="404">Jogo não encontrado.</response>
    /// <response code="500">Erro interno do servidor.</response>
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateGame(Guid id, [FromBody] GameRequest request)
    {
        try
        {
            // Validações básicas
            if (id == Guid.Empty)
            {
                return BadRequest(new { message = "ID do jogo inválido." });
            }

            if (string.IsNullOrWhiteSpace(request.Title))
            {
                return BadRequest(new { message = "O título do jogo é obrigatório." });
            }

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Token inválido." });
            }

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return BadRequest(new { message = "ID de usuário inválido." });
            }

            var updatedGame = new Game
            {
                Title = request.Title,
                Description = request.Description,
                Genre = request.Genre,
                Status = request.Status
            };

            await _gameService.UpdateGameAsync(id, updatedGame, userId);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor.", details = ex.Message });
        }
    }

    /// <summary>
    /// Deleta um jogo existente.
    /// </summary>
    /// <remarks>
    /// Requer autenticação. Apenas o dono do jogo pode deletá-lo.
    /// </remarks>
    /// <param name="id">O ID do jogo a ser deletado.</param>
    /// <returns>Nenhum conteúdo.</returns>
    /// <response code="204">Jogo deletado com sucesso.</response>
    /// <response code="400">ID inválido fornecido.</response>
    /// <response code="401">Usuário não autenticado.</response>
    /// <response code="403">Usuário não tem permissão para deletar este jogo.</response>
    /// <response code="404">Jogo não encontrado.</response>
    /// <response code="500">Erro interno do servidor.</response>
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteGame(Guid id)
    {
        try
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new { message = "ID do jogo inválido." });
            }

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Token inválido." });
            }

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return BadRequest(new { message = "ID de usuário inválido." });
            }

            await _gameService.DeleteGameAsync(id, userId);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro interno do servidor.", details = ex.Message });
        }
    }
}

