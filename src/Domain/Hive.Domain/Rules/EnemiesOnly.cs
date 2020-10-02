using System.Collections.Generic;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;
using System.Linq;

namespace Hive.Domain.Rules
{
    public class EnemiesOnly : IRule
    {
        public ISet<Coords> ApplyRule(Cell originCell, ISet<Cell> allCells)
        {
            return allCells.Where(c=> !c.IsEmpty() && c.TopTile().PlayerId != originCell.TopTile().PlayerId).ToCoords();
        }
    }
}
