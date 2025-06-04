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

        public Room AddRoom(string roomName, string topic, string playerName, string language, string connectionId)
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

        public void RemoveRoom(string roomName)
        {
            var room = _Rooms.FirstOrDefault(r => r.Name == roomName);
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

        public List<Player> GetPlayersInRoom(string roomName)
        {
            var room = _Rooms.FirstOrDefault(r => r.Name == roomName);
            return room?.Players ?? new List<Player>();
        }

        public void AddPlayerToRoom(string roomId, string playerUserName, string connectionId)
        {
            var player = new Player
            {
                Username = playerUserName,
                ConnectionId = connectionId
            };

            _Players.Add(player);
            var existingRoom = _Rooms.FirstOrDefault(r => r.Id.ToString() == roomId);

            if (existingRoom != null)
            {
                existingRoom.Players.Add(player);
            }
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
                    if (room.Players.Count == 0) ClearRoom(room.Name);
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