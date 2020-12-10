using System.Text.Json;
using Hive.DTOs;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Hive.Controllers
{
    [ApiController]
    public class GameController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly JsonSerializerOptions _jsonSerializerOptions;

        public GameController(ILogger<NewController> logger, IOptions<JsonOptions> jsonOptions, IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
            _jsonSerializerOptions = jsonOptions.Value.JsonSerializerOptions;
        }

        [HttpGet]
        [Route("game/{id}")]
        public ActionResult Get(string id)
        {
            var gameSession = HttpContext.Session.GetString(id);
            if (gameSession == null)
            {
                return Redirect("/");
            }
            return new VirtualFileResult("/index.html", "text/html");
        }

        [HttpGet]
        [Route("api/game/{id}")]
        [Produces("application/json")]
        [ProducesErrorResponseType(typeof(NotFoundResult))]
        public ActionResult<GameState> GetGame(string id)
        {

            var gameSession = HttpContext.Session.GetString(id);
            if (gameSession == null) return NotFound();

            var gameState = JsonSerializer.Deserialize<GameState>(gameSession, _jsonSerializerOptions);
            if (gameState == null) return NotFound();

            return Ok(gameState);
        }
    }
}
