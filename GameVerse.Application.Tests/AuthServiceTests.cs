using Xunit;
using Moq;
using FluentAssertions;
using GameVerse.Application.Services;
using GameVerse.Application.Interfaces;
using GameVerse.Domain;

namespace GameVerse.Application.Tests;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _authService = new AuthService(_userRepositoryMock.Object);
    }

    [Fact]
    public async Task RegisterUserAsync_Should_HashPassword()
    {
        // Arrange
        var password = "plainPassword123";
        var user = new User { Email = "test@test.com", FullName = "Test User", Username = "testuser", HashedPassword = password };

        // Act
        var result = await _authService.RegisterUserAsync(user.FullName, user.Username, user.Email, password);

        // Assert
        result.HashedPassword.Should().NotBe(password);
        BCrypt.Net.BCrypt.Verify(password, result.HashedPassword).Should().BeTrue();
    }

    [Fact]
    public async Task LoginUserAsync_Should_ReturnUser_WhenCredentialsAreValid()
    {
        // Arrange
        var password = "correctPassword";
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        var user = new User { Email = "test@test.com", HashedPassword = hashedPassword };
        _userRepositoryMock.Setup(repo => repo.FindUserByIdentifierAsync(user.Email)).ReturnsAsync(user);

        // Act
        var result = await _authService.LoginUserAsync(user.Email, password);

        // Assert
        result.Should().NotBeNull();
        result.Should().Be(user);
    }

    [Fact]
    public async Task LoginUserAsync_Should_ReturnNull_WhenPasswordIsInvalid()
    {
        // Arrange
        var correctPassword = "correctPassword";
        var incorrectPassword = "incorrectPassword";
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(correctPassword);
        var user = new User { Email = "test@test.com", HashedPassword = hashedPassword };
        _userRepositoryMock.Setup(repo => repo.FindUserByIdentifierAsync(user.Email)).ReturnsAsync(user);

        // Act
        var result = await _authService.LoginUserAsync(user.Email, incorrectPassword);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task LoginUserAsync_Should_ReturnNull_WhenUserDoesNotExist()
    {
        // Arrange
        var email = "nonexistent@test.com";
        _userRepositoryMock.Setup(repo => repo.FindUserByIdentifierAsync(email)).ReturnsAsync((User?)null);

        // Act
        var result = await _authService.LoginUserAsync(email, "anypassword");

        // Assert
        result.Should().BeNull();
    }
}