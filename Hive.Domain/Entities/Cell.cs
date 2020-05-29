﻿using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public class Cell
    {
        protected bool Equals(Cell other)
        {
            return Equals(Coords, other.Coords);
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
            return (Coords != null ? Coords.GetHashCode() : 0);
        }

        public static bool operator ==(Cell left, Cell right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(Cell left, Cell right)
        {
            return !Equals(left, right);
        }

        public Cell(Coordinates coords, ICollection<Tile> tiles = null)
        {
            Coords = coords;
            Tiles = tiles ??  new List<Tile>();
        }

        public Coordinates Coords { get; }
        public ICollection<Tile> Tiles { get; }
    }
}
