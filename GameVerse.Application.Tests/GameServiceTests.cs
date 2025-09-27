using Xunit;
using Moq;
using FluentAssertions;
using GameVerse.Application.Services;
using GameVerse.Application.Interfaces;
using GameVerse.Domain;

namespace GameVerse.Application.Tests;

public class GameServiceTests
{
    private readonly Mock<IGameRepository> _gameRepositoryMock;
    private readonly GameService _gameService;

    public GameServiceTests()
    {
        _gameRepositoryMock = new Mock<IGameRepository>();
        _gameService = new GameService(_gameRepositoryMock.Object);
    }

    [Fact]
    public async Task UpdateGameAsync_Should_ThrowUnauthorizedAccessException_WhenUserIsNotOwner()
    {
        // Arrange
        var ownerId = Guid.NewGuid();
        var attackerId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var existingGame = new Game { Id = gameId, OwnerId = ownerId, Title = "Original Title" };
        var updatedGame = new Game { Title = "Updated Title" };

        _gameRepositoryMock.Setup(repo => repo.GetByIdAsync(gameId)).ReturnsAsync(existingGame);

        // Act
        Func<Task> act = async () => await _gameService.UpdateGameAsync(gameId, updatedGame, attackerId);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Você não tem permissão para editar este jogo.");
    }
}