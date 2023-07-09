using System;
using System.Globalization;
using System.Threading.Tasks;
using Hive.Domain.Entities;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SignalR;

namespace Hive.Api.Hubs;

public class GameHub : Hub
{
    public Task SendSelection(string type, Tile tile)
    {
        var httpContext = Context.GetHttpContext();
        if (httpContext == null) return Task.CompletedTask;
        var gameId = httpContext.GetRouteValue("id");
        if (gameId is string groupName)
            return Clients.OthersInGroup(groupName).SendAsync("OpponentSelection", type, tile);

        return Task.CompletedTask;
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        if (httpContext == null) return;
        var gameId = httpContext.GetRouteValue("id");
        var playerId = httpContext.GetRouteValue("playerId");
        if (gameId is string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName).ConfigureAwait(false);
            if (playerId is string player)
            {
                var playerInt = int.Parse(player, NumberStyles.Integer, CultureInfo.InvariantCulture);
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName).ConfigureAwait(false);
                await Clients.Group(groupName).SendAsync("PlayerConnection", "connect", playerInt).ConfigureAwait(false);
            }
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var httpContext = Context.GetHttpContext();
        if (exception!=null || httpContext == null) return;
        var gameId = httpContext.GetRouteValue("id");
        var playerId = httpContext.GetRouteValue("playerId");
        if (gameId is string groupName && playerId is string player)
        {
            var playerInt = int.Parse(player, NumberStyles.Integer, CultureInfo.InvariantCulture);
            await Clients.Group(groupName).SendAsync("PlayerConnection", "disconnect", playerInt).ConfigureAwait(false);
        }
    }
}