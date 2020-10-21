using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Rules
{
    public class OneSpace : IRule
    {
        public ISet<Coords> ApplyRule(Cell originCell, ISet<Cell> allCells) => originCell.Coords.GetNeighbors();
    }
}
