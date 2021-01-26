using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Movements
{
    public class Adjacent : IMovements
    {
        public ISet<Coords> GetMoves(Cell originCell, ISet<Cell> allCells) => originCell.Coords.GetNeighbors();
    }
}
