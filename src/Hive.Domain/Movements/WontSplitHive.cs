using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements;

public class WontSplitHive : IMovement
{
    public ISet<Coords> GetMoves(Cell originCell, ISet<Cell> allCells)
    {
        var allCells2 = allCells.ToHashSet();
        allCells2.Remove(originCell) ;
        if (originCell.Tiles.Count > 1)
            return allCells2.ToCoords();

        var allOccupied = allCells2.WhereOccupied().ToHashSet();
        if (allOccupied.Count == 0)
            return allCells2.ToCoords();

        if (allOccupied.Count == 1)
            return allOccupied.Union(allOccupied.First().SelectNeighbors(allCells2)).ToCoords();

        CheckIsInHive(allOccupied, allOccupied.First());

        return allOccupied.Any() ? new HashSet<Coords>() : allCells2.ToCoords();
    }

    private static void CheckIsInHive(ISet<Cell> remaining, Cell toCheck)
    {
        remaining.Remove(toCheck);
        var neighbours = toCheck.SelectNeighbors(remaining).ToHashSet();
        if (!neighbours.Any()) return;
        foreach (var n in neighbours)
            CheckIsInHive(remaining, n);
    }
}