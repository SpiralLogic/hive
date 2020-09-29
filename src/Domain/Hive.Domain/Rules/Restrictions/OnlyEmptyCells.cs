using System.Collections.Generic;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Rules.Restrictions
{
    public class OnlyEmptyCells : IRuleRestriction
    {
        public ISet<Coords> ApplyRestriction(Cell currentCell, ISet<Cell> cells)
        {
            return cells.WhereOccupied().ToCoords();
        }
    }
}
