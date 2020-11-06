using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Rules
{
    public class ThreeSpaces : IRule
    {
        public ISet<Coords> ApplyRule(Cell originCell, ISet<Cell> allCells) =>
            new Path(originCell)
                .Extend(allCells)
                .SelectMany(p => p.Extend(allCells))
                .SelectMany(p => p.Extend(allCells))
                .Select(p => p.Last)
                .ToCoords();

        private sealed record Path(Cell Last)
        {
            ImmutableHashSet<Cell> Cells { get; init; } = ImmutableHashSet.Create(Last);

            private Path Add(Cell cell) => this with { Cells = Cells.Add(cell), Last = cell };

            internal IEnumerable<Path> Extend(IEnumerable<Cell> allCells) =>
                allCells
                .SelectEmptyNeighbors(Last)
                .Except(Cells)
                .Select(Add);
        }
    }
}
