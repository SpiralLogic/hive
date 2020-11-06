using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.DTOs
{
    public sealed record GameState(IEnumerable<Player> Players, IEnumerable<Cell> Cells)
    {
    }
}
