using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements
{
    public class CanSlideTo : IMovement
    {
        public ISet<Coords> GetMoves(Cell originCell, ISet<Cell> allCells)
        {
            var availableCells = new HashSet<Cell>();
            GetSlidableNeighbors(originCell, availableCells, allCells);
            return availableCells.ToCoords();
        }

        private static void GetSlidableNeighbors(Cell currentCell, ISet<Cell> availableCells, ISet<Cell> allCells)
        {
            var neighbors = currentCell.SelectNeighbors(allCells).ToHashSet();

            var unvisitedAdjacentSlidable = neighbors.WhereEmpty()
                .Where(end => end.SelectNeighbors(allCells).Intersect(neighbors).WhereOccupied().Count() != 2)
                .Except(availableCells)
                .ToHashSet();

            availableCells.UnionWith(unvisitedAdjacentSlidable);
            foreach (var cell in unvisitedAdjacentSlidable) GetSlidableNeighbors(cell, availableCells, allCells);
        }
    }
}
