using GameVerse.Application.Interfaces;
using GameVerse.Domain;

namespace GameVerse.Application.Services;

public class PostService
{
    private readonly IPostRepository _postRepository;

    public PostService(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<Post> CreatePostAsync(Post post, Guid authorId)
    {
        post.AuthorId = authorId;
        await _postRepository.CreateAsync(post);
        return post;
    }

    public async Task<Post?> GetPostByIdAsync(Guid id)
    {
        return await _postRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Post>> GetAllPostsAsync()
    {
        return await _postRepository.GetAllAsync();
    }

    public async Task UpdatePostAsync(Guid id, Post updatedPost, Guid userId)
    {
        var existingPost = await _postRepository.GetByIdAsync(id);
        if (existingPost == null)
        {
            throw new KeyNotFoundException("Post não encontrado.");
        }

        if (existingPost.AuthorId != userId)
        {
            throw new UnauthorizedAccessException("Você não tem permissão para editar este post.");
        }

        existingPost.Title = updatedPost.Title;
        existingPost.BodyContent = updatedPost.BodyContent;
        existingPost.UpdatedAt = DateTime.UtcNow;

        await _postRepository.UpdateAsync(existingPost);
    }

    public async Task DeletePostAsync(Guid id, Guid userId)
    {
        var post = await _postRepository.GetByIdAsync(id);
        if (post == null)
        {
            throw new KeyNotFoundException("Post não encontrado.");
        }

        if (post.AuthorId != userId)
        {
            throw new UnauthorizedAccessException("Você não tem permissão para deletar este post.");
        }

        await _postRepository.DeleteAsync(id);
    }
}