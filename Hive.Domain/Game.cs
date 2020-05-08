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
                player.AvailableTiles.Add(new Tile(player.Id, player.Id, new TextContent(player.Name), new List<GameCoordinate> {new GameCoordinate(1,1)}));
            }
        }

        public GameState State => new GameState(_players, 
            new List<Cell> {
                new Cell(new GameCoordinate(1,1)),
                new Cell(new GameCoordinate(1,2)),
                new Cell(new GameCoordinate(1,3)),
                new Cell(new GameCoordinate(2,1)),
                new Cell(new GameCoordinate(2,2)),
                new Cell(new GameCoordinate(2,3)),
                new Cell(new GameCoordinate(3,1)),
                new Cell(new GameCoordinate(3,2)),
                new Cell(new GameCoordinate(3,3)),
                new Cell(new GameCoordinate(4,1)),
                new Cell(new GameCoordinate(4,2)),
                new Cell(new GameCoordinate(4,3)),
                
            });
    }
}