using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinderZaBendeBackend.Data;
using TinderZaBendeBackend.Models.Entities;

namespace TinderZaBendeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchingController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public MatchingController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("objave-za-uporabnika/{uporabnikId:int}")]
        public async Task<IActionResult> GetObjaveZaUporabnika(int uporabnikId)
        {
            var uporabnik = await _db.Uporabniki.FirstOrDefaultAsync(u => u.Id == uporabnikId);

            if (uporabnik == null)
                return NotFound("Uporabnik ne obstaja.");

            if (uporabnik.kraj_id == null)
                return BadRequest("Uporabnik nima nastavljenega kraja.");

            var ocenjeneObjaveIds = await _db.GlasbenikObjavaLike
                .Where(x => x.uporabnik_id == uporabnikId)
                .Select(x => x.objava_id)
                .ToListAsync();

            var objave = await _db.Objave
                .Join(_db.Band,
                    objava => objava.band_id,
                    band => band.Id,
                    (objava, band) => new { objava, band })
                .Where(x =>
                    x.objava.aktiven &&
                    x.band.kraj_id == uporabnik.kraj_id &&
                    !ocenjeneObjaveIds.Contains(x.objava.Id))
                .Select(x => new
                {
                    id = x.objava.Id,
                    opis = x.objava.opis,
                    aktiven = x.objava.aktiven,
                    ustvarjen = x.objava.ustvarjen,
                    band_id = x.band.Id,
                    band_ime = x.band.ime,
                    band_opis = x.band.opis,
                    band_slike = x.band.slike,
                    kraj_id = x.band.kraj_id
                })
                .ToListAsync();

            return Ok(objave);
        }

        [HttpGet("uporabniki-za-band/{bandId:int}")]
        public async Task<IActionResult> GetUporabnikiZaBand(int bandId)
        {
            var band = await _db.Band.FirstOrDefaultAsync(b => b.Id == bandId);

            if (band == null)
                return NotFound("Band ne obstaja.");

            if (band.kraj_id == null)
                return BadRequest("Band nima nastavljenega kraja.");

            var ocenjeniUporabnikiIds = await _db.BendUporabnikLike
                .Where(x => x.objava_id == bandId)
                .Select(x => x.uporabnik_id)
                .ToListAsync();

            // Poišèi vse uporabnike ki imajo band
            var uporabnikiZBandom = await _db.Band
                .Select(b => b.owner_uporabnik_id)
                .ToListAsync();

            var uporabniki = await _db.Uporabniki
                .Where(u =>
                    u.kraj_id == band.kraj_id &&
                    !ocenjeniUporabnikiIds.Contains(u.Id) &&
                    !uporabnikiZBandom.Contains(u.Id))  // ? izkljuèi uporabnike z bandom
                .Select(u => new
                {
                    id = u.Id,
                    ime = u.Ime,
                    bio = u.bio,
                    instrument = u.instrument,
                    zanr = u.zanr,
                    email = u.email,
                    telefon = u.telefon,
                    kraj_id = u.kraj_id,
                    slika = u.slika
                })
                .ToListAsync();

            return Ok(uporabniki);
        }

        [HttpPost("glasbenik-oceni-objavo")]
        public async Task<IActionResult> GlasbenikOceniObjavo([FromBody] GlasbenikOceniObjavoDto dto)
        {
            var obstaja = await _db.GlasbenikObjavaLike
                .AnyAsync(x => x.uporabnik_id == dto.UporabnikId && x.objava_id == dto.ObjavaId);

            if (obstaja)
                return BadRequest("Ta objava je že bila ocenjena.");

            var objava = await _db.Objave.FirstOrDefaultAsync(o => o.Id == dto.ObjavaId);
            if (objava == null)
                return NotFound("Objava ne obstaja.");

            var zapis = new GlasbenikObjavaLike
            {
                uporabnik_id = dto.UporabnikId,
                objava_id = dto.ObjavaId,
                dolocitev = dto.Dolocitev,
                datum = DateTime.UtcNow
            };

            _db.GlasbenikObjavaLike.Add(zapis);
            await _db.SaveChangesAsync();

            bool isMatch = false;

            if (dto.Dolocitev.ToLower() == "like")
            {
                var bandLike = await _db.BendUporabnikLike.AnyAsync(x =>
                    x.objava_id == objava.band_id &&
                    x.uporabnik_id == dto.UporabnikId &&
                    x.dolocitev.ToLower() == "like");

                if (bandLike)
                {
                    var matchObstaja = await _db.Match.AnyAsync(m =>
                        m.uporabnik_id == dto.UporabnikId &&
                        m.objava_id == dto.ObjavaId);

                    if (!matchObstaja)
                    {
                        _db.Match.Add(new Match
                        {
                            uporabnik_id = dto.UporabnikId,
                            objava_id = dto.ObjavaId,
                            datum_matcha = DateTime.UtcNow
                        });

                        await _db.SaveChangesAsync();
                    }

                    isMatch = true;
                }
            }

            return Ok(new { message = "Shranjeno.", isMatch });
        }

        [HttpPost("band-oceni-uporabnika")]
        public async Task<IActionResult> BandOceniUporabnika([FromBody] BandOceniUporabnikaDto dto)
        {
            // Poišèi zadnjo objavo banda
            var zadnjaObjava = await _db.Objave
                .Where(o => o.band_id == dto.BandId)
                .OrderByDescending(o => o.ustvarjen)
                .FirstOrDefaultAsync();

            if (zadnjaObjava == null)
                return BadRequest("Band nima nobene objave.");

            var obstaja = await _db.BendUporabnikLike
                .AnyAsync(x => x.objava_id == zadnjaObjava.Id && x.uporabnik_id == dto.UporabnikId);

            if (obstaja)
                return BadRequest("Ta uporabnik je že bil ocenjen.");

            var zapis = new BendUporabnikLike
            {
                objava_id = zadnjaObjava.Id,  // ? objava_id, ne band_id
                uporabnik_id = dto.UporabnikId,
                dolocitev = dto.Dolocitev,
                datum = DateTime.UtcNow
            };

            _db.BendUporabnikLike.Add(zapis);
            await _db.SaveChangesAsync();

            bool isMatch = false;

            if (dto.Dolocitev.ToLower() == "like")
            {
                var userLike = await _db.GlasbenikObjavaLike.AnyAsync(x =>
                    x.uporabnik_id == dto.UporabnikId &&
                    x.objava_id == zadnjaObjava.Id &&
                    x.dolocitev.ToLower() == "like");

                if (userLike)
                {
                    var matchObstaja = await _db.Match.AnyAsync(m =>
                        m.uporabnik_id == dto.UporabnikId &&
                        m.objava_id == zadnjaObjava.Id);

                    if (!matchObstaja)
                    {
                        _db.Match.Add(new Match
                        {
                            uporabnik_id = dto.UporabnikId,
                            objava_id = zadnjaObjava.Id,
                            datum_matcha = DateTime.UtcNow
                        });

                        await _db.SaveChangesAsync();
                    }

                    isMatch = true;
                }
            }

            return Ok(new { message = "Shranjeno.", isMatch });
        }
        [HttpGet("moji-matchi/{uporabnikId:int}")]
        public async Task<IActionResult> GetMojiMatchi(int uporabnikId)
        {
            var matchi = await _db.Match
                .Where(m => m.uporabnik_id == uporabnikId)
                .Join(_db.Objave,
                    match => match.objava_id,
                    objava => objava.Id,
                    (match, objava) => new { match, objava })
                .Join(_db.Band,
                    x => x.objava.band_id,
                    band => band.Id,
                    (x, band) => new { x.match, x.objava, band })
                .Join(_db.Uporabniki,
                    x => x.band.owner_uporabnik_id,
                    owner => owner.Id,
                    (x, owner) => new
                    {
                        datum_matcha = x.match.datum_matcha,
                        band_id = x.band.Id,
                        band_ime = x.band.ime,
                        band_opis = x.band.opis,
                        band_slike = x.band.slike,
                        owner_ime = owner.Ime,
                        owner_email = owner.email,
                        owner_telefon = owner.telefon,
                        owner_instrument = owner.instrument,
                        owner_slika = owner.slika
                    })
                .ToListAsync();

            return Ok(matchi);
        }

        [HttpGet("moji-matchi-band/{bandId:int}")]
        public async Task<IActionResult> GetMojiMatchiBand(int bandId)
        {
            var objaveIds = await _db.Objave
                .Where(o => o.band_id == bandId)
                .Select(o => o.Id)
                .ToListAsync();

            var matchi = await _db.Match
                .Where(m => objaveIds.Contains(m.objava_id))
                .Join(_db.Uporabniki,
                    match => match.uporabnik_id,
                    user => user.Id,
                    (match, user) => new
                    {
                        datum_matcha = match.datum_matcha,
                        uporabnik_id = user.Id,
                        ime = user.Ime,
                        instrument = user.instrument,
                        zanr = user.zanr,
                        bio = user.bio,
                        slika = user.slika,
                        telefon = user.telefon,
                        email = user.email
                    })
                .ToListAsync();

            return Ok(matchi);
        }
    }

    public class GlasbenikOceniObjavoDto
    {
        public int UporabnikId { get; set; }
        public int ObjavaId { get; set; }
        public string Dolocitev { get; set; } = "";
    }

    public class BandOceniUporabnikaDto
    {
        public int BandId { get; set; }
        public int UporabnikId { get; set; }
        public string Dolocitev { get; set; } = "";
    }
}