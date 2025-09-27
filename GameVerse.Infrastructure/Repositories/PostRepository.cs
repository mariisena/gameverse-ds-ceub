using GameVerse.Application.Interfaces;
using GameVerse.Domain;
using Microsoft.EntityFrameworkCore;

namespace GameVerse.Infrastructure.Repositories;

public class PostRepository : IPostRepository
{
    private readonly GameVerseDbContext _context;

    public PostRepository(GameVerseDbContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(Post post)
    {
        await _context.Posts.AddAsync(post);
        await _context.SaveChangesAsync();
    }

    public async Task<Post?> GetByIdAsync(Guid id)
    {
        return await _context.Posts.FindAsync(id);
    }

    public async Task<IEnumerable<Post>> GetAllAsync()
    {
        return await _context.Posts.ToListAsync();
    }

    public async Task UpdateAsync(Post post)
    {
        _context.Posts.Update(post);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var post = await GetByIdAsync(id);
        if (post != null)
        {
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }
    }
}
