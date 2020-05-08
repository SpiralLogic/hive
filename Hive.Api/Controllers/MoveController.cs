using System.Linq;
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
        public GameState Post([FromForm] int tileId,[FromForm] GameCoordinate  coordinates)
        {
            var gameState = JsonConvert.DeserializeObject<GameState>(HttpContext.Session.GetString("game"));

            gameState.Cells.First(c => c.Coordinates == coordinates)
                .Tiles.Add(gameState.Players.SelectMany(p => p.AvailableTiles).First(t => t.Id == tileId));

            var json = JsonConvert.SerializeObject(gameState);
            HttpContext.Session.SetString("game", json);
            return gameState;
        }
    }
}