using Server.DTOs;

namespace Server.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string QuestionContent { get; set; } = string.Empty;
        public Answer CorrectAnswer { get; set; } = new();
        public List<Answer> IncorrectAnswers { get; set; } = new();
    }

    public static class QuestionExtensions
    {
        public static QuestionDto ToQuestionDto(this Question question)
        {
            return new QuestionDto
            {
                Id = question.Id,
                QuestionContent = question.QuestionContent,
                CorrectAnswer = question.CorrectAnswer.ToAnswerDto(),
                IncorrectAnswers = question.IncorrectAnswers.Select(i => i.ToAnswerDto()).ToList()
            };
        }
    }
}