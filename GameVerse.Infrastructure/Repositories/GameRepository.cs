using GameVerse.Application.Interfaces;
using GameVerse.Domain;
using Microsoft.EntityFrameworkCore;

namespace GameVerse.Infrastructure.Repositories;

public class GameRepository : IGameRepository
{
    private readonly GameVerseDbContext _context;

    public GameRepository(GameVerseDbContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(Game game)
    {
        await _context.Games.AddAsync(game);
        await _context.SaveChangesAsync();
    }

    public async Task<Game?> GetByIdAsync(Guid id)
    {
        return await _context.Games.FindAsync(id);
    }

    public async Task<IEnumerable<Game>> GetAllAsync()
    {
        return await _context.Games.ToListAsync();
    }

    public async Task UpdateAsync(Game game)
    {
        _context.Games.Update(game);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var game = await GetByIdAsync(id);
        if (game != null)
        {
            _context.Games.Remove(game);
            await _context.SaveChangesAsync();
        }
    }
}

