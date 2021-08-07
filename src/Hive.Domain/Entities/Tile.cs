using System;
using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public sealed record Tile(int Id, int PlayerId, Creature Creature)
    {
        public ISet<Coords> Moves { get; init; } = new HashSet<Coords>();

        public bool Equals(Tile? other)
        {
            if (ReferenceEquals(null, other)) return false;
            if (ReferenceEquals(this, other)) return true;
            return Id == other.Id && PlayerId == other.PlayerId && Creature.Equals(other.Creature);
        }

        public override int GetHashCode()=> Id;
    }
}
