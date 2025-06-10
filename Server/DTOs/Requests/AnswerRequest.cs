using Server.Models;

namespace Server.DTOs.Requests
{
    public class AnswerRequest
    {
        public int Id { get; set; }
        public required string RoomId { get; set; }
        public required string From { get; set; }
        public required Option Option { get; set; }

    }
}