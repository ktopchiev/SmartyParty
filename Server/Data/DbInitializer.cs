using Server.Models;

namespace Server.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(SmartyPartyDbContext context)
        {
            if (context.Users.Any())
            {
                return;
            }

            // Seed the database with initial data
            var users = new[]
            {
                new User { Username = "admin", Password = "admin", Email = "admin@test.com" },
                new User { Username = "max", Password = "Pa$$w0rd", Email = "max@test.com" },
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }
    }
}