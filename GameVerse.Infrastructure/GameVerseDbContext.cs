// SuaPlataforma.Infrastructure/PlataformaDbContext.cs

using Microsoft.EntityFrameworkCore;
using GameVerse.Domain; // Importa o namespace do nosso domínio

namespace GameVerse.Infrastructure;

public class GameVerseDbContext : DbContext
{
    public GameVerseDbContext(DbContextOptions<GameVerseDbContext> options) : base(options)
    {
    }

    // Mapeia nossa classe User para uma tabela chamada "Users" no banco de dados
    public DbSet<User> Users { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<Post> Posts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuração da entidade User
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Configuração da nova entidade Game
        modelBuilder.Entity<Game>()
            .HasOne(g => g.Owner) // Um Jogo tem um Dono
            .WithMany() // Um Dono (User) pode ter muitos Jogos
            .HasForeignKey(g => g.OwnerId) // A chave estrangeira é OwnerId
            .OnDelete(DeleteBehavior.Cascade); // Se um usuário for deletado, seus jogos também são.

        // Configuração da nova entidade Post
        modelBuilder.Entity<Post>()
            .HasOne(p => p.Author) // Um Post tem um Autor
            .WithMany() // Um Autor (User) pode ter muitos Posts
            .HasForeignKey(p => p.AuthorId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Post>()
            .HasOne(p => p.Game) // Um Post pode estar associado a um Jogo
            .WithMany() // Um Jogo pode ter muitos Posts
            .HasForeignKey(p => p.GameId)
            .OnDelete(DeleteBehavior.SetNull); // Se um jogo for deletado, o GameId no post se torna nulo

    }
}