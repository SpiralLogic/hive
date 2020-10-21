using System.Collections.Generic;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Rules
{
    public class IsEmpty : IRule
    {
        public ISet<Coords> ApplyRule(Cell currentCell, ISet<Cell> cells) => cells.WhereEmpty().ToCoords();
    }
}
