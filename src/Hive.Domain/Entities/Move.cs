using System;

namespace Hive.Domain.Entities;

public sealed record Move(Tile Tile, Coords Coords)
{
    public bool Equals(Move? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return Tile.Id.Equals(other.Tile.Id) && Coords.Equals(other.Coords);
    }

    public override int GetHashCode() =>
        HashCode.Combine(Tile.Id, Coords);
}