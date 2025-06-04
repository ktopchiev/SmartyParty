using Server.Models;

namespace Server.DTOs
{
    public class RoomResponse
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Creator { get; set; }
        public string Topic { get; set; }
        public string Status { get; set; }
        public List<string> Players { get; set; } = new List<string>();
        public List<MessageResponse> Messages { get; set; } = new List<MessageResponse>();
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
                Players = room.Players.Select(p => p.Username).ToList(),
                Messages = room.Messages.Select(m => m.ToMessageResponse()).ToList()
            };
        }
    }
}