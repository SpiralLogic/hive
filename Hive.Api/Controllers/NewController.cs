using System.Drawing;
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

            gameState.Cells.Add(new Cell(new GameCoordinate(2, 1)));
            gameState.Cells.Add(new Cell(new GameCoordinate(3, 1)));
            gameState.Cells.Add(new Cell(new GameCoordinate(1, 1)));
            gameState.Cells.Add(new Cell(new GameCoordinate(1, 1)));
            gameState.Cells.Add(new Cell(new GameCoordinate(1, 1)));
            gameState.Cells.Add(new Cell(new GameCoordinate(2, 1)));
            gameState.Cells.Add(new Cell(new GameCoordinate(2, 1)));
            gameState.Cells.Add(new Cell(new GameCoordinate(1, 1)));
            gameState.Cells.Add(new Cell(new GameCoordinate(2, 1)));
            gameState.Cells.Add(new Cell(new GameCoordinate(3, 1)));
            gameState.Cells.Add(new Cell(new GameCoordinate(4, 1)));
            gameState.Cells.Add(new Cell(new GameCoordinate(4, 1)));
            gameState.Cells.Add(new Cell(new GameCoordinate(4, 1)));

            var player = new Player(21, "test", ColorTranslator.ToHtml(Color.Aquamarine));
            var player2 = new Player(2, "test2", ColorTranslator.ToHtml(Color.Aquamarine));

            var tile = new Tile(1, player.Id, new TextContent("bug"));
            tile.AvailableMoves.Add(new GameCoordinate(1, 1));
            player.AvailableTiles.Add(tile);
            gameState.Players.Add(player);
            gameState.Players.Add(player2);
            
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