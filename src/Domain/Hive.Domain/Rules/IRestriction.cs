using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Rules
{
    interface IRestriction
    {
        ISet<Coords> Restrict(Coords position, ISet<Cell> cells);
    }
}
