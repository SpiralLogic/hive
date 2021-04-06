using System;
using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public sealed record Coords(int Q, int R)
    {
        private readonly Lazy<Dictionary<Direction, Coords>> _neighbours = new(() => new Dictionary<Direction, Coords>
        {
            {Direction.TopLeft, R % 2 == 0 ? new Coords(Q - 1, R - 1) : new Coords(Q, R - 1)},
            {Direction.BottomLeft, R % 2 == 0 ? new Coords(Q - 1, R + 1) : new Coords(Q, R + 1)},
            {Direction.TopRight, R % 2 == 0 ? new Coords(Q, R - 1) : new Coords(Q + 1, R - 1)},
            {Direction.BottomRight, R % 2 == 0 ? new Coords(Q, R + 1) : new Coords(Q + 1, R + 1)},
            {Direction.Right, new Coords(Q + 1, R)},
            {Direction.Left, new Coords(Q - 1, R)}
        });

        public bool Equals(Coords? other)
        {
            if (ReferenceEquals(null, other)) return false;
            if (ReferenceEquals(this, other)) return true;
            return Q == other.Q && R == other.R;
        }

        public override int GetHashCode() =>
            HashCode.Combine(Q, R);

        internal Dictionary<Direction, Coords> GetNeighbors() =>
            _neighbours.Value;
    }
}
