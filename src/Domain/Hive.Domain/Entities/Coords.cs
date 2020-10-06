using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public sealed record Coords(int Q, int R)
    {
        internal ISet<Coords> GetNeighbors() =>
            new HashSet<Coords>
            {
                TopLeft,
                TopRight,
                Left,
                Right,
                BottomLeft,
                BottomRight,
            };

        internal Coords TopLeft => R % 2 == 0 ? new Coords(Q - 1, R - 1) : new Coords(Q, R - 1);

        internal Coords BottomLeft => R % 2 == 0 ? new Coords(Q - 1, R + 1) : new Coords(Q, R + 1);

        internal Coords TopRight => R % 2 == 0 ? new Coords(Q, R - 1) : new Coords(Q + 1, R - 1);

        internal Coords BottomRight => R % 2 == 0 ? new Coords(Q, R + 1) : new Coords(Q + 1, R + 1);

        internal Coords Right => new Coords(Q + 1, R);

        internal Coords Left => new Coords(Q - 1, R);
    }
}