namespace Server.DTOs
{
    public class RoomRequest
    {
        public required string Username { get; set; }
        public required string RoomName { get; set; }
        public required string Topic { get; set; }
        public string? Language { get; set; }
        public string? Number { get; set; }
        public string? Difficulty { get; set; }

    }
}