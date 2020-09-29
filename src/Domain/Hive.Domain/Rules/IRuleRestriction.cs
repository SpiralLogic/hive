using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Rules
{
    interface IRuleRestriction
    {
        ISet<Coords> ApplyRestriction(Cell originCell, ISet<Cell> allCells);
    }
}
