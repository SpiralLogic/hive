using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements
{
    public class CanSlideTo : IMovements
    {

        public ISet<Coords> GetMoves(Cell originCell, ISet<Cell> allCells)
        {
            var moves = new HashSet<Cell>();
            GetSlidableNeighbors(originCell, moves, allCells);
            return moves.ToCoords();
        }

        private static void GetSlidableNeighbors(Cell move, ISet<Cell> moves, ISet<Cell> allCells)
        {
            var neighbors = move.SelectNeighbors(allCells)
                .ToHashSet();

            var unvisitedAdjacentSlidable = neighbors.WhereEmpty()
                .Where(end => end.SelectNeighbors(allCells)
                    .Intersect(neighbors)
                    .WhereOccupied()
                    .Count() != 2)
                .Except(moves)
                .ToHashSet();

            moves.UnionWith(unvisitedAdjacentSlidable);
            foreach (var cell in unvisitedAdjacentSlidable) GetSlidableNeighbors(cell, moves, allCells);
        }
    }
}
