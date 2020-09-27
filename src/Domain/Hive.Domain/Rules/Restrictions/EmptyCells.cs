using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Rules.Restrictions
{
    class EmptyCells : IRestriction
    {
        public ISet<Coords> Restrict(Coords position, ISet<Cell> cells)
        {
            return cells.WhereOccupied().Select(c => c.Coords).ToHashSet();
        }
    }
}
