using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Hive.DTOs;
using Hive.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;

namespace Hive.Controllers
{
    [ApiController]
    public class MoveController : ControllerBase
    {
        private readonly IHubContext<GameHub> _hubContext;
        private readonly IDistributedCache _distributedCache;
        private readonly JsonSerializerOptions _jsonSerializerOptions;

        public MoveController(IHubContext<GameHub> hubContext,
            IOptions<JsonOptions> jsonOptions,
            IDistributedCache distributedCache)
        {
            _hubContext = hubContext;
            _distributedCache = distributedCache;
            _jsonSerializerOptions = jsonOptions.Value.JsonSerializerOptions;
        }

        [HttpPost]
        [Route("/api/move/{id}")]
        [Produces("application/json")]
        [ProducesErrorResponseType(typeof(NotFoundResult))]
        public async Task<ActionResult> Post(string id, [FromBody] Move move)
        {
            if (move == null) throw new ArgumentNullException(nameof(move));
            var gameSession = await _distributedCache.GetStringAsync(id);
            if (gameSession == null) return NotFound();

            var gameState = JsonSerializer.Deserialize<GameState>(gameSession, _jsonSerializerOptions);
            if (gameState == null) return NotFound();

            var game = new Domain.Hive(gameState.Players.ToList(), gameState.Cells.ToHashSet());
            game.Move(move.TileId, move.Coords);
            var newGameState = new GameState(game.Players, game.Cells, id);

            var json = JsonSerializer.Serialize(newGameState, _jsonSerializerOptions);
            await _distributedCache.SetStringAsync(id, json);
            await _hubContext.Clients.Group(id).SendAsync("ReceiveGameState", newGameState);

            return Accepted($"/game/{id}", newGameState);
        }
    }
}
