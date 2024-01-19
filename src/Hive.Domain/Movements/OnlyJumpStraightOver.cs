using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements;
internal class OnlyJumpStraightOver : IMovement
{
    public ISet<Coords> GetMoves(Cell originCell, ISet<Cell> allCells)
    {
        var directions = Enum.GetValues(typeof(Direction)).Cast<Direction>();
        var cells = directions.Select(d => CalculateNextCell(d, allCells, originCell.Coords)).ToHashSet();

        return cells.Except(originCell.SelectNeighbors(allCells)).ToCoords();
    }

    private static Cell CalculateNextCell(Direction direction, ISet<Cell> allCells, Coords current)
    {
        return GetFirstEmpty(allCells, c => c.Neighbours()[(int)direction], current);
    }

    private static Cell GetFirstEmpty(ISet<Cell> allCells, Func<Coords, Coords> nextFunc, Coords current)
    {
        if (allCells.FindCellOrDefault(current) == null) return new(current);
        return allCells.FirstOrDefault(c => c.Coords == current && c.IsEmpty())
               ?? GetFirstEmpty(allCells, nextFunc, nextFunc(current));
    }
}