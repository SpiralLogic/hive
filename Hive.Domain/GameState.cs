using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace Hive.Domain
{
    public class GameState
    {
        public ICollection<Cell> Cells { get; } = new List<Cell>();
        public ICollection<Player> Players { get; } = new List<Player>();
    }
}