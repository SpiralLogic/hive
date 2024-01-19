using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Hive.Api.DTOs;
using Hive.Api.Hubs;
using Hive.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Move = Hive.Api.DTOs.Move;

namespace Hive.Api.Controllers;

[ApiController]
public class MoveController : ControllerBase
{
    private readonly IDistributedCache _distributedCache;
    private readonly IHubContext<GameHub> _hubContext;
    private readonly JsonSerializerOptions _jsonSerializerOptions;

    public MoveController(IHubContext<GameHub> hubContext, IOptions<JsonOptions> jsonOptions, IDistributedCache distributedCache)
    {
        ArgumentNullException.ThrowIfNull(jsonOptions);
        _hubContext = hubContext;
        _distributedCache = distributedCache;
        _jsonSerializerOptions = jsonOptions.Value.JsonSerializerOptions;
    }

    [HttpPost]
    [Route("/api/move/{id}")]
    [Produces("application/json")]
    [ProducesErrorResponseType(typeof(BadRequestResult))]
    public async ValueTask<IActionResult> Post(string id, [FromBody] Move move)
    {
        if (string.IsNullOrEmpty(id)) return BadRequest();

        var gameSession = await _distributedCache.GetStringAsync(id).ConfigureAwait(false);
        if (string.IsNullOrEmpty(gameSession)) return NotFound();

        var (_, _, players, cells, history) = JsonSerializer.Deserialize<GameState>(gameSession, _jsonSerializerOptions)!;

        var game = new Domain.Hive(players.ToList(), cells.ToHashSet(), history);
        var (tileId, coords) = move;
        var tile = players.SelectMany(p => p.Tiles).Concat(cells.SelectMany(c => c.Tiles)).FirstOrDefault(t => t.Id == tileId);
        if (tile == null) return Forbid();

        var gameStatus = game.Move(new(tile, coords));

        if (gameStatus == GameStatus.MoveInvalid) return BadRequest("Invalid Move");

        var newGameState = new GameState(id, gameStatus, game.Players, game.Cells, game.History);
        await _hubContext.Clients.Group(id).SendAsync("ReceiveGameState", newGameState).ConfigureAwait(false);

        var json = JsonSerializer.Serialize(newGameState, _jsonSerializerOptions);
        await _distributedCache.SetStringAsync(id, json).ConfigureAwait(false);

        return AcceptedAtRoute("GameEndpointApi", new {Id=id}, newGameState);
    }

    [HttpPost]
    [Route("/api/ai-move/{id}")]
    [Produces("application/json")]
    [ProducesErrorResponseType(typeof(BadRequestResult))]
    public async ValueTask<IActionResult> AiMove(string id)
    {
        if (string.IsNullOrEmpty(id)) return BadRequest();

        var gameSessionJson = await _distributedCache.GetStringAsync(id).ConfigureAwait(false);

        if (string.IsNullOrEmpty(gameSessionJson)) return NotFound();

        var gameState = JsonSerializer.Deserialize<GameState>(gameSessionJson, _jsonSerializerOptions)!;
        var (_, gameStatus, players, cells, history) = gameState;

        if (new[]
            {
                GameStatus.GameOver,
                GameStatus.AiWin,
                GameStatus.Player0Win,
                GameStatus.Player1Win,
                GameStatus.Draw
            }.Contains(gameStatus)) return Conflict(gameState);

        var game = new Domain.Hive(players.ToList(), cells.ToHashSet(), history);

        var status = await game.AiMove(async (type, tile) => await BroadCast(id, type, tile).ConfigureAwait(false)).ConfigureAwait(false);

        var newGameState = new GameState(id, status, game.Players, game.Cells, game.History);
        await _hubContext.Clients.Group(id).SendAsync("ReceiveGameState", newGameState).ConfigureAwait(false);
        var gameJson = JsonSerializer.Serialize(newGameState, _jsonSerializerOptions);
        await _distributedCache.SetStringAsync(id, gameJson).ConfigureAwait(false);

        return AcceptedAtRoute("GameEndpointApi", new {Id=id}, newGameState);
    }

    private Task BroadCast(string id, string type, Tile tile)
    {
        return _hubContext.Clients.Group(id).SendAsync("OpponentSelection", type, tile);
    }
}