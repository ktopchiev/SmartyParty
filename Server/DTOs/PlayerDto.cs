namespace Server.DTOs
{
    public class PlayerDto
    {
        public required string Username { get; set; }
        public int Points { get; set; }
        public int CurrentQuestionIndex { get; set; }
    }
}