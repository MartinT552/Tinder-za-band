namespace TinderZaBendeBackend.Models.Entities;
using System.ComponentModel.DataAnnotations.Schema;



[Table("Objave")]
public class Objava
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("opis")]
    public string? opis { get; set; }

    [Column("aktiven")]
    public bool aktiven { get; set; }

    [Column("ustvarjen")]
    public DateTime ustvarjen { get; set; }

    [Column("band_id")]
    public int band_id { get; set; }
}