using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public class GameState
    {
        public ICollection<Cell> Cells { get; } = new List<Cell>();
        public ICollection<Player> Players { get; } = new List<Player>();
    }
}