using System.Linq;
using System.Collections.Generic;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Rules
{
    public class SlideOnly : IRule
    {
        private readonly ISet<Cell> checkd = new HashSet<Cell>();

        public ISet<Coords> ApplyRule(Cell originCell, ISet<Cell> allCells)
        {
            checkd.Clear();
            return GetSlidableNeighbors(originCell, allCells).ToCoords();
        }

        private IEnumerable<Cell> GetSlidableNeighbors(Cell start, ISet<Cell> allCells)
        {
            checkd.Add(start);
            var neighbors = allCells.SelectNeighbors(start);
            var newSlideTo = neighbors.WhereEmpty().Where(end => CanSlideTo(end, neighbors, allCells));

            return newSlideTo.Union(newSlideTo.Except(checkd).SelectMany(c => GetSlidableNeighbors(c, allCells)));
        }

        private bool CanSlideTo(Cell end, IEnumerable<Cell> neighbors, ISet<Cell> allCells)
        {
            return allCells.SelectNeighbors(end).Intersect(neighbors).WhereOccupied().Count() != 2;
        }
    }
}
