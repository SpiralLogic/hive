using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements
{
    public class WontSplitHive : IMovement
    {
        public ISet<Coords> GetMoves(Cell currentCell, ISet<Cell> allCells)
        {
            allCells.Remove(currentCell);
            if (currentCell.Tiles.Count > 1)
                return allCells.ToCoords();

            var allOccupied = allCells.WhereOccupied().ToHashSet();
            if (allOccupied.Count == 0)
                return allCells.ToCoords();

            if (allOccupied.Count == 1)
                return allOccupied.Union(allOccupied.First().SelectNeighbors(allCells)).ToCoords();

            CheckIsInHive(allOccupied, allOccupied.First());

            return allOccupied.Any() ? new HashSet<Coords>() : allCells.ToCoords();
        }

        private static void CheckIsInHive(ISet<Cell> remaining, Cell toCheck)
        {
            remaining.Remove(toCheck);
            var neighbours = toCheck.SelectNeighbors(remaining).ToHashSet();
            if (!neighbours.Any()) return;
            foreach (var n in neighbours)
                CheckIsInHive(remaining, n);
        }
    }
}
