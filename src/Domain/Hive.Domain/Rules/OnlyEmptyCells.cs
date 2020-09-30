using System.Collections.Generic;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Rules
{
    public class OnlyEmptyCells : IRule
    {
        public ISet<Coords> ApplyRule(Cell currentCell, ISet<Cell> cells)
        {
            return cells.WhereEmpty().ToCoords();
        }
    }
}
