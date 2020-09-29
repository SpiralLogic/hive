using System.Collections.Generic;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Rules.Movements
{
    public class AdjacentCells : IMovementRule
    {
        public ISet<Coords> GetAvailableMoves(Cell originCell, ISet<Cell> allCells)
        {
            return originCell.Coords.GetNeighbors();
        }
    }
}
