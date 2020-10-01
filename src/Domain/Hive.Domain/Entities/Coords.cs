using System;
using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public record Coords(int Q, int R)
    {
        internal ISet<Coords> GetNeighbors()
        {
            var r = new HashSet<Coords>
            {
                new Coords(Q - 1, R),
                new Coords(Q + 1, R),
            };

            if (R % 2 != 0)
            {
                r.Add(new Coords(Q, R - 1));
                r.Add(new Coords(Q + 1, R - 1));

                r.Add(new Coords(Q, R + 1));
                r.Add(new Coords(Q + 1, R + 1));
            }

            if (R % 2 == 0)
            {
                r.Add(new Coords(Q, R - 1));
                r.Add(new Coords(Q - 1, R - 1));

                r.Add(new Coords(Q, R + 1));
                r.Add(new Coords(Q - 1, R + 1));
            }

            return r;
        }

    }
}