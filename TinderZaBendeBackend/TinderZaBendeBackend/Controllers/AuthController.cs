using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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
        private readonly IConfiguration _config;

        public AuthController(ApplicationDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
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

            user.geslo = _passwordHasher.HashPassword(user, dto.Password);

            _db.Uporabniki.Add(user);
            await _db.SaveChangesAsync();

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

            PasswordVerificationResult result;
            try
            {
                result = _passwordHasher.VerifyHashedPassword(user, user.geslo, dto.Password);
            }
            catch (FormatException)
            {
                return Unauthorized("Napačen email ali geslo.");
            }

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Napačen email ali geslo.");

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Ime,
                    Email = user.email
                }
            });
        }

        // GET: api/auth/me
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
                      ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (string.IsNullOrWhiteSpace(sub) || !int.TryParse(sub, out var userId))
                return Unauthorized();

            var user = await _db.Uporabniki
                .Where(u => u.Id == userId)
                .Select(u => new
                {
                    u.Id,
                    u.Ime,
                    Email = u.email
                })
                .FirstOrDefaultAsync();

            return user is null ? NotFound() : Ok(user);
        }

        private string GenerateJwtToken(Uporabnik user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.email),
                new Claim("ime", user.Ime)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddMinutes(
                double.Parse(_config["Jwt:ExpiresMinutes"] ?? "120")
            );

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}