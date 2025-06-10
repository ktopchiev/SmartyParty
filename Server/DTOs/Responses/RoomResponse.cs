using Server.Models;

namespace Server.DTOs
{
    public class RoomResponse
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Creator { get; set; }
        public required string Topic { get; set; }
        public string? Status { get; set; }
        public required string NumberOfQuestions { get; set; }
        public string? Difficulty { get; set; }
        public List<PlayerDto> Players { get; set; } = new List<PlayerDto>();
        public List<MessageResponse> Messages { get; set; } = new List<MessageResponse>();
        public List<QuestionResponse> Questions { get; set; } = new List<QuestionResponse>();
    }

    public static class RoomResponseExtensions
    {
        public static RoomResponse ToRoomResponse(this Room room)
        {
            return new RoomResponse
            {
                Id = room.Id.ToString(),
                Name = room.Name,
                Creator = room.Players.FirstOrDefault()?.Username ?? string.Empty,
                Topic = room.Topic,
                Status = "Open", // Assuming the status is always "Active" for now
                NumberOfQuestions = room.Number,
                Difficulty = room.Difficulty,
                Players = room.Players.Select(p => p.ToPlayerDto()).ToList(),
                Messages = room.Messages.Select(m => m.ToMessageResponse()).ToList(),
                Questions = room.Questions.Select(q => q.ToQuestionResponse()).ToList()
            };
        }
    }
}