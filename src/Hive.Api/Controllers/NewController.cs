using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hive.Api.DTOs;
using Hive.Api.Services;
using Hive.Domain;
using Hive.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Hive.Api.Controllers;

[ApiController]
public class NewController : Controller
{
    private readonly IGameSessionStore _gameSessionStore;
    private static readonly string[] PlayerNames={
        "P1",
        "P2"
    };

    public NewController(IGameSessionStore gameSessionStore)
    {
        _gameSessionStore = gameSessionStore;
    }

    [HttpPost]
    [Route("api/new")]
    [Produces("application/json")]
    public async ValueTask<CreatedAtRouteResult> Post()
    {
        var gameId = new string(HttpContext.TraceIdentifier.Split(":")[0].ToCharArray().OrderBy(_ => Guid.NewGuid()).ToArray());

        var newGame = HiveFactory.Create(
            PlayerNames
        );
        var gameState = new GameState(gameId, GameStatus.NewGame, newGame.Players, newGame.Cells, new List<HistoricalMove>());
        await _gameSessionStore.SetGame(gameId, gameState).ConfigureAwait(false);

        return CreatedAtRoute("GameEndpointApi",new{Id=gameId }, gameState);
    }
}
