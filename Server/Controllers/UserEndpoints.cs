using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs;
using Server.Helpers;
using Server.Models;

namespace Server.Endpoints
{
    public static class UserEndpoints
    {
        public static void MapUserEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("api/user").WithTags(nameof(User));
            group.MapPost("register", RegisterUser).WithName(nameof(RegisterUser));
            group.MapPost("login", LoginUser).WithName(nameof(LoginUser));
        }

        public static async Task<IResult> RegisterUser(RegisterDto registerDto, SmartyPartyDbContext dbContext)
        {
            if (string.IsNullOrWhiteSpace(registerDto.Username) || string.IsNullOrWhiteSpace(registerDto.Password))
            {
                return Results.BadRequest("Username and password are required");
            }

            var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Username == registerDto.Username);

            if (existingUser != null)
            {
                return Results.Conflict("User already exists");
            }

            var user = new User
            {
                Username = registerDto.Username,
                Password = PasswordHasher.HashPassword(registerDto.Password), // Placeholder for password hashing
                // Hash the password here in a real WebApplication
                Email = registerDto.Email
            };

            await dbContext.Users.AddAsync(user);
            await dbContext.SaveChangesAsync();
            //JWT token generation would go here
            return Results.Created();
        }

        public static async Task<IResult> LoginUser(LoginDto loginDto, SmartyPartyDbContext dbContext)
        {
            if (string.IsNullOrWhiteSpace(loginDto.Username) || string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return Results.BadRequest("Username and password are required");
            }

            var user = await dbContext.Users
                .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null)
            {
                return Results.NotFound("User not found");
            }

            if (!PasswordHasher.VerifyPassword(loginDto.Password, user.Password))
            {
                return Results.NotFound("Invalid password");
            }

            //JWT token generation would go here
            return Results.Ok(user);
        }

    }
}