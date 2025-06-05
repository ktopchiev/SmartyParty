using Server.Models;

namespace Server.DTOs
{
    public class MessageRequest
    {
        public required string RoomId { get; set; }
        public required string From { get; set; }
        public required string Content { get; set; }
    }

    public static class MessageDtoExtensions
    {
        public static Message ToMessage(this MessageRequest messageDto)
        {
            return new Message
            {
                Id = Guid.NewGuid(),
                RoomId = messageDto.RoomId,
                From = messageDto.From,
                Content = messageDto.Content
            };
        }
    }
}