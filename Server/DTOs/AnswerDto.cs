namespace Server.DTOs
{
    public class AnswerDto
    {
        public required string RoomId { get; set; }
        public required string From { get; set; }
        public required string To { get; set; }
        public required string Question { get; set; }
        public required string Answer { get; set; }
    }
}