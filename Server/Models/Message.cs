using Server.DTOs;

namespace Server.Models
{
    public class Message
    {
        public Guid Id { get; set; }
        public required string RoomId { get; set; }
        public required string From { get; set; }
        public required string Content { get; set; }
    }

    public static class MessageExtensions
    {
        public static MessageResponse ToMessageResponse(this Message message)
        {
            return new MessageResponse
            {
                Id = message.Id,
                RoomId = message.RoomId,
                From = message.From,
                Content = message.Content
            };
        }
    }
}