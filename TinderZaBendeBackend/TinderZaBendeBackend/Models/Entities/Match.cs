namespace TinderZaBendeBackend.Models.Entities;
using System.ComponentModel.DataAnnotations.Schema;


[Table("Match")]
public class Match
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("datum_matcha")]
    public DateTime datum_matcha { get; set; }

    [Column("uporabnik_id")]
    public int uporabnik_id { get; set; }

    [Column("objava_id")]
    public int objava_id { get; set; }
}