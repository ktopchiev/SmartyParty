namespace Server.DTOs
{
    /// <summary>
    /// Data Transfer Object for an answer.
    /// This class is used to transfer answer data between the client and server.
    /// </summary>
    public class AnswerDto
    {
        public int Id { get; set; }
        public required string RoomId { get; set; }
        public required string From { get; set; }
        public required string Question { get; set; }
        public required string AnswerContent { get; set; }
        public bool IsCorrect { get; set; }

    }
}