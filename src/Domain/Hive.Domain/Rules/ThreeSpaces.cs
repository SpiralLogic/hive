using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Rules
{
    public class ThreeSpaces : IRule
    {
        public ISet<Coords> ApplyRule(Cell originCell, ISet<Cell> allCells)
        {
            var paths = new Path(originCell)
                .Extend(allCells)
                .SelectMany(p => p.Extend(allCells))
                .SelectMany(p => p.Extend(allCells))
                .Select(p => p.Last)
                .ToCoords();

            return paths;
        }

        record Path
        {
            ImmutableHashSet<Cell> Cells { get; init; }
            public Cell Last { get; init; }
            internal Path(Cell originCell)
            {
                Cells = ImmutableHashSet.Create(originCell);
                Last = originCell;
            }

            internal Path Add(Cell cell)
            {
                return this with { Cells = Cells.Add(cell), Last= cell };
            }

            internal IEnumerable<Path> Extend(IEnumerable<Cell> allCells)
            {
                return allCells.SelectEmptyNeighbors(Last).WhereEmpty().Except(Cells).Select(c => Add(c));
            }
        }
    }
}
