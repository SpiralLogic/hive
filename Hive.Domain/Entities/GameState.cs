using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public class GameState
    {
        public GameState(IEnumerable<Player> players, IEnumerable<Cell> hexagons)
        {
            Players = players ?? new List<Player>();
            Hexagons = hexagons ?? new List<Cell>();
        }

        public IEnumerable<Cell> Hexagons { get; }
        public IEnumerable<Player> Players { get; }
    }
}