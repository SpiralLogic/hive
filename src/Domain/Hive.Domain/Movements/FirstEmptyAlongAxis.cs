using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements
{
    public class FirstEmptyAlongAxis : IMovements
    {
        public ISet<Coords> GetMoves(Cell currentCell, ISet<Cell> allCells)
        {
            var cells = new HashSet<Cell>
            {
                GetFirstEmpty(allCells, c => c.TopLeft, currentCell.Coords) ,
                GetFirstEmpty(allCells, c => c.TopRight, currentCell.Coords) ,

                GetFirstEmpty(allCells, c => c.Left, currentCell.Coords) ,

                GetFirstEmpty(allCells, c => c.Right, currentCell.Coords) ,
                GetFirstEmpty(allCells, c => c.BottomLeft, currentCell.Coords) ,
                GetFirstEmpty(allCells, c => c.BottomRight, currentCell.Coords) ,
                };

            return cells.Except(currentCell.SelectNeighbors(allCells)).ToCoords();
        }

        private Cell GetFirstEmpty(ISet<Cell> allCells, Func<Coords, Coords> nextFunc, Coords current) =>
            allCells.Where(c => c.Coords == current).FirstOrDefault(c => c.IsEmpty()) ??
            GetFirstEmpty(allCells, nextFunc, nextFunc(current));
    }
}
