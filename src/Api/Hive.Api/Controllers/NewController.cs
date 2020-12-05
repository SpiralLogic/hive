using System.Net.NetworkInformation;
using System.Text.Json;
using Hive.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Hive.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NewController : Controller
    {
        private readonly JsonSerializerOptions _jsonSerializerOptions;

        public NewController(ILogger<NewController> logger, IOptions<JsonOptions> jsonOptions)
        {
            _jsonSerializerOptions = jsonOptions.Value.JsonSerializerOptions;
        }

        [HttpPost]
        [Produces("application/json")]
        public Domain.Hive Post()
        {
            var newGame = new Domain.Hive(new[] {"P1", "P2"});
            var json = JsonSerializer.Serialize(new GameState(newGame.Players, newGame.Cells, IPGlobalProperties.GetIPGlobalProperties().HostName), _jsonSerializerOptions);
            HttpContext.Session.SetString(Constants.GameStateSessionKey, json);
            return newGame;
        }
    }
}
