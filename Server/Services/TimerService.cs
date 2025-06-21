using Microsoft.AspNetCore.SignalR;

namespace Server.Services
{
    public class TimerService
    {

        private readonly IHubContext<SmartyPartyHub> _hubContext;
        private readonly Dictionary<string, Timer> _roomTimers = new();

        public TimerService(IHubContext<SmartyPartyHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public void StartTimer(string roomId, int durationInSeconds)
        {
            if (_roomTimers.ContainsKey(roomId))
            {
                _roomTimers[roomId]?.Dispose();
                _roomTimers.Remove(roomId);
            }

            int remaining = durationInSeconds;

            Timer timer = new Timer(async _ =>
            {
                if (remaining <= 0)
                {
                    await _hubContext.Clients.Group(roomId).SendAsync("TimerEnded");
                    _roomTimers[roomId]?.Dispose();
                    _roomTimers.Remove(roomId);
                }
                else
                {
                    await _hubContext.Clients.Group(roomId).SendAsync("UpdateTimer", remaining);
                    remaining--;
                }
            }, null, 0, 1000);

            _roomTimers[roomId] = timer;
        }
    }
}