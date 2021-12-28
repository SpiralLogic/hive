using System;
using System.Linq;
using System.Text.Json;
using Hive.Domain;
using Hive.Domain.Entities;
using Hive.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;

namespace Hive.Controllers;

[ApiController]
public class NewController : Controller
{
    private readonly IDistributedCache _distributedCache;
    private readonly JsonSerializerOptions _jsonSerializerOptions;

    public NewController(IOptions<JsonOptions> jsonOptions, IDistributedCache distributedCache)
    {
        _distributedCache = distributedCache;
        _jsonSerializerOptions = jsonOptions.Value.JsonSerializerOptions;
    }

    [HttpPost]
    [Route("api/new")]
    [Produces("application/json")]
    public CreatedResult Post()
    {
        var gameId = new string(HttpContext.TraceIdentifier.Split(":")[0].ToCharArray().OrderBy(_ => Guid.NewGuid())
            .ToArray());

        var newGame = HiveFactory.CreateHive(new[] {"P1", "P2"});
        var gameState = new GameState(newGame.Players, newGame.Cells, gameId, GameStatus.NewGame);
        var json = JsonSerializer.Serialize(gameState, _jsonSerializerOptions);
        _distributedCache.SetString(gameId, json);

        return Created($"/api/game/{gameId}/{0}", gameState);
    }
}