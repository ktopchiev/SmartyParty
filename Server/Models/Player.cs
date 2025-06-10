using Server.DTOs;

namespace Server.Models
{
    /// <summary>
    /// Class <c>Player</c> models a user who is joined a room.
    /// </summary>
    /// <param name="Username">string property Username</param>
    /// <param name="ConnectionId">string property ConnectionId</param>
    public class Player
    {
        /// <value>string Property <c>Username</c> </value>
        public required string Username { get; set; }
        /// <value>string Property <c>ConnectionId</c> </value>
        public required string ConnectionId { get; set; }
        public int Points { get; set; }
        public int CurrentQuestionIndex { get; set; }
    }

    public static class PlayerExtension
    {
        public static PlayerDto ToPlayerDto(this Player player)
        {
            return new PlayerDto
            {
                Username = player.Username,
                Points = player.Points,
                CurrentQuestionIndex = player.CurrentQuestionIndex,
            };
        }
    }
}