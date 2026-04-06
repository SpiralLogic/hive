using System.Collections.Immutable;

namespace Hive.Domain.Entities;

public sealed record Tile(int Id, int PlayerId, Creature Creature)
{
    public ImmutableHashSet<Coords> Moves { get; init; } = ImmutableHashSet<Coords>.Empty;

    public bool Equals(Tile? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return Id == other.Id && PlayerId == other.PlayerId && Creature.Equals(other.Creature);
    }

    public override int GetHashCode()
    {
        return Id;
    }
}
