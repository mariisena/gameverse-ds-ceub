// GameVerse.Application/Interfaces/IGameRepository.cs
using GameVerse.Domain;

namespace GameVerse.Application.Interfaces;

public interface IGameRepository
{
    Task CreateAsync(Game game);
    Task<Game?> GetByIdAsync(Guid id);
    Task<IEnumerable<Game>> GetAllAsync();
    Task UpdateAsync(Game game);
    Task DeleteAsync(Guid id);
}

