using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public class GameState
    {
        public GameState(IEnumerable<Player> players, IEnumerable<Cell> cells)
        {
            Players = players ?? new List<Player>();
            Cells = cells ?? new List<Cell>();
        }

        public IEnumerable<Cell> Cells { get; }
        public IEnumerable<Player> Players { get; }
    }
}