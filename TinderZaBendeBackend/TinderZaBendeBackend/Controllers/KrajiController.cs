using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinderZaBendeBackend.Data;
using TinderZaBendeBackend.Models.Entities;

namespace TinderZaBendeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KrajiController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public KrajiController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET: api/kraji
        [HttpGet]
        public async Task<ActionResult<List<Kraj>>> GetAll()
            => await _db.Kraji.ToListAsync();

        // GET: api/kraji/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Kraj>> GetById(int id)
        {
            var kraj = await _db.Kraji.FindAsync(id);
            return kraj is null ? NotFound() : Ok(kraj);
        }

        // POST: api/kraji
        [HttpPost]
        public async Task<ActionResult<Kraj>> Create(Kraj kraj)
        {
            _db.Kraji.Add(kraj);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = kraj.Id }, kraj);
        }

        // PUT: api/kraji/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Kraj updated)
        {
            var existing = await _db.Kraji.FindAsync(id);
            if (existing is null) return NotFound();

            existing.ime = updated.ime;
            existing.posta = updated.posta;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/kraji/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _db.Kraji.FindAsync(id);
            if (existing is null) return NotFound();

            _db.Kraji.Remove(existing);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}