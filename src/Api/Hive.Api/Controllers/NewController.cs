using Hive.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace Hive.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NewController : Controller
    {
        private readonly ILogger<NewController> _logger;
        private readonly JsonSerializerOptions _jsonSerializerOptions;

        public NewController(ILogger<NewController> logger, IOptions<JsonOptions> jsonOptions)
        {
            _logger = logger;
            _jsonSerializerOptions = jsonOptions.Value.JsonSerializerOptions;
        }

        [HttpPost]
        [Produces("application/json")]
        public Domain.Hive Post()
        {
            var newGame = new Domain.Hive(new[] {"P1", "P2"});
            var json = JsonSerializer.Serialize(new GameState(newGame.Players, newGame.Cells), _jsonSerializerOptions);
            HttpContext.Session.SetString(Constants.GameStateSessionKey, json);
            return newGame;
        }
    }
}