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
        AddSlidableNeighbors(originCell, availableCells, allCells);
        return availableCells.ToCoords();
    }
    private static void AddSlidableNeighbors(Cell currentCell, ISet<Cell> availableCells, ISet<Cell> allCells)
    {
        var neighbors = currentCell.SelectNeighbors(allCells).ToArray();
        foreach (var n in neighbors.WhereEmpty().Except(availableCells))
        {
            if (GetOccupiedNeighborsCount(n, neighbors) == 2) continue;
            availableCells.Add(n);
            AddSlidableNeighbors(n, availableCells, allCells);
        }
    }

    private static int GetOccupiedNeighborsCount(Cell cell, Cell[] neighbors) =>
        cell.SelectNeighbors(neighbors).WhereOccupied().Count();
}
