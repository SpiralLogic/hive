using System;
using System.Collections.Generic;
using System.Linq;

namespace Hive.Domain.Entities
{
        public sealed record Cell(Coords Coords): IEquatable<Cell>
    {
        public Stack<Tile> Tiles { get; init; } = new Stack<Tile>();

        public Cell AddTile(Tile tile)
        {
            Tiles.Push(tile);
            return this;
        }

        public bool IsEmpty() => !Tiles.Any();

        public Tile TopTile() => Tiles.Peek();

        public Tile RemoveTopTile() => Tiles.Pop();

        public bool Equals(Cell? other) => ReferenceEquals(this, other) || Coords.Equals(other?.Coords);

        public override int GetHashCode() => Coords.GetHashCode();
    }
}