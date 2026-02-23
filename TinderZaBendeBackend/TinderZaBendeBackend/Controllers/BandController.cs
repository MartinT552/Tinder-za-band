using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinderZaBendeBackend.Data;
using TinderZaBendeBackend.Models.Entities;


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

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Band>> GetById(int id)
        {
            var band = await _db.Band.FindAsync(id);
            return band is null ? NotFound() : Ok(band);
        }

        [HttpPost]
        public async Task<ActionResult<Band>> Create(Band band)
        {
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