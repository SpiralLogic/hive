using System.Linq;
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
        public State Post([FromBody] Move moveTile)
        {
            var gameJson = JsonConvert.DeserializeObject<State>(HttpContext.Session.GetString(Constants.GameStateKey));
            var currentGame = new Domain.Hive(gameJson);

            currentGame.Move(moveTile.TileId, new Domain.Entities.Coordinates(moveTile.Coords.Q, moveTile.Coords.R));
            var json = JsonConvert.SerializeObject(currentGame.State);
            HttpContext.Session.SetString(Constants.GameStateKey, json);
            return currentGame.State;
        }
    }
}
