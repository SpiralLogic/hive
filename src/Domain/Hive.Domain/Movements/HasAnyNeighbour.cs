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
            var allCells2 = allCells.ToHashSet();
            if (currentCell.Tiles.Count<=1) allCells2.Remove(currentCell);
            return allCells2.WhereOccupied().SelectMany(c => c.SelectNeighbors(allCells2)).ToCoords();
        }
    }
}
