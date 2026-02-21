using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinderZaBendeBackend.Data;
using TinderZaBendeBackend.Models.Entities;

namespace TinderZaBendeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UporabnikiController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public UporabnikiController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET: api/uporabniki
        [HttpGet]
        public async Task<ActionResult<List<Uporabnik>>> GetAll()
            => await _db.Uporabniki.ToListAsync();

        // GET: api/uporabniki/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Uporabnik>> GetById(int id)
        {
            var u = await _db.Uporabniki.FindAsync(id);
            return u is null ? NotFound() : Ok(u);
        }

        // POST: api/uporabniki
        [HttpPost]
        public async Task<ActionResult<Uporabnik>> Create(Uporabnik uporabnik)
        {
      
            _db.Uporabniki.Add(uporabnik);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = uporabnik.Id }, uporabnik);
        }

        // PUT: api/uporabniki/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Uporabnik updated)
        {
            var existing = await _db.Uporabniki.FindAsync(id);
            if (existing is null) return NotFound();

            existing.Ime = updated.Ime;
            existing.bio = updated.bio;
            existing.instrument = updated.instrument;
            existing.zanr = updated.zanr;
            existing.email = updated.email;
            existing.telefon = updated.telefon;
            existing.geslo = updated.geslo;
            existing.kraj_id = updated.kraj_id;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/uporabniki/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _db.Uporabniki.FindAsync(id);
            if (existing is null) return NotFound();

            _db.Uporabniki.Remove(existing);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}