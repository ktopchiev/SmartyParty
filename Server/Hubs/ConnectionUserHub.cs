using Microsoft.AspNetCore.SignalR;
using Server.DTOs;
using Server.Services;

public class ConnectionUserHub : Hub
{
    private readonly UserConnectionService _userConnectionService;

    public ConnectionUserHub(UserConnectionService userConnectionService)
    {
        _userConnectionService = userConnectionService;
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
        if (string.IsNullOrWhiteSpace(answer.From) || string.IsNullOrWhiteSpace(answer.To) || string.IsNullOrWhiteSpace(answer.Question) || string.IsNullOrWhiteSpace(answer.Answer))
        {
            throw new HubException("Invalid answer");
        }

        await Clients.Group(answer.RoomId).SendAsync("ReceiveAnswer", Context.ConnectionId, answer);
    }

    public async Task CreateRoom(PlayerDto player, RoomRequest room)
    {
        if (string.IsNullOrWhiteSpace(room.Name) || string.IsNullOrWhiteSpace(room.Topic))
        {
            throw new HubException("Invalid room details");
        }

        if (string.IsNullOrWhiteSpace(player.Username))
        {
            throw new HubException("Invalid username");
        }

        var newRoom = _userConnectionService.AddRoom(room.Name, room.Topic, player.Username, Context.ConnectionId);

        if (newRoom == null)
        {
            throw new HubException("Failed to create room");
        }

        var roomId = newRoom.Id.ToString();

        if (string.IsNullOrWhiteSpace(roomId))
        {
            throw new HubException("Invalid room ID");
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        await Clients.Caller.SendAsync("RoomCreated", newRoom.ToRoomResponse());
    }

    public async Task JoinRoom(string roomId, PlayerDto player)
    {
        if (string.IsNullOrWhiteSpace(roomId) || string.IsNullOrWhiteSpace(player.Username))
        {
            throw new HubException("Invalid room ID or username");
        }

        _userConnectionService.AddPlayerToRoom(roomId, player.Username, Context.ConnectionId);

        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        await Clients.Group(roomId).SendAsync("PlayerJoined", player);
    }

    public async Task LeaveRoom(string roomId)
    {
        if (string.IsNullOrWhiteSpace(roomId))
        {
            throw new HubException("Invalid room ID");
        }

        _userConnectionService.RemovePlayerFromRoom(roomId, Context.ConnectionId);

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
        await Clients.Group(roomId).SendAsync("PlayerLeft", Context.ConnectionId);
    }

    public async Task GetPlayersInRoom(string roomId)
    {
        if (string.IsNullOrWhiteSpace(roomId))
        {
            throw new HubException("Invalid room ID");
        }

        var players = _userConnectionService.GetPlayersInRoom(roomId);
        await Clients.Caller.SendAsync("ReceivePlayersInRoom", players);
    }

    public async Task GetRooms()
    {
        var rooms = _userConnectionService.GetRooms();
        var roomResponses = rooms.Select(r => r.ToRoomResponse()).ToList();
        await Clients.Caller.SendAsync("ReceiveRooms", roomResponses);
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