using System.Linq;
using System.Net.NetworkInformation;
using System.Text.Json;
using Hive.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Hive.Controllers
{
    [ApiController]
    public class MoveController : ControllerBase
    {
        private readonly ILogger<MoveController> _logger;
        private readonly IDistributedCache _distributedCache;
        private readonly JsonSerializerOptions _jsonSerializerOptions;

        public MoveController(ILogger<MoveController> logger,
            IOptions<JsonOptions> jsonOptions,
            IDistributedCache distributedCache)
        {
            _logger = logger;
            _distributedCache = distributedCache;
            _jsonSerializerOptions = jsonOptions.Value.JsonSerializerOptions;
        }

        [HttpPost]
        [Route("/api/move/{id}")]
        [Produces("application/json")]
        [ProducesErrorResponseType(typeof(NotFoundResult))]
        public ActionResult Post(string id, [FromBody] Move move)
        {
            var gameSession = HttpContext.Session.GetString(id);
            if (gameSession == null) return NotFound();

            var gameState = JsonSerializer.Deserialize<GameState>(gameSession, _jsonSerializerOptions);
            if (gameState == null) return NotFound();

            var game = new Domain.Hive(gameState.Players.ToList(), gameState.Cells.ToHashSet());
            game.Move(move.TileId, move.Coords);
            var newGameState = new GameState(game.Players, game.Cells, id);

            var json = JsonSerializer.Serialize(newGameState, _jsonSerializerOptions);
            HttpContext.Session.SetString(id, json);

            return Accepted($"/game/{id}", newGameState);
        }
    }
}
