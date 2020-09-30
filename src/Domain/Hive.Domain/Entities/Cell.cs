using System;
using System.Collections.Generic;
using System.Linq;

namespace Hive.Domain.Entities
{
    public class Cell : IEquatable<Cell>
    {
        public Coords Coords { get; init; }
        public Stack<Tile> Tiles { get; init; } = new Stack<Tile>();
     
        public Cell(Coords coords)
        {
            Coords = coords;
        }

        public Cell AddTile(Tile tile)
        {
            Tiles.Push(tile);
            return this;
        }

        public bool IsEmpty() => !Tiles.Any();

        public Tile TopTile() => Tiles.Peek();

        public Tile RemoveTopTile() => Tiles.Pop();

        public bool Equals(Cell? other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;
            return Coords.Equals(other.Coords);
        }

        public override bool Equals(object? obj)
        {
            if (obj is null) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != GetType()) return false;
            return Equals((Cell)obj);
        }

        public override int GetHashCode()
        {
            return Coords.GetHashCode();
        }
    }
}