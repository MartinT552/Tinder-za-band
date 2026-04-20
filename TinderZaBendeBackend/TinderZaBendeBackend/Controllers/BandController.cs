using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinderZaBendeBackend.Data;
using TinderZaBendeBackend.Models.Entities;
using TinderZaBendeBackend.DTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;

namespace TinderZaBendeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BandController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public BandController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<Band>>> GetAll()
            => await _db.Band.ToListAsync();

        [Authorize]
        [HttpGet("moj")]
        public async Task<IActionResult> GetMojBand()
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
                      ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var userId))
                return Unauthorized();

            var band = await _db.Band.FirstOrDefaultAsync(b => b.owner_uporabnik_id == userId);
            return band is null ? NotFound() : Ok(band);
        }

        [Authorize]
        [HttpPost("objava")]
        public async Task<IActionResult> UstvariObjavo([FromBody] UstvariObjavoDTO dto)
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
                      ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var userId))
                return Unauthorized();

            var band = await _db.Band.FirstOrDefaultAsync(b => b.owner_uporabnik_id == userId);
            if (band == null)
                return NotFound("Nimaš banda.");

            var objava = new Objava
            {
                opis = dto.Opis,
                aktiven = true,
                ustvarjen = DateTime.UtcNow,
                band_id = band.Id
            };

            _db.Objave.Add(objava);
            await _db.SaveChangesAsync();

            return Ok(objava);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Band>> GetById(int id)
        {
            var band = await _db.Band.FindAsync(id);
            return band is null ? NotFound() : Ok(band);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Band>> Create([FromForm] BandDTO dto)
        {
            // Vzemi userId iz tokena
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
                      ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var userId))
                return Unauthorized();

            // Obdelaj sliko
            string? slikaPot = null;
            if (dto.Slika != null && dto.Slika.Length > 0)
            {
                var dovoljeneKoncnice = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                var koncnica = Path.GetExtension(dto.Slika.FileName).ToLower();
                if (!dovoljeneKoncnice.Contains(koncnica))
                    return BadRequest("Nepodprta vrsta datoteke.");

                if (dto.Slika.Length > 5 * 1024 * 1024)
                    return BadRequest("Slika je prevelika (max 5MB).");

                var mapa = Path.Combine("wwwroot", "slike");
                Directory.CreateDirectory(mapa);

                var imeDate = $"{Guid.NewGuid()}{koncnica}";
                var polnaPot = Path.Combine(mapa, imeDate);

                using var stream = new FileStream(polnaPot, FileMode.Create);
                await dto.Slika.CopyToAsync(stream);

                slikaPot = $"/slike/{imeDate}";
            }

            var band = new Band
            {
                ime = dto.Ime,
                opis = dto.Opis,
                kraj_id = dto.Kraj_Id,
                owner_uporabnik_id = userId,
                slike = slikaPot
            };

            _db.Band.Add(band);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = band.Id }, band);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Band updated)
        {
            var existing = await _db.Band.FindAsync(id);
            if (existing is null) return NotFound();
            existing.ime = updated.ime;
            existing.opis = updated.opis;
            existing.kraj_id = updated.kraj_id;
            existing.owner_uporabnik_id = updated.owner_uporabnik_id;
            existing.slike = updated.slike;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _db.Band.FindAsync(id);
            if (existing is null) return NotFound();
            _db.Band.Remove(existing);
            await _db.SaveChangesAsync();
            return NoContent();
        }

      
    }
}