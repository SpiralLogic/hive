using System.Collections.Immutable;

namespace Hive.Domain.Entities;

public sealed record Cell(Coords Coords)
{
    private readonly int _hashCode = Coords.GetHashCode();
    public ImmutableStack<Tile> Tiles { get; init; } = ImmutableStack<Tile>.Empty;

    public bool Equals(Cell? other)
    {
        if (ReferenceEquals(other, null)) return false;
        return ReferenceEquals(this, other) || Coords.Equals(other.Coords);
    }

    public Cell AddTile(Tile tile)
    {
        return this with { Tiles = Tiles.Push(tile) };
    }

    public bool IsEmpty()
    {
        return Tiles.IsEmpty;
    }

    public Tile TopTile()
    {
        return Tiles.Peek();
    }

    public (Tile Tile, Cell Cell) RemoveTopTile()
    {
        return (Tiles.Peek(), this with { Tiles = Tiles.Pop() });
    }

    public override int GetHashCode()
    {
        return _hashCode;
    }
}
