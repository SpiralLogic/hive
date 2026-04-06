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
public class MoveController(IHubContext<GameHub> hubContext, IGameSessionStore gameSessionStore, IGameLockProvider gameLockProvider)
    : ControllerBase
{
    [HttpPost]
    [Route("/api/move/{id}")]
    [Produces("application/json")]
    [ProducesErrorResponseType(typeof(BadRequestResult))]
    public async ValueTask<IActionResult> Post(string id, [FromBody] Move move)
    {
        return await WithGameLock(id, gameState =>
        {
            var (_, _, players, cells, history) = gameState;
            var game = new Domain.Hive(players.ToList(), cells.ToHashSet(), history);
            var (tileId, coords) = move;
            var tile = players.SelectMany(p => p.Tiles).Concat(cells.SelectMany(c => c.Tiles)).FirstOrDefault(t => t.Id == tileId);
            if (tile == null) return new ValueTask<(IActionResult?, GameState?)>((Problem(statusCode: 403, detail: "Tile not found for this game."), null));

            var gameStatus = game.Move(new(tile, coords));
            if (gameStatus == GameStatus.MoveInvalid)
                return new ValueTask<(IActionResult?, GameState?)>((ValidationProblem(detail: "Invalid move."), null));

            var newGameState = new GameState(id, gameStatus, game.Players, game.Cells, game.History) { Version = gameState.Version + 1 };
            return new ValueTask<(IActionResult?, GameState?)>((null, newGameState));
        }).ConfigureAwait(false);
    }

    [HttpPost]
    [Route("/api/ai-move/{id}")]
    [Produces("application/json")]
    [ProducesErrorResponseType(typeof(BadRequestResult))]
    public async ValueTask<IActionResult> AiMove(string id)
    {
        return await WithGameLock(id, async gameState =>
        {
            if (IsTerminalStatus(gameState.GameStatus))
                return (Conflict(gameState), null);

            var (_, _, players, cells, history) = gameState;
            var game = new Domain.Hive(players.ToList(), cells.ToHashSet(), history);
            var status = await game.AiMove(async (type, tile) => await BroadCast(id, type, tile).ConfigureAwait(false)).ConfigureAwait(false);

            var newGameState = new GameState(id, status, game.Players, game.Cells, game.History) { Version = gameState.Version + 1 };
            return (null, (GameState?)newGameState);
        }).ConfigureAwait(false);
    }

    private async ValueTask<IActionResult> WithGameLock(string id, Func<GameState, ValueTask<(IActionResult?, GameState?)>> action)
    {
        if (string.IsNullOrEmpty(id))
            return ValidationProblem(detail: "Game id is required.");

        var lockForGame = gameLockProvider.GetGameLock(id);
        await lockForGame.WaitAsync().ConfigureAwait(false);
        GameState? newGameState = null;
        try
        {
            var gameState = await gameSessionStore.GetGame(id).ConfigureAwait(false);
            if (gameState == null) return NotFound();
            var versionConflict = TryGetVersionConflict(gameState.Version);
            if (versionConflict != null) return versionConflict;

            var (errorResult, resultState) = await action(gameState).ConfigureAwait(false);
            if (errorResult != null) return errorResult;

            newGameState = resultState!;
            await gameSessionStore.SetGame(id, newGameState).ConfigureAwait(false);
            await hubContext.Clients.Group(id).SendAsync("ReceiveGameState", newGameState).ConfigureAwait(false);
            return AcceptedAtRoute("GameEndpointApi", new { Id = id }, newGameState);
        }
        finally
        {
            lockForGame.Release();
            if (newGameState != null && IsTerminalStatus(newGameState.GameStatus))
                gameLockProvider.TryRemoveGameLock(id);
        }
    }

    private Task BroadCast(string id, string type, Tile tile)
    {
        return hubContext.Clients.Group(id).SendAsync("OpponentSelection", type, tile);
    }

    private static bool IsTerminalStatus(GameStatus status) => status is
        GameStatus.GameOver or GameStatus.AiWin or GameStatus.Player0Win or GameStatus.Player1Win or GameStatus.Draw;

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
