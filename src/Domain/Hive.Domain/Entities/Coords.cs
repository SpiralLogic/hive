using System;
using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public sealed record Coords(int Q, int R)
    {

        internal Coords TopLeft => R % 2 == 0 ? this with {Q = Q - 1, R = R - 1} : this with {R = R - 1};

        internal Coords BottomLeft => R % 2 == 0 ? this with {Q = Q - 1, R = R + 1} : this with {R = R + 1};

        internal Coords TopRight => R % 2 == 0 ? this with {R = R - 1} : this with {Q = Q + 1, R = R - 1};

        internal Coords BottomRight => R % 2 == 0 ? this with {R = R + 1} : this with {Q = Q + 1, R = R + 1};

        internal Coords Right => this with {Q = Q + 1};

        internal Coords Left => this with {Q = Q - 1};

        public bool Equals(Coords? other)
        {
            if (ReferenceEquals(null, other)) return false;
            if (ReferenceEquals(this, other)) return true;
            return Q == other.Q && R == other.R;
        }

        public override int GetHashCode() =>
            HashCode.Combine(Q, R);

        internal ISet<Coords> GetNeighbors() =>
            new HashSet<Coords>
            {
                TopLeft,
                TopRight,
                Left,
                Right,
                BottomLeft,
                BottomRight
            };
    }
}
