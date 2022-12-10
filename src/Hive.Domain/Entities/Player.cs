using System.Collections.Generic;

namespace Hive.Domain.Entities;

public sealed record Player(int Id, string Name)
{
    public ISet<Tile> Tiles { get; init; } = new HashSet<Tile>();

    public bool Equals(Player? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return Id == other.Id;
    }

    internal void RemoveTile(Tile tile)
    {
        Tiles.Remove(tile);
    }

    public override int GetHashCode()
    {
        return Id;
    }
}
