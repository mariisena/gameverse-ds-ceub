using GameVerse.Domain;

namespace GameVerse.Application.Interfaces;

public interface IPostRepository
{
    Task CreateAsync(Post post);
    Task<Post?> GetByIdAsync(Guid id);
    Task<IEnumerable<Post>> GetAllAsync();
    Task UpdateAsync(Post post);
    Task DeleteAsync(Guid id);
}
