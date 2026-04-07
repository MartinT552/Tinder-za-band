using System.ComponentModel.DataAnnotations;

namespace TinderZaBendeBackend.DTO
{
    public class BandDTO
    {
        [Required]
        public string Ime { get; set; }

        public string? Opis { get; set; }

        public int? Kraj_Id { get; set; }

        public IFormFile? Slika { get; set; }
    }
}
