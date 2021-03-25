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
            var cells = new HashSet<Cell>(allCells);
            var occupied = cells.WhereOccupied().ToHashSet();
            if (currentCell.Tiles.Count == 1) occupied.Remove(currentCell);

            return occupied.Count == 1
                ? occupied.Union(occupied.First().SelectNeighbors(allCells)).ToCoords()
                : occupied.SelectMany(c => c.SelectNeighbors(allCells)).ToCoords();
        }
    }
}