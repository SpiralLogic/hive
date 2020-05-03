﻿using System.Drawing;
using Hive.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Hive.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NewController : Controller
    {
        private readonly ILogger<NewController> _logger;
        public static GameState GameState;

        public NewController(ILogger<NewController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [Produces("application/json")]
        public GameState Post()
        {
            var gameState = new GameState();
            gameState.Cells.Add(new Cell(new GameCoordinate(1, 1), ColorTranslator.ToHtml(Color.Chartreuse)));

            var player = new Player("test", ColorTranslator.ToHtml(Color.Aquamarine), ColorTranslator.ToHtml(Color.Aquamarine));

            var tile = new Tile("test", new TextContent("bug"), ColorTranslator.ToHtml(Color.Aqua));
            tile.AvailableMoves.Add(new GameCoordinate(1, 1));
            player.AvailableTiles.Add(tile);
            gameState.Players.Add(player);
            var set = new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                },
                Formatting = Formatting.Indented
            };
            
            var json = JsonConvert.SerializeObject(gameState, set);
            HttpContext.Session.SetString("game", json);
            return gameState;
        }
    }
}