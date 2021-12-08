using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Hive.Domain.Entities;
using Hive.DTOs;
using Hive.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Move = Hive.DTOs.Move;

namespace Hive.Controllers
{
    [ApiController]
    public class MoveController : ControllerBase
    {
        private readonly IDistributedCache _distributedCache;
        private readonly IHubContext<GameHub> _hubContext;
        private readonly JsonSerializerOptions _jsonSerializerOptions;

        public MoveController(IHubContext<GameHub> hubContext, IOptions<JsonOptions> jsonOptions, IDistributedCache distributedCache)
        {
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

            var gameSession = await _distributedCache.GetStringAsync(id);
            if (string.IsNullOrEmpty(gameSession)) return NotFound();

            var (players, cells, _, _) = JsonSerializer.Deserialize<GameState>(gameSession, _jsonSerializerOptions)!;

            var game = new Domain.Hive(players.ToList(), cells.ToHashSet());
            var (tileId, coords) = move;
            var tile = players.SelectMany(p => p.Tiles).Concat(cells.SelectMany(c => c.Tiles)).FirstOrDefault(t => t.Id == tileId);
            if (tile == null) return Forbid();

            var gameStatus = game.Move(new Domain.Entities.Move(tile, coords));

            if (gameStatus == GameStatus.MoveInvalid) return Forbid();

            var newGameState = new GameState(game.Players, game.Cells, id, gameStatus);
            await _hubContext.Clients.Group(id).SendAsync("ReceiveGameState", newGameState);

            var json = JsonSerializer.Serialize(newGameState, _jsonSerializerOptions);
            await _distributedCache.SetStringAsync(id, json);

            return Accepted($"/game/{id}", newGameState);
        }

        [HttpPost]
        [Route("/api/ai-move/{id}/{playerId:int}")]
        [Produces("application/json")]
        [ProducesErrorResponseType(typeof(BadRequestResult))]
        public async ValueTask<IActionResult> AiMove(string id, int playerId)
        {
            if (string.IsNullOrEmpty(id)) return BadRequest();

            var gameSessionJson = await _distributedCache.GetStringAsync(id);
            var previousMovesJson = await _distributedCache.GetStringAsync(id + "-moves");
            if (string.IsNullOrEmpty(gameSessionJson)) return NotFound();
            var gameState = JsonSerializer.Deserialize<GameState>(gameSessionJson, _jsonSerializerOptions)!;
            var (players, cells, _, gameStatus) = gameState;
            if (new[] { GameStatus.GameOver, GameStatus.AiWin, GameStatus.Player0Win, GameStatus.Player1Win, GameStatus.Draw }.Contains(
                    gameStatus
                )) return Conflict(gameState);

            var previousMoves = PreventRepeatedMoves(playerId, previousMovesJson, players);

            var game = new Domain.Hive(players.ToList(), cells.ToHashSet());

            var (status, move) = await game.AiMove(async (type, tile) => await BroadCast(id, type, tile));

            await StorePreviousMoves(id, move, previousMoves);

            var newGameState = new GameState(game.Players, game.Cells, id, status);
            await _hubContext.Clients.Group(id).SendAsync("ReceiveGameState", newGameState);
            var gameJson = JsonSerializer.Serialize(newGameState, _jsonSerializerOptions);
            await _distributedCache.SetStringAsync(id, gameJson);

            return Accepted($"/game/{id}", newGameState);
        }

        private async Task StorePreviousMoves(string id, Domain.Entities.Move move, Domain.Entities.Move?[] previousMoves)
        {
            var playerId = move.Tile.PlayerId;
            previousMoves[playerId + 4] = previousMoves[playerId + 2];
            previousMoves[playerId + 2] = previousMoves[playerId];
            previousMoves[playerId] = move;
            string previousMovesJson = JsonSerializer.Serialize(previousMoves, _jsonSerializerOptions);
            await _distributedCache.SetStringAsync(id + "-moves", previousMovesJson);
        }

        private Domain.Entities.Move?[] PreventRepeatedMoves(int playerId, string previousMovesJson, IEnumerable<Player> players)
        {
            var fallback = new Domain.Entities.Move?[8];

            if (string.IsNullOrEmpty(previousMovesJson)) return fallback;
            var previousMoves = JsonSerializer.Deserialize<Domain.Entities.Move[]>(previousMovesJson, _jsonSerializerOptions) ?? fallback;

            var previousMove = previousMoves[playerId + 4];

            if (previousMove == null) return previousMoves;
            var playerTiles = players.First(p => p.Id == playerId).Tiles.FirstOrDefault(t => t.Id == previousMove.Tile.Id);
            playerTiles?.Moves.Remove(previousMove.Coords);

            return previousMoves;
        }

        private Task BroadCast(string id, string type, Tile tile)
        {
            return _hubContext.Clients.Group(id).SendAsync("OpponentSelection", type, tile);
        }
    }
}
