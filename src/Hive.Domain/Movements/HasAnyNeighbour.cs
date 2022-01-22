using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements;

public class HasAnyNeighbour : IMovement
{
    public ISet<Coords> GetMoves(Cell originCell, ISet<Cell> allCells)
    {
        var allCells2 = allCells.ToHashSet();
        if (originCell.Tiles.Count <= 1) allCells2.Remove(originCell);
        return allCells2.WhereOccupied().SelectMany(c => c.SelectNeighbors(allCells2)).ToCoords();
    }
}
