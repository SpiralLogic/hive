using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.DTOs
{
    public record GameState(IEnumerable<Player> Players, IEnumerable<Cell> Cells)
    {
    }
}
