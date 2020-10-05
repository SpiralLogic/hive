using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Rules
{
    public class AdjacentCells : IRule
    {
        public ISet<Coords> ApplyRule(Cell originCell, ISet<Cell> allCells)
        {
            return originCell.Coords.GetNeighbors();
        }
    }
}
