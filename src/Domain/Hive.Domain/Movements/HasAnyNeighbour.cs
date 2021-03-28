using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements
{
    public class HasAnyNeighbour : IMovement
    {
        public ISet<Coords> GetMoves(Cell currentCell, ISet<Cell> allCells)
        {
            if (currentCell.Tiles.Count<=1) allCells.Remove(currentCell);
            return allCells.WhereOccupied().SelectMany(c => c.SelectNeighbors(allCells)).ToCoords();
        }
    }
}
