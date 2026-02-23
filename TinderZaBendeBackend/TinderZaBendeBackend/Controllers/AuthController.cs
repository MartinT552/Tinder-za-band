using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinderZaBendeBackend.Data;
using TinderZaBendeBackend.DTO;
using TinderZaBendeBackend.Models.Entities;

namespace TinderZaBendeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly PasswordHasher<Uporabnik> _passwordHasher;

        public AuthController(ApplicationDbContext db)
        {
            _db = db;
            _passwordHasher = new PasswordHasher<Uporabnik>();
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var email = dto.Email.Trim().ToLower();

            var exists = await _db.Uporabniki.AnyAsync(x => x.email.ToLower() == email);
            if (exists)
                return BadRequest("Email že obstaja.");

 

            var user = new Uporabnik
            {
                Ime = dto.Ime.Trim(),
                email = email,
                telefon = dto.Telefon.Trim(),
                instrument = dto.Instrument.Trim(),
                kraj_id = dto.Kraj_Id
            };

            // Hash password -> shrani v user.geslo
            user.geslo = _passwordHasher.HashPassword(user, dto.Password);

            _db.Uporabniki.Add(user);
            await _db.SaveChangesAsync();

            // Ne vračaj gesla/hashev
            return StatusCode(201, new
            {
                user.Id,
                user.Ime,
                Email = user.email,
                user.telefon,
                user.instrument,
                user.kraj_id
            });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var email = dto.Email.Trim().ToLower();

            var user = await _db.Uporabniki.FirstOrDefaultAsync(x => x.email.ToLower() == email);
            if (user == null)
                return Unauthorized("Napačen email ali geslo.");

            var result = _passwordHasher.VerifyHashedPassword(user, user.geslo, dto.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Napačen email ali geslo.");


            return Ok(new
            {
                Message = "Login uspešen",
                user.Id,
                user.Ime,
                Email = user.email
            });
        }
    }
}