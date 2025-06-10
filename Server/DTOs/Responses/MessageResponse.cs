namespace Server.DTOs
{
    public class MessageResponse
    {
        public Guid Id { get; set; }
        public required string RoomId { get; set; }
        public required string From { get; set; }
        public required string Content { get; set; }
    }
}