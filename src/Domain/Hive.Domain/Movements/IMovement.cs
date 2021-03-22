using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Movements
{
    public interface IMovement
    {
        ISet<Coords> GetMoves(Cell currentCell, ISet<Cell> allCells);
    }
}
