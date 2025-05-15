using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class AIQuestionService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _model;

    public AIQuestionService(IConfiguration config)
    {
        _apiKey = config["OpenAI:ApiKey"];
        _model = config["OpenAI:Model"] ?? "gpt-3.5-turbo";
        _httpClient = new HttpClient();
    }

    public async Task<JObject[]> GenerateQuestionsAsync(string topic)
    {
        var prompt = $$"""
        Generate 5 multiple-choice quiz questions on the topic: "{{topic}}".
        Format the response as a JSON array:
        [
          {
            "question": "...",
            "correctAnswer": "...",
            "incorrectAnswers": ["...", "...", "..."]
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

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);
        request.Content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception($"OpenAI API error: {response.StatusCode} - {error}");
        }

        var json = await response.Content.ReadAsStringAsync();
        var jsonResponse = JsonConvert.DeserializeObject<JObject>(json);

        var choices = jsonResponse["choices"];
        if (choices == null || choices.Count() == 0)
        {
            throw new Exception("No choices found in OpenAI API response.");
        }

        var firstChoice = choices[0];
        
        var message = firstChoice["message"];
        if (message == null)
        {
            throw new Exception("No message found in OpenAI API response.");
        }

        var content = message["content"];
        if (content == null)
        {
            throw new Exception("No content found in OpenAI API response.");
        }

        var jsonContent = content.ToString();
        if (string.IsNullOrWhiteSpace(jsonContent))
        {
            throw new Exception("Empty content in OpenAI API response.");
        }

        var jsonArrResult = JsonConvert.DeserializeObject<JObject[]>(jsonContent);

        return jsonArrResult;
    }
}