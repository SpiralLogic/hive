using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements
{
    public class OnlyJumpStraightOver : IMovement
    {
        public ISet<Coords> GetMoves(Cell currentCell, ISet<Cell> allCells)
        {
            var cells = new HashSet<Cell>
            {
                GetFirstEmpty(allCells, c => c.GetNeighbors()[Direction.TopLeft], currentCell.Coords),
                GetFirstEmpty(allCells, c => c.GetNeighbors()[Direction.TopRight], currentCell.Coords),

                GetFirstEmpty(allCells, c => c.GetNeighbors()[Direction.Left], currentCell.Coords),

                GetFirstEmpty(allCells, c =>c.GetNeighbors()[Direction.Right], currentCell.Coords),
                GetFirstEmpty(allCells, c => c.GetNeighbors()[Direction.BottomLeft], currentCell.Coords),
                GetFirstEmpty(allCells, c => c.GetNeighbors()[Direction.BottomRight], currentCell.Coords)
            };

            return cells.Except(currentCell.SelectNeighbors(allCells)).ToCoords();
        }

        private static Cell GetFirstEmpty(ISet<Cell> allCells, Func<Coords, Coords> nextFunc, Coords current)
        {
            if (allCells.FindCellOrDefault(current) == null) return new Cell(current);
            return allCells.FirstOrDefault(c => c.Coords == current && c.IsEmpty()) ??
                   GetFirstEmpty(allCells, nextFunc, nextFunc(current));
        }
    }
}
