namespace Server.Models
{
    public class Room
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Name { get; set; }
        public required string Topic { get; set; }
        public required string Language { get; set; }
        public List<Player> Players { get; set; } = new List<Player>();
        public List<Message> Messages { get; set; } = new List<Message>();
        public List<Question> Questions { get; set; } = new List<Question>();

    }
}