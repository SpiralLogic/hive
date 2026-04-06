using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hive.Api.DTOs;
using Hive.Api.Services;
using Hive.Domain;
using Hive.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Hive.Api.Controllers;

[ApiController]
public class NewController(IGameSessionStore gameSessionStore) : Controller
{
    private static readonly string[] PlayerNames=
    [
        "P1",
        "P2"
    ];

    [HttpPost]
    [Route("api/new")]
    [Produces("application/json")]
    public async ValueTask<CreatedAtRouteResult> Post()
    {
        var gameId = Guid.NewGuid().ToString("N")[..12];

        var newGame = HiveFactory.Create(
            PlayerNames
        );
        var gameState = new GameState(gameId, GameStatus.NewGame, newGame.Players, newGame.Cells, new List<HistoricalMove>());
        await gameSessionStore.SetGame(gameId, gameState).ConfigureAwait(false);

        return CreatedAtRoute("GameEndpointApi",new{Id=gameId }, gameState);
    }
}
