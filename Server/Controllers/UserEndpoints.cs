using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs;
using Server.Helpers;
using Server.Models;
using Server.Services;

namespace Server.Endpoints
{
    public static class UserEndpoints
    {

        public static void MapUserEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("api/user").WithTags(nameof(User));
            group.MapPost("register", RegisterUser).WithName(nameof(RegisterUser));
            group.MapPost("login", LoginUser).WithName(nameof(LoginUser));
            group.MapPost("refresh", Refresh).WithName(nameof(Refresh)).RequireAuthorization();
        }

        public static async Task<IResult> RegisterUser(RegisterDto registerDto, SmartyPartyDbContext dbContext)
        {
            if (string.IsNullOrWhiteSpace(registerDto.Username) || string.IsNullOrWhiteSpace(registerDto.Password))
            {
                return Results.BadRequest(new { message = "Username and password are required" });
            }

            var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Username == registerDto.Username);

            if (existingUser != null)
            {
                return Results.Conflict(new { message = "User already exists" });
            }

            var user = new User
            {
                Username = registerDto.Username,
                Password = PasswordHasher.HashPassword(registerDto.Password),
                Email = registerDto.Email
            };

            await dbContext.Users.AddAsync(user);
            await dbContext.SaveChangesAsync();
            return Results.Created();
        }

        public static async Task<IResult> LoginUser(LoginDto loginDto, SmartyPartyDbContext dbContext, IConfiguration _conf, TokenService tokenService)
        {
            if (string.IsNullOrWhiteSpace(loginDto.Username) || string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return Results.BadRequest(new { message = "Username and password are required" });
            }

            var user = await dbContext.Users
                .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null)
            {
                return Results.NotFound(new { message = "User not found" });
            }

            if (!PasswordHasher.VerifyPassword(loginDto.Password, user.Password))
            {
                return Results.NotFound(new { message = "Invalid password" });
            }

            var token = tokenService.GenerateJwtToken(user);

            if (string.IsNullOrWhiteSpace(token))
            {
                return Results.BadRequest(new { message = "Token generation failed" });
            }

            return Results.Ok(user.ToUserResponse(token));
        }

        public static async Task<IResult> Refresh(TokenService tokenService, HttpContext httpContext, SmartyPartyDbContext dbContext)
        {
            var userPrincipal = httpContext.User;
            if (userPrincipal == null || !userPrincipal.Identity.IsAuthenticated)
            {
                return Results.Unauthorized();
            }

            var user = await dbContext.Users
                .FirstOrDefaultAsync(u => u.Username == userPrincipal.Identity.Name);

            if (user == null)
            {
                return Results.NotFound(new { message = "User not found" });
            }

            return Results.Ok(user.ToUserResponse(tokenService.GenerateJwtToken(user)));
        }

    }
}