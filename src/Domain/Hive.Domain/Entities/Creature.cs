using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Extensions;
using Hive.Domain.Movements;

namespace Hive.Domain.Entities
{
    public sealed record Creature(string Name)
    {
        internal IEnumerable<IMovements> Movements { get; init; } = new List<IMovements>();

        public ISet<Coords> GetAvailableMoves(Cell originCell, ISet<Cell> cells)
            => Movements.Aggregate(
                    cells
                        .RemoveCell(originCell)
                        .SelectCoords(),
                    (moves, rule) => moves.Intersect(rule.GetMoves(originCell, cells))
                    ).ToHashSet();
    }
}
