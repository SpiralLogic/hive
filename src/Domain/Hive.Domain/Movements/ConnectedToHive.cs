using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements
{
    public class ConnectedToHive : IMovements
    {
        public ISet<Coords> GetMoves(Cell currentCell, ISet<Cell> allCells)
        {
            var cells = new HashSet<Cell>(allCells);
            cells.Remove(currentCell);
            var occupied = cells.WhereOccupied();
            return occupied.Count() == 1
                ? occupied.Union(occupied.First().SelectNeighbors(allCells)).ToCoords()
                : occupied.SelectMany(c=>c.SelectNeighbors(allCells)).ToCoords();

        }
    }
}
