using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Server.Models;

public class AIQuestionService
{
    private readonly HttpClient _httpClient;
    private readonly string? _apiKey;
    private readonly string _model;

    public AIQuestionService(IConfiguration config)
    {
        _apiKey = config["OpenAI:ApiKey"];
        _model = config["OpenAI:Model"] ?? "gpt-3.5-turbo";
        _httpClient = new HttpClient();
    }

    public async Task<List<Question>> GenerateQuestionsAsync(string topic, string number = "5", string difficulty = "normal", string language = "english")
    {
        var prompt = $$"""
        Generate {{number}} multiple-choice quiz questions on the topic: "{{topic}}".
        In {{language}} language.
        With {{difficulty}} difficulty level.
        Each object and option must have an integer id (e.g., 1, 2, 3) and a string text.
        Format the response as a JSON array:
        [
          {
            "id": "...",
            "questionContent": "...",
            "options": [{"id":"...", "content":"...", "isCorrect":"..."}, {"id":"...", "content":"...", "isCorrect":"..."}, {"id":"...", "content":"...", "isCorrect":"..."},{"id":"...", "content":"...", "isCorrect":"..."}]
          },
          ...
        ]
        """;

        var requestBody = new
        {
            model = _model,
            messages = new[]
            {
                new { role = "user", content = prompt }
            },
            temperature = 0.7
        };

        //Uncomment this to use the real AI service
        // var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
        // request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);
        // request.Content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

        // var response = await _httpClient.SendAsync(request);
        // if (!response.IsSuccessStatusCode)
        // {
        //     var error = await response.Content.ReadAsStringAsync();
        //     throw new Exception($"OpenAI API error: {response.StatusCode} - {error}");
        // }

        // var json = await response.Content.ReadAsStringAsync();
        // var jsonResponse = JsonConvert.DeserializeObject<JObject>(json);

        // var choices = jsonResponse["choices"];
        // if (choices == null || choices.Count() == 0)
        // {
        //     throw new Exception("No choices found in OpenAI API response.");
        // }

        // var firstChoice = choices[0];

        // var message = firstChoice["message"];
        // if (message == null)
        // {
        //     throw new Exception("No message found in OpenAI API response.");
        // }

        // var content = message["content"];
        // if (content == null)
        // {
        //     throw new Exception("No content found in OpenAI API response.");
        // }

        // var jsonContent = content.ToString();
        // if (string.IsNullOrWhiteSpace(jsonContent))
        // {
        //     throw new Exception("Empty content in OpenAI API response.");
        // }

        string json = @"
        [
          {
            ""id"": 1,
            ""questionContent"": ""Кой е основателят на българската държава през 681 г."",
            ""options"": [
              { ""id"": 1, ""content"": ""Аспарух"", ""isCorrect"": ""true"" },
              { ""id"": 2, ""content"": ""Крум"", ""isCorrect"": ""false"" },
              { ""id"": 3, ""content"": ""Самуил"", ""isCorrect"": ""false"" },
              { ""id"": 4, ""content"": ""Борис I"", ""isCorrect"": ""false"" }
            ]
          },
          {
            ""id"": 2,
            ""questionContent"": ""Коя година е покръстването на българите?"",
            ""options"": [
              { ""id"": 1, ""content"": ""865 г."", ""isCorrect"": ""true"" },
              { ""id"": 2, ""content"": ""681 г."", ""isCorrect"": ""false"" },
              { ""id"": 3, ""content"": ""1185 г."", ""isCorrect"": ""false"" },
              { ""id"": 4, ""content"": ""1018 г."", ""isCorrect"": ""false"" }
            ]
          }
        ]";

        var questionListResult = JsonConvert.DeserializeObject<List<Question>>(json);

        return questionListResult!;
    }
}