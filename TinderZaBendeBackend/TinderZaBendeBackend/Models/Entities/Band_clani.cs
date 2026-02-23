namespace TinderZaBendeBackend.Models.Entities;
using System.ComponentModel.DataAnnotations.Schema;


[Table("band_clani")]
public class BandClan
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("band_id")]
    public int band_id { get; set; }

    [Column("uporabnik_id")]
    public int uporabnik_id { get; set; }

    [Column("datum_pridruzitve")]
    public DateTime datum_pridruzitve { get; set; }
}