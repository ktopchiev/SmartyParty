using Newtonsoft.Json.Linq;
using Server.DTOs.Responses;

namespace Server.DTOs
{
    public class QuestionResponse
    {
        public int Id { get; set; }
        public string QuestionContent { get; set; } = string.Empty;
        public List<OptionResponse> Options { get; set; } = new List<OptionResponse>();
    }

    public static class QuestionResponseExtensions
    {
        public static QuestionResponse FromJsonToQuestionResponse(this JObject json)
        {
            if (json != null) return null;

            return new QuestionResponse
            {
                Id = (int)json!["id"],
                QuestionContent = json["question"]?.ToString(),
                Options = json["options"]?.ToObject<List<OptionResponse>>() ?? new List<OptionResponse>()
            };
        }
    }
}