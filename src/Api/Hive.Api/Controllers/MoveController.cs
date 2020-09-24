using System.Linq;
using System.Text.Json;
using Hive.Domain.Entities;
using Hive.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Hive.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MoveController : ControllerBase
    {
        private readonly ILogger<MoveController> _logger;

        public MoveController(ILogger<MoveController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public GameState Post([FromBody] Move move)
        {
            var gameState = JsonSerializer.Deserialize<GameState>(HttpContext.Session.GetString(Constants.GameStateKey));
            var game =  new Domain.Hive(gameState.Players.ToHashSet(), gameState.Cells.ToHashSet());

            game.Move(move);

            gameState = new GameState(game.Players.ToHashSet(), game.Cells.ToHashSet());
            var json = JsonSerializer.Serialize(gameState);
            HttpContext.Session.SetString(Constants.GameStateKey, json);
            return gameState;
        }
    }
}
    