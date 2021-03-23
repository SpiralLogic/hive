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
        [ProducesErrorResponseType(typeof(NotFoundResult))]
        public async Task<IActionResult> Post(string id, [FromBody] Move move)
        {
            if (move == null) return BadRequest();
            if (string.IsNullOrEmpty(id)) return BadRequest();

            var gameSession = await _distributedCache.GetStringAsync(id);
            if (string.IsNullOrEmpty(gameSession)) return NotFound();

            var (players, cells, _, _) = JsonSerializer.Deserialize<GameState>(gameSession, _jsonSerializerOptions)!;

            var game = new Domain.Hive(players.ToList(), cells.ToHashSet());
            var tile = players.SelectMany(p => p.Tiles).Concat(cells.SelectMany(c => c.Tiles)).FirstOrDefault(t => t.Id == move.TileId);
            if (tile == null) return Forbid();

            var gameStatus = game.Move(new Domain.Entities.Move(tile, move.Coords), move.UseAi);

            if (gameStatus == GameStatus.Invalid) return Forbid();

            var newGameState = new GameState(game.Players, game.Cells, id, gameStatus);

            var json = JsonSerializer.Serialize(newGameState, _jsonSerializerOptions);
            await _distributedCache.SetStringAsync(id, json);
            await _hubContext.Clients.Group(id).SendAsync("ReceiveGameState", newGameState);

            return Accepted($"/game/{id}", newGameState);
        }
    }
}
