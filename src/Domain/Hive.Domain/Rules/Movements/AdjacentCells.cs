using System.Collections.Generic;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Rules.Movements
{
    internal class AdjacentCells : IMovement
    {
        public ISet<Coords> GetAvailableMoves(Coords tileCoords, ISet<Cell> cells)
        {
            return tileCoords.GetNeighbors();
        }
    }
}
