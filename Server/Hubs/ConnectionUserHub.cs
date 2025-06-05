using Microsoft.AspNetCore.SignalR;
using Server.DTOs;
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

    public async Task SendAnswer(AnswerDto answer)
    {
        if (string.IsNullOrWhiteSpace(answer.From) || string.IsNullOrWhiteSpace(answer.Question) || string.IsNullOrWhiteSpace(answer.AnswerContent))
        {
            throw new HubException("Invalid answer");
        }

        if (answer.IsCorrect)
            _userConnectionService.AddPointsToPlayer(answer.From);

        await Clients.Group(answer.RoomId).SendAsync("ReceiveAnswer", Context.ConnectionId, answer);
    }

    public async Task SendMessage(MessageRequest messageRequest)
    {
        if (string.IsNullOrWhiteSpace(messageRequest.RoomId) || string.IsNullOrWhiteSpace(messageRequest.From) || string.IsNullOrWhiteSpace(messageRequest.Content))
        {
            throw new HubException("Invalid message");
        }

        var message = _userConnectionService.AddMessage(messageRequest.ToMessage());
        await Clients.Group(messageRequest.RoomId).SendAsync("ReceiveMessage", message);
    }

    public async Task CreateRoom(string username, string roomName, string topic, string language)
    {
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(roomName) || string.IsNullOrWhiteSpace(topic))
        {
            throw new HubException("Invalid room details");
        }

        _userConnectionService.AddPlayer(username, Context.ConnectionId);

        var newRoom = _userConnectionService.AddRoom(roomName, topic, username, language, Context.ConnectionId);

        if (newRoom == null)
        {
            throw new HubException("Failed to create room");
        }

        var questions = await _aiQuestionService.GenerateQuestionsAsync(topic, language);

        if (questions == null)
        {
            throw new HubException("Failed to generate questions");
        }
        
        newRoom.Questions = questions;

        var roomId = newRoom.Id.ToString();

        if (string.IsNullOrWhiteSpace(roomId))
        {
            throw new HubException("Invalid room ID");
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        await Clients.Caller.SendAsync("RoomCreated", newRoom.ToRoomResponse());
    }

    public async Task JoinRoom(string roomId, string username)
    {
        if (string.IsNullOrWhiteSpace(roomId) || string.IsNullOrWhiteSpace(username))
        {
            throw new HubException("Invalid room ID or username");
        }

        _userConnectionService.AddPlayerToRoom(roomId, username, Context.ConnectionId);

        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        await Clients.Group(roomId).SendAsync("PlayerJoined", username);
    }


    public async Task LeaveRoom(string roomId, string playerName)
    {
        if (string.IsNullOrWhiteSpace(roomId))
        {
            throw new HubException("Invalid room ID");
        }

        _userConnectionService.RemovePlayerFromRoom(roomId, playerName);

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
        await Clients.Group(roomId).SendAsync("PlayerLeft", playerName);
    }

    public async Task GetRooms()
    {
        var rooms = _userConnectionService.GetRooms();
        var roomListResponse = rooms.Select(r => r.ToRoomResponse()).ToList();
        await Clients.All.SendAsync("ReceiveRoomList", roomListResponse);
    }

    public async Task GetRoomById(string roomId)
    {
        if (string.IsNullOrWhiteSpace(roomId))
        {
            throw new HubException("Invalid room ID");
        }

        var room = _userConnectionService.GetRoomById(roomId);
        if (room == null)
        {
            throw new HubException("Room not found");
        }

        await Clients.Caller.SendAsync("ReceiveRoom", room.ToRoomResponse());
    }

}