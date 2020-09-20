using Hive.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Hive.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NewController : Controller
    {
        private readonly ILogger<NewController> _logger;

        public NewController(ILogger<NewController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [Produces("application/json")]
        public Domain.Hive Post()
        {
            var newGame = new Domain.Hive(new[] {"P1", "P2"});
            var json = JsonSerializer.Serialize(new GameState(newGame.Players,newGame.Cells));
            HttpContext.Session.SetString(Constants.GameStateKey, json);
            return newGame;
        }
    }
}
