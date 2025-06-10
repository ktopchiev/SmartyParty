using Server.Models;

namespace Server.Services
{
    public class UserConnectionService
    {
        private static readonly List<Room> _Rooms = new();
        private static readonly List<Player> _Players = new();

        public void AddPlayer(string username, string connectionId)
        {
            var player = new Player
            {
                Username = username,
                ConnectionId = connectionId
            };
            _Players.Add(player);
        }

        public static void RemovePlayer(string connectionId)
        {
            var player = _Players.FirstOrDefault(p => p.ConnectionId == connectionId);
            if (player != null)
            {
                _Players.Remove(player);
            }
        }

        public Room AddRoom(string roomName, string topic, string playerName, string language, string number, string difficulty, string connectionId)
        {

            var existingRoom = _Rooms.FirstOrDefault(r => r.Name == roomName);
            if (existingRoom != null)
            {
                return existingRoom;
            }

            var room = new Room
            {
                Id = Guid.NewGuid(),
                Name = roomName,
                Topic = topic,
                Language = language,
                Number = number,
                Difficulty = difficulty,
                Players = new List<Player>(),
                Messages = new List<Message>()
            };

            _Rooms.Add(room);

            room.Players.Add(new Player
            {
                Username = playerName,
                ConnectionId = connectionId
            });

            return room;
        }

        public void RemoveRoom(string roomId)
        {
            var room = _Rooms.FirstOrDefault(r => r.Id.ToString() == roomId);
            if (room != null)
            {
                _Rooms.Remove(room);
            }
        }

        public List<Room> GetRooms()
        {
            return _Rooms;
        }

        public List<Player> GetPlayers()
        {
            return _Players;
        }

        public Room? GetRoomById(string roomId)
        {
            return _Rooms.FirstOrDefault(r => r.Id.ToString() == roomId);
        }

        public Player? GetPlayerByConnectionId(string connectionId)
        {
            return _Players.FirstOrDefault(p => p.ConnectionId == connectionId);
        }

        public Player? GetPlayerByUsername(string username)
        {
            return _Players.FirstOrDefault(p => p.Username == username);
        }

        public List<Player> GetPlayersInRoom(string roomId)
        {
            var room = _Rooms.FirstOrDefault(r => r.Id.ToString() == roomId);
            return room?.Players ?? new List<Player>();
        }

        public Player GetPlayerInRoom(string roomId, string player)
        {
            var room = _Rooms.FirstOrDefault(r => r.Id.ToString() == roomId);
            return room.Players.FirstOrDefault(p => p.Username == player);
        }

        public Player AddPlayerToRoom(string roomId, string playerUserName, string connectionId)
        {
            if (_Players.Any(p => p.Username == playerUserName)) return null;

            var existingRoom = _Rooms.FirstOrDefault(r => r.Id.ToString() == roomId);

            if (existingRoom == null) return null;

            var player = new Player
            {
                Username = playerUserName,
                ConnectionId = connectionId,
                Points = 0,
                CurrentQuestionIndex = 0
            };

            _Players.Add(player);

            existingRoom.Players.Add(player);

            return player;
        }

        public void UpdatePlayerInRoom(string roomId, string playerUserName, int questionIndex = -1, int points = 0)
        {
            var room = _Rooms.FirstOrDefault(r => r.Id.ToString() == roomId);

            if (room == null) return;

            var player = room.Players.FirstOrDefault(p => p.Username == playerUserName);

            if (player == null) return;

            if (questionIndex > -1) player.CurrentQuestionIndex = questionIndex;

            if (points > 0) player.Points += points;
        }

        public void RemovePlayerFromRoom(string roomId, string playerUserName)
        {
            var room = _Rooms.FirstOrDefault(r => r.Id.ToString() == roomId);

            if (room != null)
            {
                var player = room.Players.FirstOrDefault(p => p.Username == playerUserName);

                if (player != null)
                {
                    room.Players.Remove(player);
                    if (room.Players.Count == 0) _Rooms.Remove(room);
                }
            }
        }

        public Message AddMessage(Message message)
        {
            if (string.IsNullOrEmpty(message.RoomId) || string.IsNullOrEmpty(message.From) || string.IsNullOrEmpty(message.Content)) return null!;

            var room = _Rooms.FirstOrDefault(r => r.Id.ToString() == message.RoomId);

            if (room == null) return null!;

            room.Messages.Add(message);

            return message;
        }

        public void ClearAll()
        {
            _Rooms.Clear();
            _Players.Clear();
        }

        public void ClearRooms()
        {
            _Rooms.Clear();
        }

        public void ClearPlayers()
        {
            _Players.Clear();
        }

        public void ClearRoom(string roomName)
        {
            var room = _Rooms.FirstOrDefault(r => r.Name == roomName);
            if (room != null)
            {
                room.Players.Clear();
            }
        }
    }

}