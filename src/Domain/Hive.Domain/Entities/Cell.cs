using System;
using System.Collections.Generic;
using System.Linq;

namespace Hive.Domain.Entities
{
    public class Cell : IEquatable<Cell>
    {
        public Cell(Coords coords)
        {
            Coords = coords;
        }

        public Coords Coords { get; init; }
        public ISet<Tile> Tiles { get; init; } = new HashSet<Tile>();

        public void AddTile(Tile tile)
        {
            Tiles.Add(tile);
        }

        public bool IsEmpty() => !Tiles.Any();


        public bool Equals(Cell other)
        {
            if (ReferenceEquals(null, other)) return false;
            if (ReferenceEquals(this, other)) return true;
            return Coords.Equals(other.Coords);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((Cell) obj);
        }

        public override int GetHashCode()
        {
            return Coords.GetHashCode();
        }
    }
}