using Server.Helpers;
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
                new User
                {
                    Username = "admin",
                    Password = PasswordHasher.HashPassword("admin"),
                    Email = "admin@test.com"
            },
                new User
                {
                    Username = "max",
                    Password = PasswordHasher.HashPassword("Pa$$w0rd"),
                    Email = "max@test.com"
                },
            };

            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
        }
    }
}