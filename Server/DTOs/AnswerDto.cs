namespace Server.DTOs
{
    /// <summary>
    /// Data Transfer Object for an answer in the Smarty Party game.
    /// This class is used to transfer answer data between the client and server.
    /// </summary>
    public class AnswerDto
    {
        public required string RoomId { get; set; }
        public required string From { get; set; }
        public required string To { get; set; }
        public required string Question { get; set; }
        public required string Answer { get; set; }
    }
}