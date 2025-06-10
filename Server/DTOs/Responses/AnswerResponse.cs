using Server.DTOs.Requests;

namespace Server.DTOs.Responses
{
    public class AnswerResponse
    {
        public int Id { get; set; }
        public required string From { get; set; }
        public required OptionResponse Option { get; set; }
    }

    public static class AnswerResponseExtensions
    {
        public static AnswerResponse ToAnswerResponse(this AnswerRequest answerRequest)
        {
            return new AnswerResponse
            {
                Id = answerRequest.Id,
                From = answerRequest.From,
                Option = answerRequest.Option.ToOptionResponse()
            };
        }
    }
}