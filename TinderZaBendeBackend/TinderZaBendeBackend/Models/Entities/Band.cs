namespace TinderZaBendeBackend.Models.Entities;
using System.ComponentModel.DataAnnotations.Schema;

[Table("band")]
public class Band
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("ime")]
    public required string ime { get; set; }

    [Column("opis")]
    public string? opis { get; set; }

    [Column("kraj_id")]
    public int? kraj_id { get; set; }

    [Column("owner_uporabnik_id")]
    public int owner_uporabnik_id { get; set; }

    [Column("slike")]
    public string? slike { get; set; }
}