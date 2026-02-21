namespace TinderZaBendeBackend.Models.Entities;
using System.ComponentModel.DataAnnotations.Schema;
[Table("Uporabniki")]
public class Uporabnik
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("ime")]
    public required string Ime { get; set; }

    [Column("bio")]
    public string? bio { get; set; }

    [Column("instrument")]
    public required string instrument { get; set; }

    [Column("zanr")]
    public string? zanr { get; set; }

    [Column("eposta")]
    public required string email { get; set; }

    [Column("telefon")]
    public required string telefon { get; set; }

    [Column("geslo")]
    public required string geslo { get; set; }

    [Column("kraj_id")]
    public int? kraj_id { get; set; }
}