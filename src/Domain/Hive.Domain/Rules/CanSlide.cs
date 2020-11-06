using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Rules
{
    public class CanSlide : IRule
    {
        private readonly ISet<Cell> _checked = new HashSet<Cell>();

        public ISet<Coords> ApplyRule(Cell originCell, ISet<Cell> allCells)
        {
            _checked.Clear();
            return GetSlidableNeighbors(originCell, allCells).ToCoords();
        }

        private IEnumerable<Cell> GetSlidableNeighbors(Cell start, ISet<Cell> allCells)
        {
            _checked.Add(start);
            var neighbors = allCells.SelectNeighbors(start).ToHashSet();
            var newSlideTo = neighbors.WhereEmpty().Where(end => CanSlideTo(end, neighbors, allCells)).ToList();

            return newSlideTo.Union(newSlideTo.Except(_checked).SelectMany(c => GetSlidableNeighbors(c, allCells)));
        }

        private static bool CanSlideTo(Cell end, IEnumerable<Cell> neighbors, ISet<Cell> allCells) =>
            allCells.SelectNeighbors(end).Intersect(neighbors).WhereOccupied().Count() != 2;
    }
}
