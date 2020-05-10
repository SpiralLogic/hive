using System.Linq;
using Hive.Domain;
using Hive.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using GameCoordinate = Hive.Models.GameCoordinate;

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
        public GameState Post([FromForm] int tileId, [FromForm] GameCoordinate coordinates)
        {
            var gameState = JsonConvert.DeserializeObject<GameState>(HttpContext.Session.GetString("game"));
            var game = new Game(gameState);

            game.Move(tileId, new Domain.Entities.GameCoordinate(coordinates.Q, coordinates.R));
            var json = JsonConvert.SerializeObject(game.State);
            HttpContext.Session.SetString("game", json);
            return game.State;
        }
    }
}