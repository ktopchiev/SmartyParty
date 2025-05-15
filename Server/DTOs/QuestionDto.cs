using Newtonsoft.Json.Linq;

namespace Server.DTOs
{
    public class QuestionDto
    {
        public string Question { get; set; }
        public string CorrectAnswer { get; set; }
        public List<string> IncorrectAnswers { get; set; } = new List<string>();
    }

    public static class QuestionDtoExtensions
    {
        public static QuestionDto FromJson(this JObject json)
        {
            return new QuestionDto
            {
                Question = json["question"]?.ToString(),
                CorrectAnswer = json["correctAnswer"]?.ToString(),
                IncorrectAnswers = json["incorrectAnswers"]?.ToObject<List<string>>() ?? new List<string>()
            };
        }
    }
}