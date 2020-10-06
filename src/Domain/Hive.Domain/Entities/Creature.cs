using System.Linq;
using System.Collections.Generic;
using Hive.Domain.Rules;
using Hive.Domain.Extensions;

namespace Hive.Domain.Entities
{
    public sealed record Creature(string Name)
    {
        internal IEnumerable<IRule> Rules { get; init; } = new List<IRule>();

        public ISet<Coords> GetAvailableMoves(Cell originCell, ISet<Cell> cells) =>
            Rules.Aggregate(cells.SelectCoords(), (moves, rule) => moves.Intersect(rule.ApplyRule(originCell, cells)))
                .ToHashSet();
    }
}