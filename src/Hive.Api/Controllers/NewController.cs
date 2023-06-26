using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Hive.Api.DTOs;
using Hive.Domain;
using Hive.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;

namespace Hive.Api.Controllers;

[ApiController]
public class NewController : Controller
{
    private readonly IDistributedCache _distributedCache;
    private readonly JsonSerializerOptions _jsonSerializerOptions;

    public NewController(IOptions<JsonOptions> jsonOptions, IDistributedCache distributedCache)
    {
        ArgumentNullException.ThrowIfNull(jsonOptions);

        _distributedCache = distributedCache;
        _jsonSerializerOptions = jsonOptions.Value.JsonSerializerOptions;
    }

    [HttpPost]
    [Route("api/new")]
    [Produces("application/json")]
    public async ValueTask<CreatedAtRouteResult> Post()
    {
        var gameId = new string(HttpContext.TraceIdentifier.Split(":")[0].ToCharArray().OrderBy(_ => Guid.NewGuid()).ToArray());

        var newGame = HiveFactory.Create(
            new[]
            {
                "P1",
                "P2"
            }
        );
        var gameState = new GameState(gameId, GameStatus.NewGame, newGame.Players, newGame.Cells, new List<HistoricalMove>());
        var json = JsonSerializer.Serialize(gameState, _jsonSerializerOptions);
        await _distributedCache.SetStringAsync(gameId, json).ConfigureAwait(false);

        return CreatedAtRoute("GameEndpointApi",new{Id=gameId }, gameState);
    }
}
