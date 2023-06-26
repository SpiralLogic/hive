using System;
using System.Text.Json;
using System.Threading.Tasks;
using Hive.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;

namespace Hive.Api.Controllers;

[ApiController]
public class GameController : Controller
{
    private readonly IDistributedCache _distributedCache;
    private readonly JsonSerializerOptions _jsonSerializerOptions;

    public GameController(IOptions<JsonOptions> jsonOptions, IDistributedCache distributedCache)
    {
        ArgumentNullException.ThrowIfNull(jsonOptions);

        _distributedCache = distributedCache;
        _jsonSerializerOptions = jsonOptions.Value.JsonSerializerOptions;
    }

    [HttpGet]
    [Route("/game/{id}/{playerId:int?}", Name = "GameEndpoint")]
    public async Task<IActionResult> Get(string id, int playerId = 0)
    {
        var gameSession = await _distributedCache.GetStringAsync(id).ConfigureAwait(false);
        if (string.IsNullOrEmpty(gameSession)) return Redirect("/");

        return File("/index.html", "text/html; charset=utf-8");
    }

    [HttpGet]
    [Route("/api/game/{id}", Name = "GameEndpointApi")]
    [Produces("application/json")]
    [ProducesErrorResponseType(typeof(NotFoundResult))]
    public async Task<ActionResult<GameState>> GetGame(string id)
    {
        var gameSession = await _distributedCache.GetStringAsync(id).ConfigureAwait(false);
        if (string.IsNullOrEmpty(gameSession)) return NotFound();

        var gameState = JsonSerializer.Deserialize<GameState>(gameSession, _jsonSerializerOptions);

        return Ok(gameState);
    }
}
