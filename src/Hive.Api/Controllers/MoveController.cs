using System;
using System.Linq;
using System.Threading.Tasks;
using Hive.Api.DTOs;
using Hive.Api.Hubs;
using Hive.Api.Services;
using Hive.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Move = Hive.Api.DTOs.Move;

namespace Hive.Api.Controllers;

[ApiController]
public class MoveController : ControllerBase
{
    private readonly IGameSessionStore _gameSessionStore;
    private readonly IGameLockProvider _gameLockProvider;
    private readonly IHubContext<GameHub> _hubContext;

    public MoveController(IHubContext<GameHub> hubContext, IGameSessionStore gameSessionStore, IGameLockProvider gameLockProvider)
    {
        _hubContext = hubContext;
        _gameSessionStore = gameSessionStore;
        _gameLockProvider = gameLockProvider;
    }

    [HttpPost]
    [Route("/api/move/{id}")]
    [Produces("application/json")]
    [ProducesErrorResponseType(typeof(BadRequestResult))]
    public async ValueTask<IActionResult> Post(string id, [FromBody] Move move)
    {
        if (string.IsNullOrEmpty(id))
            return ValidationProblem(detail: "Game id is required.");

        var lockForGame = _gameLockProvider.GetGameLock(id);
        await lockForGame.WaitAsync().ConfigureAwait(false);
        try
        {
            var gameState = await _gameSessionStore.GetGame(id).ConfigureAwait(false);
            if (gameState == null) return NotFound();
            var versionConflict = TryGetVersionConflict(gameState.Version);
            if (versionConflict != null) return versionConflict;

            var (_, _, players, cells, history) = gameState;
            var game = new Domain.Hive(players.ToList(), cells.ToHashSet(), history);
            var (tileId, coords) = move;
            var tile = players.SelectMany(p => p.Tiles).Concat(cells.SelectMany(c => c.Tiles)).FirstOrDefault(t => t.Id == tileId);
            if (tile == null) return Problem(statusCode: 403, detail: "Tile not found for this game.");

            var gameStatus = game.Move(new(tile, coords));
            if (gameStatus == GameStatus.MoveInvalid)
                return ValidationProblem(detail: "Invalid move.");

            var newGameState = new GameState(id, gameStatus, game.Players, game.Cells, game.History)
            {
                Version = gameState.Version + 1
            };
            await _gameSessionStore.SetGame(id, newGameState).ConfigureAwait(false);
            await _hubContext.Clients.Group(id).SendAsync("ReceiveGameState", newGameState).ConfigureAwait(false);

            return AcceptedAtRoute("GameEndpointApi", new { Id = id }, newGameState);
        }
        finally
        {
            lockForGame.Release();
        }
    }

    [HttpPost]
    [Route("/api/ai-move/{id}")]
    [Produces("application/json")]
    [ProducesErrorResponseType(typeof(BadRequestResult))]
    public async ValueTask<IActionResult> AiMove(string id)
    {
        if (string.IsNullOrEmpty(id))
            return ValidationProblem(detail: "Game id is required.");

        var lockForGame = _gameLockProvider.GetGameLock(id);
        await lockForGame.WaitAsync().ConfigureAwait(false);
        try
        {
            var gameState = await _gameSessionStore.GetGame(id).ConfigureAwait(false);
            if (gameState == null) return NotFound();
            var versionConflict = TryGetVersionConflict(gameState.Version);
            if (versionConflict != null) return versionConflict;

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

            var newGameState = new GameState(id, status, game.Players, game.Cells, game.History)
            {
                Version = gameState.Version + 1
            };
            await _gameSessionStore.SetGame(id, newGameState).ConfigureAwait(false);
            await _hubContext.Clients.Group(id).SendAsync("ReceiveGameState", newGameState).ConfigureAwait(false);

            return AcceptedAtRoute("GameEndpointApi", new { Id = id }, newGameState);
        }
        finally
        {
            lockForGame.Release();
        }
    }

    private Task BroadCast(string id, string type, Tile tile)
    {
        return _hubContext.Clients.Group(id).SendAsync("OpponentSelection", type, tile);
    }

    private ConflictObjectResult? TryGetVersionConflict(int currentVersion)
    {
        if (!Request.Headers.TryGetValue("If-Match-Version", out var headerValue))
            return null;
        if (!int.TryParse(headerValue.ToString(), out var expectedVersion))
            return Conflict(new ProblemDetails { Detail = "If-Match-Version must be an integer." });
        if (expectedVersion != currentVersion)
            return Conflict(new ProblemDetails { Detail = $"Version mismatch. Expected {expectedVersion} but was {currentVersion}." });
        return null;
    }
}