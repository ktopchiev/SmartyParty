using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data
{
    public class SmartyPartyDbContext : DbContext
    {
        public SmartyPartyDbContext(DbContextOptions<SmartyPartyDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}