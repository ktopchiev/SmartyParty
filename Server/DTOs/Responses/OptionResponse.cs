using Server.Models;

namespace Server.DTOs.Responses
{
    public class OptionResponse
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }

    public static class OptionResponseExtensions
    {
        public static OptionResponse ToOptionResponse(this Option option)
        {
            return new OptionResponse
            {
                Id = option.Id,
                Content = option.Content,
                IsCorrect = option.IsCorrect
            };
        }
    }
}