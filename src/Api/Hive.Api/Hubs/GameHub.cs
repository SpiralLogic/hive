using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SignalR;

namespace Hive.Hubs
{
    public class GameHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            Context.GetHttpContext().GetRouteData().Values.TryGetValue("id", out var gameId);
            if (gameId is string groupName)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Context.GetHttpContext().GetRouteData().Values.TryGetValue("id", out var gameId);
            if (gameId is string groupName)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            }
        }
    }
}
