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
            return allCells.Where(c =>c!=currentCell && allCells.SelectNeighbors(c).WhereOccupied().Count() > 0).ToCoords();
        }
    }
}
