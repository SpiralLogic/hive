﻿using System;
using System.Threading.Tasks;
using Hive.Domain.Entities;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SignalR;

namespace Hive.Hubs
{
    public class GameHub : Hub
    {
        public Task SendSelection(string type, Tile tile)
        {
            var httpContext = Context.GetHttpContext();
            if (httpContext == null) return Task.CompletedTask;
            httpContext.GetRouteData().Values.TryGetValue("id", out var gameId);
            if (gameId is string groupName)
                return Clients.OthersInGroup(groupName).SendAsync("OpponentSelection", type, tile);

            return Task.CompletedTask;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            if (httpContext == null) return;
            httpContext.GetRouteData().Values.TryGetValue("id", out var gameId);
            httpContext.GetRouteData().Values.TryGetValue("playerId", out var playerId);
            if (gameId is string groupName)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                if (playerId is string player)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, $"{groupName}-{player}");
                    await Clients.Group($"{groupName}-{(player == "0" ? "1" : "0")}")
                        .SendAsync("PlayerConnection", "connect");
                }
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var httpContext = Context.GetHttpContext();
            if (httpContext == null) return;
            httpContext.GetRouteData().Values.TryGetValue("id", out var gameId);
            httpContext.GetRouteData().Values.TryGetValue("playerId", out var playerId);
            if (gameId is string groupName)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
                if (playerId is string player)
                {
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"{groupName}-{player}");
                    await Clients.Group($"{groupName}-{(player == "0" ? "1" : "0")}")
                        .SendAsync("PlayerConnection", "disconnect");
                }
            }
        }
    }
}