// GameVerse.Infrastructure/Repositories/UserRepository.cs

using Microsoft.EntityFrameworkCore;
using GameVerse.Application.Interfaces; // Precisa conhecer o "contrato"
using GameVerse.Domain;

namespace GameVerse.Infrastructure.Repositories;

// Esta classe implementa a interface que definimos na camada de Application
public class UserRepository : IUserRepository
{
    private readonly GameVerseDbContext _context;

    public UserRepository(GameVerseDbContext context)
    {
        _context = context;
    }

    public async Task AddUserAsync(User user)
    {
        // Aqui sim, usamos o DbContext para interagir com o banco
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

     public async Task<User?> FindUserByIdentifierAsync(string identifier)
    {
        var normalizedIdentifier = identifier.ToLowerInvariant();
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedIdentifier || u.Username.ToLower() == normalizedIdentifier);
    }
}
