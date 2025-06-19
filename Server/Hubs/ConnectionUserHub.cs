using Microsoft.AspNetCore.SignalR;
using Server.DTOs;
using Server.DTOs.Requests;
using Server.DTOs.Responses;
using Server.Models;
using Server.Services;

public class ConnectionUserHub : Hub
{
    private readonly UserConnectionService _userConnectionService;
    private readonly AIQuestionService _aiQuestionService;

    public ConnectionUserHub(UserConnectionService userConnectionService, AIQuestionService aIQuestionService)
    {
        _userConnectionService = userConnectionService;
        _aiQuestionService = aIQuestionService;
    }

    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "SmartyPartyHub");
        await Clients.Caller.SendAsync("UserConnected");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "SmartyPartyHub");
        await Clients.Caller.SendAsync("UserDisconnected", Context.ConnectionId);
    }

    public async Task SendAnswer(AnswerRequest answer)
    {
        if (string.IsNullOrWhiteSpace(answer.From) || string.IsNullOrWhiteSpace(answer.RoomId) || answer.Option == null)
        {
            throw new HubException("Invalid answer");
        }

        if (answer.Option.IsCorrect)
            _userConnectionService.UpdatePlayerInRoom(answer.RoomId, answer.From, -1, 10);

        await Clients.OthersInGroup(answer.RoomId).SendAsync("ReceiveAnswer", answer.ToAnswerResponse());
    }

    public async Task SendMessage(MessageRequest messageRequest)
    {
        if (string.IsNullOrWhiteSpace(messageRequest.RoomId) || string.IsNullOrWhiteSpace(messageRequest.From) || string.IsNullOrWhiteSpace(messageRequest.Content))
        {
            throw new HubException("Invalid message");
        }

        var message = _userConnectionService.AddMessage(messageRequest.ToMessage());
        await Clients.Group(messageRequest.RoomId).SendAsync("ReceiveMessage", message.ToMessageResponse());
    }

    public async Task SendGameStatus(GameStatusRequest gameStatusRequest)
    {
        if (string.IsNullOrWhiteSpace(gameStatusRequest.RoomId) || string.IsNullOrWhiteSpace(gameStatusRequest.Status))
        {
            throw new HubException("Invalid status");
        }

        if (_userConnectionService.GetRoomById(gameStatusRequest.RoomId) == null)
        {
            throw new HubException("Room not found");
        }

        await Clients.Group(gameStatusRequest.RoomId).SendAsync("ReceiveGameStatus", gameStatusRequest.Status);
    }

    public async Task UpdatePlayer(string roomId, PlayerDto player)
    {
        if (string.IsNullOrEmpty(player.Username))
        {
            throw new HubException("Invalid player username");
        }

        _userConnectionService.UpdatePlayerInRoom(roomId, player.Username, player.CurrentQuestionIndex, player.Points);
        await Clients.Group(roomId).SendAsync("PlayerUpdated", player);
    }

    public async Task CreateRoom(RoomRequest roomRequest)
    {
        var player = roomRequest.Username;
        var roomName = roomRequest.RoomName;
        var topic = roomRequest.Topic;
        var language = roomRequest.Language;
        var number = roomRequest.Number;
        var difficulty = roomRequest.Difficulty;

        if (string.IsNullOrWhiteSpace(player) || string.IsNullOrWhiteSpace(roomName) || string.IsNullOrWhiteSpace(topic))
        {
            throw new HubException("Invalid room details");
        }

        _userConnectionService.AddPlayer(player, Context.ConnectionId);

        var newRoom = _userConnectionService.AddRoom(roomName, topic, player, language, number, difficulty, Context.ConnectionId);

        if (newRoom == null)
        {
            throw new HubException("Failed to create room");
        }

        var questions = await _aiQuestionService.GenerateQuestionsAsync(topic, number, difficulty, language);

        if (questions == null)
        {
            throw new HubException("Failed to generate questions");
        }

        newRoom.Questions = questions;
        newRoom.Number = questions.Count().ToString();

        var roomId = newRoom.Id.ToString();

        if (string.IsNullOrWhiteSpace(roomId))
        {
            throw new HubException("Invalid room ID");
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        await Clients.Caller.SendAsync("RoomCreated", newRoom.ToRoomResponse());
        await Clients.Others.SendAsync("ReceiveRoom", newRoom.ToRoomResponse());
    }

    public async Task JoinRoom(string roomId, string username)
    {
        if (string.IsNullOrWhiteSpace(roomId) || string.IsNullOrWhiteSpace(username))
        {
            throw new HubException("Invalid room ID or username");
        }

        if (_userConnectionService.GetRoomById(roomId) == null)
        {
            throw new HubException("Room does not exist");
        }

        var player = _userConnectionService.GetPlayerByUsername(username);

        if (player == null)
        {
            var newPlayer = _userConnectionService.AddPlayer(username, Context.ConnectionId);
            await Clients.Group(roomId).SendAsync("PlayerJoined", newPlayer.ToPlayerDto());
            _userConnectionService.AddPlayerToRoom(roomId, username, Context.ConnectionId);
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
    }


    public async Task LeaveRoom(string roomId, string playerName)
    {
        if (string.IsNullOrWhiteSpace(roomId))
        {
            throw new HubException("Invalid room ID");
        }

        var player = _userConnectionService.GetPlayerInRoomByUsername(roomId, playerName);
        if (player == null)
        {
            throw new HubException("Player doesn't exist in this room");
        }

        _userConnectionService.RemovePlayerFromRoom(roomId, playerName);

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
        await Clients.Group(roomId).SendAsync("PlayerLeft", playerName);
    }

    public async Task GetRooms()
    {
        var rooms = _userConnectionService.GetRooms();
        if (rooms != null)
        {
            var roomListResponse = rooms.Select(r => r.ToRoomResponse()).ToList();
            await Clients.All.SendAsync("ReceiveRoomList", roomListResponse);
        }
    }

    public async Task GetRoom(string roomId, string playerUserName)
    {
        if (string.IsNullOrWhiteSpace(roomId))
        {
            throw new HubException("Invalid room ID");
        }

        var room = _userConnectionService.GetRoomById(roomId);
        if (room == null)
        {
            await Clients.Caller.SendAsync("HandleError", $"Room with id - {roomId}, does not exist.");
            throw new HubException("Room not found");
        }

        var player = _userConnectionService.GetPlayerByUsername(playerUserName);
        if (player != null && _userConnectionService.GetPlayerInRoomByUsername(roomId, player.Username) == null)
        {
            await Clients.Caller.SendAsync("AccessDenied", "You are not part of this room.");
            return;
        }

        await Clients.Caller.SendAsync("ReceiveRoom", room.ToRoomResponse());
    }

    public async Task RemoveRoom(string roomId)
    {
        if (string.IsNullOrWhiteSpace(roomId))
        {
            throw new HubException("Invalid room ID");
        }

        _userConnectionService.RemoveRoom(roomId);

        await Clients.All.SendAsync("RemoveRoom", roomId);
    }

}