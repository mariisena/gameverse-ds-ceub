using GameVerse.Application.Interfaces;
using GameVerse.Domain;

namespace GameVerse.Application.Services;

public class GameService
{
    private readonly IGameRepository _gameRepository;

    public GameService(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    public async Task<Game> CreateGameAsync(Game game, Guid ownerId)
    {
        game.OwnerId = ownerId;
        await _gameRepository.CreateAsync(game);
        return game;
    }

    public async Task<Game?> GetGameByIdAsync(Guid id)
    {
        return await _gameRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Game>> GetAllGamesAsync()
    {
        return await _gameRepository.GetAllAsync();
    }

    public async Task UpdateGameAsync(Guid id, Game updatedGame, Guid userId)
    {
        var existingGame = await _gameRepository.GetByIdAsync(id);
        if (existingGame == null)
        {
            throw new KeyNotFoundException("Jogo não encontrado.");
        }

        if (existingGame.OwnerId != userId)
        {
            throw new UnauthorizedAccessException("Você não tem permissão para editar este jogo.");
        }

        existingGame.Title = updatedGame.Title;
        existingGame.Description = updatedGame.Description;
        existingGame.Genre = updatedGame.Genre;
        existingGame.Status = updatedGame.Status;
        existingGame.UpdatedAt = DateTime.UtcNow;

        await _gameRepository.UpdateAsync(existingGame);
    }

    public async Task DeleteGameAsync(Guid id, Guid userId)
    {
        var game = await _gameRepository.GetByIdAsync(id);
        if (game == null)
        {
            throw new KeyNotFoundException("Jogo não encontrado.");
        }

        if (game.OwnerId != userId)
        {
            throw new UnauthorizedAccessException("Você não tem permissão para deletar este jogo.");
        }

        await _gameRepository.DeleteAsync(id);
    }
}

