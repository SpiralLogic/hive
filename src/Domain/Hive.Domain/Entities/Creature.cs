using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Extensions;
using Hive.Domain.Rules;

namespace Hive.Domain.Entities
{
    public sealed record Creature(string Name)
    {
        internal IEnumerable<IRule> Rules { get; init; } = new List<IRule>();

        public ISet<Coords> GetAvailableMoves(Cell originCell, ISet<Cell> cells)
            => Rules.Aggregate(
                    cells
                        .RemoveCell(originCell)
                        .SelectCoords(),
                    (moves, rule) => moves.Intersect(rule.ApplyRule(originCell, cells))
                    ).ToHashSet();
    }
}
