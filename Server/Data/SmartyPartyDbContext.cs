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

        // Define your DbSets (tables) here
        public DbSet<User> Users { get; set; }
    }
}