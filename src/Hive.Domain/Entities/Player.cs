using System.Collections.Immutable;

namespace Hive.Domain.Entities;

public sealed record Player(int Id, string Name)
{
    public ImmutableHashSet<Tile> Tiles { get; init; } = ImmutableHashSet<Tile>.Empty;

    public bool Equals(Player? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return Id == other.Id;
    }

    internal Player RemoveTile(Tile tile)
    {
        return this with { Tiles = Tiles.Remove(tile) };
    }

    internal Player AddTile(Tile tile)
    {
        return this with { Tiles = Tiles.Add(tile) };
    }

    public override int GetHashCode()
    {
        return Id;
    }
}
