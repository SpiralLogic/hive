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
                GetFirstEmpty(allCells, (Coords c) => c.TopLeft(), currentCell.Coords) ,
                GetFirstEmpty(allCells, (Coords c) => c.TopRight(), currentCell.Coords) ,
                GetFirstEmpty(allCells, (Coords c) => c.Left(), currentCell.Coords) ,
                GetFirstEmpty(allCells, (Coords c) => c.Right(), currentCell.Coords) ,
                GetFirstEmpty(allCells, (Coords c) => c.BottomLeft(), currentCell.Coords) ,
                GetFirstEmpty(allCells, (Coords c) => c.BottomRight(), currentCell.Coords) ,
                };
            coords.ExceptWith(currentCell.Coords.GetNeighbors());
            return coords;
        }

        public Coords GetFirstEmpty(ISet<Cell> allCells, Func<Coords, Coords> next, Coords current)
        {
            var cell = allCells.First(c => c.Coords == current);
            return cell.IsEmpty() ? current : GetFirstEmpty(allCells, next, next(current));
        }
    }
}
