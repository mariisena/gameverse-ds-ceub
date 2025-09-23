// GameVerse.Application/Services/AuthService.cs

using GameVerse.Domain;
using GameVerse.Application.Interfaces;

namespace GameVerse.Application.Services;

public class AuthService
{
    private readonly IUserRepository _userRepository;

    // Agora pedimos a interface, não a classe concreta do DbContext
    public AuthService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User> RegisterUserAsync(string fullName, string username, string email, string password)
    {
        // Futuramente, adicionaremos a verificação de e-mail/usuário duplicado aqui.

        // 2. CRIPTOGRAFIA DE SENHA REAL
        // Substituímos a simulação pela chamada ao BCrypt.
        // O método HashPassword já gera o "sal" e o incorpora no hash final.
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password); // <--- ESTA É A MUDANÇA!

        // 3. Criar a nova entidade de usuário
        var newUser = new User
        {
            FullName = fullName,
            Username = username,
            Email = email,
            HashedPassword = hashedPassword // Agora estamos salvando o hash real
        };
        // 4. Adicionar ao DbContext e salvar no banco de dados
        await _userRepository.AddUserAsync(newUser);

        return newUser;
    }

    // 3. MÉTODO DE LOGIN
    public async Task<User?> LoginUserAsync(string identifier, string password)
    {
        // 1. Encontrar o usuário pelo e-mail OU pelo username (ignorando maiúsculas/minúsculas)
        var user = await _userRepository.FindUserByIdentifierAsync(identifier);

        if (user == null)
        {
            return null; // Usuário não encontrado
        }

        // 2. Verificar se a senha fornecida corresponde ao hash salvo no banco
        // Usamos o método Verify do BCrypt.
        bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(password, user.HashedPassword);

        if (!isPasswordCorrect)
        {
            return null; // Senha incorreta
        }

        // 3. Se tudo estiver correto, retorna o objeto do usuário
        return user;
    }
}
