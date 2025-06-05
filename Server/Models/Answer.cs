using Server.DTOs;

namespace Server.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public string From { get; set; }
        public string RoomId { get; set; }
        public string AnswerContent { get; set; }
        public string Question { get; set; }
        public bool IsCorrect { get; set; }
    }

    public static class AnswerExtensions
    {
        public static AnswerDto ToAnswerDto(this Answer answer)
        {
            return new AnswerDto
            {
                Id = answer.Id,
                From = answer.From,
                RoomId = answer.RoomId,
                AnswerContent = answer.AnswerContent,
                Question = answer.Question,
                IsCorrect = answer.IsCorrect
            };
        }
    }
}