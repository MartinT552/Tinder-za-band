namespace TinderZaBendeBackend.Models.Entities;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Kraji")]
public class Kraj
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("ime")]
    public required string ime { get; set; }

    [Column("posta")]
    public int posta { get; set; }
}