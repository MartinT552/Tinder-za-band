namespace TinderZaBendeBackend.Models.Entities
{
    public class Uporabnik
    {
        public Guid Id { get; set; }    

        public required string Ime { get; set; }
        public  string? bio { get; set; }
        public required string instrument { get; set; }
        public  string? zanr { get; set; }
        public required string email { get; set; }
        public required string telefon { get; set; }
        public required string geslo { get; set; }
        
        public int? kraj_id { get; set; }
    }
}
