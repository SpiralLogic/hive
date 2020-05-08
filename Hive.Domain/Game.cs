using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain
{
    public class Game
    {
        private readonly IReadOnlyCollection<Player> _players;

        public Game(IEnumerable<string> playerNames)
        {
            _players = playerNames.Select((name, id) => new Player(id, name)).ToList().AsReadOnly();
            foreach (var player in _players)
            {
                player.AvailableTiles.Add(new Tile(1, player.Id, new TextContent(player.Name), new List<GameCoordinate> {new GameCoordinate(1,1)}));
            }
        }

        public GameState State => new GameState(_players, new List<Cell> {new Cell(new GameCoordinate(1,1))});
    }
}