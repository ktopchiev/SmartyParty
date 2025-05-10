using Server.Models;

namespace Server.DTOs
{
    public class UserResponse
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Token { get; set; } // JWT token
    }

    public static class UserResponseExtensions
    {
        public static UserResponse ToUserResponse(this User user, string token)
        {
            return new UserResponse
            {
                Username = user.Username,
                Email = user.Email,
                Token = token
            };
        }
    }
}