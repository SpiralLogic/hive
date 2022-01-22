using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements;

public class HiveHasQueen : IMovement
{
    public ISet<Coords> GetMoves(Cell originCell, ISet<Cell> allCells)
    {
        return QueenHasBeenPlaced(originCell, allCells) ? allCells.ToCoords() : new HashSet<Coords>();
    }

    private static bool QueenHasBeenPlaced(Cell currentCell, ISet<Cell> allCells)
    {
        return allCells.WherePlayerOccupies(currentCell.TopTile().PlayerId).Any(c => c.HasQueen());
    }
}
