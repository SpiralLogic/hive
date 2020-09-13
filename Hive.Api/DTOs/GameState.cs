using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Models
{
    public record GameState(IEnumerable<Player> Players, IEnumerable<Cell> Cells)
    {
    }
}
