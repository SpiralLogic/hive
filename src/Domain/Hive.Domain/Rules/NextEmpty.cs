using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Rules
{
    public class NextEmpty : IRule
    {
        public ISet<Coords> ApplyRule(Cell currentCell, ISet<Cell> allCells)
        {
            var coords = new HashSet<Coords>() {
                GetFirstEmpty(allCells, c => c.TopLeft(), currentCell.Coords) ,
                GetFirstEmpty(allCells, c => c.TopRight(), currentCell.Coords) ,

                GetFirstEmpty(allCells, c => c.Left(), currentCell.Coords) ,

                GetFirstEmpty(allCells, c => c.Right(), currentCell.Coords) ,
                GetFirstEmpty(allCells, c => c.BottomLeft(), currentCell.Coords) ,
                GetFirstEmpty(allCells, c => c.BottomRight(), currentCell.Coords) ,
                };
            coords.ExceptWith(currentCell.Coords.GetNeighbors());
            return coords;
        }

        private Coords GetFirstEmpty(ISet<Cell> allCells, Func<Coords, Coords> nextFunc, Coords current)
        {
            var cell = allCells.FirstOrDefault(c => c.Coords == current);
            return cell == null || cell.IsEmpty() ? current : GetFirstEmpty(allCells, nextFunc, nextFunc(current));
        }
    }
}
