using System.Text.Json;
using Hive.DTOs;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;

namespace Hive.Controllers
{
    [ApiController]
    public class GameController : Controller
    {
        private readonly IDistributedCache _distributedCache;
        private readonly JsonSerializerOptions _jsonSerializerOptions;

        public GameController(
            IOptions<JsonOptions> jsonOptions,
            IDistributedCache distributedCache
            )
        {
            _distributedCache = distributedCache;
            _jsonSerializerOptions = jsonOptions.Value.JsonSerializerOptions;
        }

        [HttpGet]
        [Route("/game/{id}")]
        public ActionResult Get(string id)
        {
            var gameSession = _distributedCache.GetString(id);
            if (gameSession == null)
            {
                return Redirect("/");
            }
            return new VirtualFileResult("/index.html", "text/html");
        }

        [HttpGet]
        [Route("/api/game/{id}")]
        [Produces("application/json")]
        [ProducesErrorResponseType(typeof(NotFoundResult))]
        public ActionResult<GameState> GetGame(string id)
        {

            var gameSession = _distributedCache.GetString(id);
            if (gameSession == null) return NotFound();

            var gameState = JsonSerializer.Deserialize<GameState>(gameSession, _jsonSerializerOptions);
            if (gameState == null) return NotFound();

            return Ok(gameState);
        }
    }
}
