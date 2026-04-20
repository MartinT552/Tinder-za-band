using System.ComponentModel.DataAnnotations;

namespace TinderZaBendeBackend.DTO
{
    public class RegisterDTO
    {
        [Required]
        public string Ime { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Telefon { get; set; }

        [Required]
        public string Instrument { get; set; }

        public int? Kraj_Id { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        public IFormFile? Slika { get; set; }

    }
}
