using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements;

public class OnlyJumpStraightOver : IMovement
{
    public ISet<Coords> GetMoves(Cell originCell, ISet<Cell> allCells)
    {
        var cells = new HashSet<Cell>
        {
            GetFirstEmpty(allCells, c => c.Neighbours()[(int)Direction.TopLeft], originCell.Coords),
            GetFirstEmpty(allCells, c => c.Neighbours()[(int)Direction.TopRight], originCell.Coords),

            GetFirstEmpty(allCells, c => c.Neighbours()[(int)Direction.Left], originCell.Coords),

            GetFirstEmpty(allCells, c =>c.Neighbours()[(int)Direction.Right], originCell.Coords),
            GetFirstEmpty(allCells, c => c.Neighbours()[(int)Direction.BottomLeft], originCell.Coords),
            GetFirstEmpty(allCells, c => c.Neighbours()[(int)Direction.BottomRight], originCell.Coords)
        };

        return cells.Except(originCell.SelectNeighbors(allCells)).ToCoords();
    }

    private static Cell GetFirstEmpty(ISet<Cell> allCells, Func<Coords, Coords> nextFunc, Coords current)
    {
        if (allCells.FindCellOrDefault(current) == null) return new Cell(current);
        return allCells.FirstOrDefault(c => c.Coords == current && c.IsEmpty()) ??
               GetFirstEmpty(allCells, nextFunc, nextFunc(current));
    }
}