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
    }
}