using System.Collections.Generic;

namespace Hive.Domain.Entities;

public sealed record Cell(Coords Coords)
{
    private readonly int _hashCode = Coords.GetHashCode();
    public Stack<Tile> Tiles { get; init; } = new();

    public bool Equals(Cell? other)
    {
        if (ReferenceEquals(other, null)) return false;
        return ReferenceEquals(this, other) || Coords.Equals(other.Coords);
    }

    public Cell AddTile(Tile tile)
    {
        Tiles.Push(tile);
        return this;
    }

    public bool IsEmpty()
    {
        return Tiles.Count == 0;
    }

    public Tile TopTile()
    {
        return Tiles.Peek();
    }

    public Tile RemoveTopTile()
    {
        return Tiles.Pop();
    }

    public override int GetHashCode()
    {
        return _hashCode;
    }
}
