using Microsoft.AspNetCore.SignalR;

namespace Server.Hubs
{
    public class GameHub : Hub
    {
        public async Task NewMessage(long username, string message) =>
            await Clients.All.SendAsync("messageReceived", username, message);
    }
}