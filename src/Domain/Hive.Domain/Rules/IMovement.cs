using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    internal interface IMovement
    {
        ISet<Coords> GetAvailableMoves(Coords tileCoords, ISet<Cell> cells);
    }
}