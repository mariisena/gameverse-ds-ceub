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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurações adicionais do modelo (ex: índices únicos)
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }
}
