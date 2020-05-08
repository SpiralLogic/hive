using Hive.Domain;
using Hive.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Hive.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NewController : Controller
    {
        private readonly ILogger<NewController> _logger;
        public static GameState GameState;

        public NewController(ILogger<NewController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [Produces("application/json")]
        public GameState Post()
        {
            var gameState = new Game(new[] {"P1", "P2"}).State;
            var json = JsonConvert.SerializeObject(gameState);
            HttpContext.Session.SetString("game", json);
            return gameState;
        }
    }
}