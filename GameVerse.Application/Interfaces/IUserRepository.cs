// GameVerse.Application/Interfaces/IUserRepository.cs

using GameVerse.Domain;

namespace GameVerse.Application.Interfaces;

public interface IUserRepository
{
    Task AddUserAsync(User user);
    Task<User?> FindUserByIdentifierAsync(string identifier);

    // No futuro, podemos adicionar outros métodos aqui, como:
    // Task<User?> GetUserByEmailAsync(string email);
}
