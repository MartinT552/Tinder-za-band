using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinderZaBendeBackend.Data;
using TinderZaBendeBackend.Models.Entities;

namespace TinderZaBendeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public MatchController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET: api/match
        [HttpGet]
        public async Task<ActionResult<List<Match>>> GetAll()
            => await _db.Match.ToListAsync();

        // GET: api/match/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Match>> GetById(int id)
        {
            var match = await _db.Match.FindAsync(id);
            return match is null ? NotFound() : Ok(match);
        }

        // POST: api/match
        [HttpPost]
        public async Task<ActionResult<Match>> Create(Match match)
        {
            match.datum_matcha = DateTime.UtcNow;

            _db.Match.Add(match);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = match.Id }, match);
        }

        // DELETE: api/match/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _db.Match.FindAsync(id);
            if (existing is null) return NotFound();

            _db.Match.Remove(existing);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}