using System.Collections.Generic;
using System.Linq;

namespace Hive.Domain.Entities
{
    public sealed record Cell(Coords Coords)
    {
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

        public bool IsEmpty() =>
            !Tiles.Any();

        public Tile TopTile() =>
            Tiles.Peek();

        public Tile RemoveTopTile() =>
            Tiles.Pop();

        public override int GetHashCode() =>
            Coords.GetHashCode();
    }
}
