﻿using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Movements
{
    public class IsAdjacent : IMovement
    {
        public ISet<Coords> GetMoves(Cell originCell, ISet<Cell> allCells)
        {
            return originCell.Coords.GetNeighbors();
        }
    }
}
