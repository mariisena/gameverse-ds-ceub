using System.ComponentModel.DataAnnotations;

namespace GameVerse.Domain;

public class Game
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid OwnerId { get; set; } // Chave estrangeira para o usuário dono do jogo
    public User Owner { get; set; } = null!; // Propriedade de navegação

    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [StringLength(50)]
    public string Genre { get; set; } = string.Empty;

    [StringLength(20)]
    public string Status { get; set; } = "in-development";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

