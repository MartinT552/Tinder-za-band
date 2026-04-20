using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinderZaBendeBackend.Data;
using TinderZaBendeBackend.Models.Entities;

namespace TinderZaBendeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ObjaveController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ObjaveController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET: api/objave
        [HttpGet]
        public async Task<ActionResult<List<Objava>>> GetAll()
            => await _db.Objave.ToListAsync();

        // GET: api/objave/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Objava>> GetById(int id)
        {
            var objava = await _db.Objave.FindAsync(id);
            return objava is null ? NotFound() : Ok(objava);
        }

        // POST: api/objave
        [HttpPost]
        public async Task<ActionResult<Objava>> Create(Objava objava)
        {
            objava.ustvarjen = DateTime.UtcNow;

            _db.Objave.Add(objava);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = objava.Id }, objava);
        }

        // PUT: api/objave/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Objava updated)
        {
            var existing = await _db.Objave.FindAsync(id);
            if (existing is null) return NotFound();

            existing.opis = updated.opis;
            existing.aktiven = updated.aktiven;
            existing.band_id = updated.band_id;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/objave/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _db.Objave.FindAsync(id);
            if (existing is null) return NotFound();

            _db.Objave.Remove(existing);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}