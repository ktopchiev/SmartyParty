using Server.DTOs;

namespace Server.Controllers
{
    public static class QuestionEndpoints
    {
        public static void MapQuestionEndpoints(this IEndpointRouteBuilder routes)
        {
            routes.MapGet("/api/questions", GetQuestions)
                .WithName(nameof(GetQuestions))
                .Produces<List<QuestionDto>>(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status404NotFound);
        }

        public static async Task<IResult> GetQuestions(string topic, AIQuestionService ai)
        {
            if (string.IsNullOrWhiteSpace(topic))
            {
                return Results.BadRequest(new { message = "Topic is required" });
            }

            var questionsJson = await ai.GenerateQuestionsAsync(topic);
            if (questionsJson == null)
            {
                return Results.NotFound(new { message = "No questions found" });
            }

            var questions = new List<QuestionDto>();
            foreach (var questionJson in questionsJson)
            {
                var question = questionJson.FromJson();
                if (string.IsNullOrWhiteSpace(question.Question) || string.IsNullOrWhiteSpace(question.CorrectAnswer))
                {
                    continue;
                }
                if (question != null)
                {
                    questions.Add(question);
                }
            }
            if (questions == null || !questions.Any())
            {
                return Results.NotFound(new { message = "No questions found" });
            }

            return Results.Ok(questions);
        }
    }
}