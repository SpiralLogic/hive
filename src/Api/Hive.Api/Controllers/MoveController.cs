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
            if (move == null) return BadRequest();
            if (string.IsNullOrEmpty(id)) return BadRequest();

            var gameSession = await _distributedCache.GetStringAsync(id);
            if (string.IsNullOrEmpty(gameSession)) return NotFound();

            var (players, cells, _, _) = JsonSerializer.Deserialize<GameState>(gameSession, _jsonSerializerOptions)!;

            var game = new Domain.Hive(players.ToList(), cells.ToHashSet());
            var tile = players.SelectMany(p => p.Tiles).Concat(cells.SelectMany(c => c.Tiles)).FirstOrDefault(t => t.Id == move.TileId);
            if (tile == null) return Forbid();

            var gameStatus = game.Move(new Domain.Entities.Move(tile, move.Coords));

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
            var (players, cells, _, _) = JsonSerializer.Deserialize<GameState>(gameSessionJson, _jsonSerializerOptions)!;
            var previousMoves = string.IsNullOrEmpty(previousMovesJson)
                ? new Domain.Entities.Move?[8]
                : JsonSerializer.Deserialize<Domain.Entities.Move[]>(previousMovesJson, _jsonSerializerOptions) ??
                  new Domain.Entities.Move?[8];

            var previousMove = previousMoves[playerId+4];
            if (previousMove != null)
            {
                var playerTiles = players.First(p => p.Id == playerId)
                    .Tiles.FirstOrDefault(t => t.Id == previousMove.Tile.Id);
                playerTiles?.Moves.Remove(previousMove.Coords);
            }
            
            var game = new Domain.Hive(players.ToList(), cells.ToHashSet());

            var (status, move) = await game.AiMove(async (type, tile) => await BroadCast(id, type, tile));
            previousMoves[playerId+4] = previousMoves[playerId+2];
            previousMoves[playerId+2] = previousMoves[playerId];
            previousMoves[playerId] = move;

            var newGameState = new GameState(game.Players, game.Cells, id, status);
            await _hubContext.Clients.Group(id).SendAsync("ReceiveGameState", newGameState);
            var gameJson = JsonSerializer.Serialize(newGameState, _jsonSerializerOptions);
            await _distributedCache.SetStringAsync(id, gameJson);

            previousMovesJson = JsonSerializer.Serialize(previousMoves, _jsonSerializerOptions);
            await _distributedCache.SetStringAsync(id + "-moves", previousMovesJson);

            return Accepted($"/game/{id}", newGameState);
        }

        private Task BroadCast(string id, string type, Tile tile)
        {
            return _hubContext.Clients.Group(id).SendAsync("OpponentSelection", type, tile);
        }
    }
}
