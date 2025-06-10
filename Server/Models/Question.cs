using Server.DTOs;
using Server.DTOs.Responses;

namespace Server.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string QuestionContent { get; set; } = string.Empty;
        public List<Option> Options { get; set; } = new();
    }

    public static class QuestionResponseExtensions
    {
        public static QuestionResponse ToQuestionResponse(this Question question)
        {
            return new QuestionResponse
            {
                Id = question.Id,
                QuestionContent = question.QuestionContent,
                Options = question.Options.Select(io => io.ToOptionResponse()).ToList()
            };
        }
    }
}