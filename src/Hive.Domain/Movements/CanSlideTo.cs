using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements;

public class CanSlideTo : IMovement
{
    public ISet<Coords> GetMoves(Cell originCell, ISet<Cell> allCells)
    {
        var availableCells = new HashSet<Cell>();
        GetSlidableNeighbors(originCell, availableCells, allCells);
        return availableCells.ToCoords();
    }

    private static void GetSlidableNeighbors(Cell currentCell, ISet<Cell> availableCells, ISet<Cell> allCells)
    {
        var neighbors = currentCell.SelectNeighbors(allCells).ToArray();
        foreach (var n in neighbors)
        {
            if (!n.IsEmpty() || n.SelectNeighbors(neighbors).WhereOccupied().Count() == 2) continue;
            if (availableCells.Contains(n)) continue;
            availableCells.Add(n);
            GetSlidableNeighbors(n, availableCells, allCells);
        }
    }
}
