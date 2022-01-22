using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Movements;

public class IsAdjacent : IMovement
{
    public ISet<Coords> GetMoves(Cell originCell, ISet<Cell> allCells)
    {
        return originCell.Coords.Neighbours().ToHashSet();
    }
}
