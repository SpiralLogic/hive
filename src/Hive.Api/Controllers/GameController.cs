using System;
using System.Threading.Tasks;
using Hive.Api.DTOs;
using Hive.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Hive.Api.Controllers;

[ApiController]
public class GameController(IGameSessionStore gameSessionStore)  : Controller
{
    [HttpGet]
    [Route("/game/{id}/{playerId:int?}", Name = "GameEndpoint")]
    public async Task<IActionResult> Get(string id, int playerId = 0)
    {
        if (!await gameSessionStore.Exists(id).ConfigureAwait(false)) return Redirect("/");

        return File("/index.html", "text/html; charset=utf-8");
    }

    [HttpGet]
    [Route("/api/game/{id}", Name = "GameEndpointApi")]
    [Produces("application/json")]
    [ProducesErrorResponseType(typeof(NotFoundResult))]
    public async Task<ActionResult<GameState>> GetGame(string id)
    {
        var gameState = await gameSessionStore.GetGame(id).ConfigureAwait(false);
        if (gameState == null) return NotFound();

        return Ok(gameState);
    }
}
