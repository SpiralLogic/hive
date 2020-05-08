 using System.Linq;
 using Hive.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
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
        [Produces("application/json")]
        public GameState Post()
        {
            var gameState = JsonConvert.DeserializeObject<GameState>(HttpContext.Session.GetString("game"));

            gameState.Cells.First().Tiles.Add(gameState.Players.First().AvailableTiles.First());

            var json = JsonConvert.SerializeObject(gameState);
            HttpContext.Session.SetString("game", json);
            return gameState;
        }
    }
}