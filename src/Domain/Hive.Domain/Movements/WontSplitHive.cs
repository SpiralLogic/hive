﻿using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements
{
    public class WontSplitHive : IMovement
    {
        public ISet<Coords> GetMoves(Cell currentCell, ISet<Cell> allCells)
        {
            if (currentCell.Tiles.Count > 1) return allCells.ToCoords();

            var allOccupied = new HashSet<Cell>(allCells.WhereOccupied());
            allOccupied.Remove(currentCell);
            if (allOccupied.Count == 0)
                return allCells.ToCoords();

            if (allOccupied.Count == 1)
                return allOccupied.Union(allOccupied.First().SelectNeighbors(allCells)).ToCoords();

            CheckIsInHive(allOccupied, allOccupied.First());

            return allOccupied.Any() ? new HashSet<Coords>() : allCells.ToCoords();
        }

        private static void CheckIsInHive(ICollection<Cell> remaining, Cell toCheck)
        {
            remaining.Remove(toCheck);
            foreach (var cell in toCheck.SelectNeighbors(remaining))
                CheckIsInHive(remaining, cell);
        }
    }
}