using System.Linq;
using System.Collections.Generic;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Rules
{
    public class MustSlide : IRule
    {
        private readonly ISet<Cell> allEmptyCells = new HashSet<Cell>();
        private readonly ISet<Cell> checkd = new HashSet<Cell>();

        public ISet<Coords> ApplyRule(Cell originCell, ISet<Cell> allCells)
        {
            allEmptyCells.UnionWith(allCells.WhereEmpty());
            return GetSlidableNeighbors(originCell).ToCoords();
        }

        private IEnumerable<Cell> GetSlidableNeighbors(Cell start)
        {
            checkd.Add(start);
            var neighbors = allEmptyCells.SelectEmptyNeighbors(start);
            var newSlideTo = neighbors.Where(n => CanSlideTo(n, neighbors));

            return newSlideTo.Union(newSlideTo.Except(checkd).SelectMany(GetSlidableNeighbors));
        }
        
        private static bool CanSlideTo(Cell end, IEnumerable<Cell> emptyNeighbors)
        {
            return emptyNeighbors.SelectEmptyNeighbors(end).Intersect(emptyNeighbors).Any();
        }
    }
}
