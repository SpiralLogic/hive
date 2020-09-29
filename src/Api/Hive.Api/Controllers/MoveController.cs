using System.Linq;
using System.Text.Json;
using Hive.Domain.Entities;
using Hive.DTOs;
using Hive.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Hive.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MoveController : ControllerBase
    {
        private readonly ILogger<MoveController> _logger;
        private readonly JsonSerializerOptions _jsonSerializerOptions;

        public MoveController(ILogger<MoveController> logger, IOptions<JsonOptions> jsonOptions)
        {
            _logger = logger;
            _jsonSerializerOptions = jsonOptions.Value.JsonSerializerOptions;
        }

        [HttpPost]
        public ActionResult Post([FromBody] Move move)
        {
            var gameState = JsonSerializer.Deserialize<GameState>(HttpContext.Session.GetString(Constants.GameStateSessionKey),
                _jsonSerializerOptions);
            if (gameState == null) return NotFound();

            var game = new Domain.Hive(gameState.Players.ToHashSet(), gameState.Cells.ToHashSet());

            game.Move(move.TileId, move.Coords);

            var json = JsonSerializer.Serialize(new GameState(game.Players, game.Cells), _jsonSerializerOptions);
            HttpContext.Session.SetString(Constants.GameStateSessionKey, json);
            
            return Accepted(game);
        }
    }
}