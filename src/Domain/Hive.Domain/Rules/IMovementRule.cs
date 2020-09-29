using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public interface IMovementRule
    {
        ISet<Coords> GetAvailableMoves(Cell originCell, ISet<Cell> alLCells);
    }
}