using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Rules
{
    public class NotAllEmptyNeighbours : IRule
    {
        public ISet<Coords> ApplyRule(Cell currentCell, ISet<Cell> allCells)
        {
            var cells = new HashSet<Cell>(allCells);
            cells.Remove(currentCell);
            return cells.Where(c =>cells.SelectNeighbors(c).WhereOccupied().Count() > 0).ToCoords();
        }
    }
}
