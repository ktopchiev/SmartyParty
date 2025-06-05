using Newtonsoft.Json.Linq;

namespace Server.DTOs
{
    public class QuestionDto
    {
        public int Id { get; set; }
        public string QuestionContent { get; set; } = string.Empty;
        public AnswerDto CorrectAnswer { get; set; }
        public List<AnswerDto> IncorrectAnswers { get; set; } = new List<AnswerDto>();
    }

    public static class QuestionDtoExtensions
    {
        public static QuestionDto ToQuestionDto(this JObject json)
        {
            return new QuestionDto
            {
                Id = (int)json["id"],
                QuestionContent = json["question"]?.ToString(),
                CorrectAnswer = json["correctAnswer"].ToObject<AnswerDto>(),
                IncorrectAnswers = json["incorrectAnswers"]?.ToObject<List<AnswerDto>>() ?? new List<AnswerDto>()
            };
        }
    }
}