namespace Server.Models
{
    /// <summary>
    /// Class that models an answer option of a question
    /// </summary>
    public class Option
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }

}