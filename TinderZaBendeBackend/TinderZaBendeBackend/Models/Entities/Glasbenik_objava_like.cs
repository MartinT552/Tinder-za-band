namespace TinderZaBendeBackend.Models.Entities;
using System.ComponentModel.DataAnnotations.Schema;



[Table("glasbenik_objava_like")]
public class GlasbenikObjavaLike
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public int Id { get; set; }

    [Column("dolocitev")]
    public required string dolocitev { get; set; }

    [Column("datum")]
    public DateTime datum { get; set; }

    [Column("objava_id")]
    public int objava_id { get; set; }

    [Column("uporabnik_id")]
    public int uporabnik_id { get; set; }
}