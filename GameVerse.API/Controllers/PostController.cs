using GameVerse.Application.Services;
using GameVerse.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GameVerse.API.Controllers;

// <summary>
/// Endpoints para gerenciar posts e devlogs.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly PostService _postService;

    public PostsController(PostService postService)
    {
        _postService = postService;
    }

    /// <summary>
    /// DTO para criação e atualização de posts.
    /// </summary>
    public record PostRequest(string Title, string BodyContent, Guid? GameId, string PostType = "devlog");

    /// <summary>
    /// Cria um novo post (ou devlog).
    /// </summary>
    /// <remarks>
    /// Requer autenticação. O post será associado ao usuário autenticado.
    /// </remarks>
    /// <param name="request">Dados do post a ser criado.</param>
    /// <returns>O post recém-criado.</returns>
    /// <response code="201">Post criado com sucesso.</response>
    /// <response code="401">Usuário não autenticado.</response>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreatePost([FromBody] PostRequest request)
    {
        var authorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var newPost = new Post
        {
            Title = request.Title,
            BodyContent = request.BodyContent,
            GameId = request.GameId,
            PostType = request.PostType
        };

        var createdPost = await _postService.CreatePostAsync(newPost, authorId);
        return CreatedAtAction(nameof(GetPostById), new { id = createdPost.Id }, createdPost);
    }

    /// <summary>
    /// Busca um post específico pelo seu ID.
    /// </summary>
    /// <param name="id">O ID do post.</param>
    /// <returns>Os detalhes do post.</returns>
    /// <response code="200">Retorna o post solicitado.</response>
    /// <response code="404">Post não encontrado.</response>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetPostById(Guid id)
    {
        var post = await _postService.GetPostByIdAsync(id);
        if (post == null)
        {
            return NotFound(new { message = "Post não encontrado." });
        }
        return Ok(post);
    }

    /// <summary>
    /// Lista todos os posts cadastrados.
    /// </summary>
    /// <returns>Uma lista de todos os posts.</returns>
    /// <response code="200">Retorna a lista de posts.</response>
    [HttpGet]
    public async Task<IActionResult> GetAllPosts()
    {
        var posts = await _postService.GetAllPostsAsync();
        return Ok(posts);
    }

    /// <summary>
    /// Atualiza os dados de um post existente.
    /// </summary>
    /// <remarks>
    /// Requer autenticação. Apenas o autor do post pode atualizá-lo.
    /// </remarks>
    /// <param name="id">O ID do post a ser atualizado.</param>
    /// <param name="request">Os novos dados do post.</param>
    /// <returns>Nenhum conteúdo.</returns>
    /// <response code="204">Post atualizado com sucesso.</response>
    /// <response code="401">Usuário não autenticado.</response>
    /// <response code="403">Usuário não tem permissão para editar este post.</response>
    /// <response code="404">Post não encontrado.</response>
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdatePost(Guid id, [FromBody] PostRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var updatedPost = new Post
        {
            Title = request.Title,
            BodyContent = request.BodyContent
        };

        await _postService.UpdatePostAsync(id, updatedPost, userId);
        return NoContent();
    }

    /// <summary>
    /// Deleta um post existente.
    /// </summary>
    /// <remarks>
    /// Requer autenticação. Apenas o autor do post pode deletá-lo.
    /// </remarks>
    /// <param name="id">O ID do post a ser deletado.</param>
    /// <returns>Nenhum conteúdo.</returns>
    /// <response code="204">Post deletado com sucesso.</response>
    /// <response code="401">Usuário não autenticado.</response>
    /// <response code="403">Usuário não tem permissão para deletar este post.</response>
    /// <response code="404">Post não encontrado.</response>
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeletePost(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _postService.DeletePostAsync(id, userId);
        return NoContent();
    }
}

