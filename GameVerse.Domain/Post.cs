using System.ComponentModel.DataAnnotations;

namespace GameVerse.Domain;

public class Post
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid AuthorId { get; set; } // FK para o User que escreveu o post
    public User Author { get; set; } = null!;

    public Guid? GameId { get; set; } // FK opcional para o Game ao qual o devlog está associado
    public Game? Game { get; set; } = null!;

    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string BodyContent { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string PostType { get; set; } = "devlog"; // Ex: 'devlog', 'simple_post'

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

