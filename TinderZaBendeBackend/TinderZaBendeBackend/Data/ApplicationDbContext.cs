using Microsoft.EntityFrameworkCore;
using TinderZaBendeBackend.Models.Entities;

namespace TinderZaBendeBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Uporabnik> Uporabniki { get; set; }
        public DbSet<Band> Band { get; set; }
        public DbSet<Kraj> Kraji { get; set; }
        public DbSet<Objava> Objave { get; set; }
        public DbSet<Match> Match { get; set; }
        public DbSet<BandClan> BandClani { get; set; }
        public DbSet<GlasbenikObjavaLike> GlasbenikObjavaLike { get; set; }
        public DbSet<BendUporabnikLike> BendUporabnikLike { get; set; }
    }
}