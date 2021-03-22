using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Extensions;
using Hive.Domain.Movements;

namespace Hive.Domain.Entities
{
    public sealed record Creature(string Name)
    {
        public bool Equals(Creature? other)
        {
            if (ReferenceEquals(null, other)) return false;
            if (ReferenceEquals(this, other)) return true;
            return Name == other.Name;
        }

        public override int GetHashCode() =>
            Name.GetHashCode();

        internal IEnumerable<IMovement> Movements { get; init; } = new List<IMovement>();

        public ISet<Coords> GetAvailableMoves(Cell originCell, ISet<Cell> cells)
        {
            return Movements.Aggregate(cells.SelectCoords(), (moves, rule) => moves.Intersect(rule.GetMoves(originCell, cells)))
                .ToHashSet();
        }
    }
}
