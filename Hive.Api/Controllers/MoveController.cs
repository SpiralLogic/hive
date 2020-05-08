using System.Linq;
using System.Net.Mime;
using Hive.Domain;
using Hive.Domain.Entities;
using Hive.Models;
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
        public GameState Post([FromForm] Move move)
        {
            var gameState = JsonConvert.DeserializeObject<GameState>(HttpContext.Session.GetString("game"));

            gameState.Cells.First().Tiles.Add(gameState.Players.First().AvailableTiles.First());

            var json = JsonConvert.SerializeObject(gameState);
            HttpContext.Session.SetString("game", json);
            return gameState;
        }
    }
}