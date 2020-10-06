using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public sealed record Tile(int Id, int PlayerId, Creature Creature)
    {
        public ISet<Coords> Moves { get; init; } = new HashSet<Coords>();
    }
}