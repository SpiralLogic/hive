using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements
{
    public class WontSplitHive : IMovements
    {
        public ISet<Coords> GetMoves(Cell currentCell, ISet<Cell> allCells)
        {
            if (currentCell.Tiles.Count > 1) return allCells.ToCoords();

            var allOccupiedNonNeighbors = new HashSet<Cell>(allCells.WhereOccupied());
            allOccupiedNonNeighbors.Remove(currentCell);
            if (allOccupiedNonNeighbors.Count == 0) return allCells.ToCoords();

            if (allOccupiedNonNeighbors.Count == 1)
                return allOccupiedNonNeighbors.Union(allCells.SelectNeighbors(allOccupiedNonNeighbors.First()))
                    .ToCoords();

            CheckIsInHive(allOccupiedNonNeighbors, allOccupiedNonNeighbors.First());

            return !allOccupiedNonNeighbors.Any()
                ? allCells.RemoveCell(currentCell)
                    .ToCoords()
                : new HashSet<Coords>();
        }

        private static void CheckIsInHive(ISet<Cell> allOccupiedNonNeighbors, Cell toCheck)
        {
            allOccupiedNonNeighbors.Remove(toCheck);
            toCheck.SelectNeighbors(allOccupiedNonNeighbors)
                .ToList()
                .ForEach(c => CheckIsInHive(allOccupiedNonNeighbors, c));
        }
    }
}
