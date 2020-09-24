using System.Collections.Generic;
using Hive.Domain.Entities;
using System.Linq;

namespace Hive.Domain.Extensions
{
    static class Extensions
    {
        public static Tile FindTileById(this IEnumerable<Player> players, int tileId)
        {
            return players.SelectMany(p => p.Tiles).First(t => t.Id == tileId);
        }

        public static Player FindPlayerById(this IEnumerable<Player> players, int playerId)
        {
            return players.Single(p => p.Id == playerId);
        }

        public static bool RemoveUnplacedTile(this IEnumerable<Player> players, Tile tile)
        {
            return players.Select(p => p.Tiles.Remove(tile)).Any();
        }

        public static Cell FindCell(this IEnumerable<Cell> cells, Coords coords)
        {
            return cells.Single(c => c.Coords.Equals(coords));
        }

        public static IEnumerable<Coords> GetNeighbors(this Coords coords)
        {
            var r = new List<Coords>
            {
                new Coords(coords.Q - 1, coords.R),
                new Coords(coords.Q + 1, coords.R),
            };

            if (coords.R % 2 != 0)
            {
                r.Add(new Coords(coords.Q, coords.R - 1));
                r.Add(new Coords(coords.Q + 1, coords.R - 1));

                r.Add(new Coords(coords.Q, coords.R + 1));
                r.Add(new Coords(coords.Q + 1, coords.R + 1));
            }

            if (coords.R % 2 == 0)
            {
                r.Add(new Coords(coords.Q, coords.R - 1));
                r.Add(new Coords(coords.Q - 1, coords.R - 1));

                r.Add(new Coords(coords.Q, coords.R + 1));
                r.Add(new Coords(coords.Q - 1, coords.R + 1));
            }

            return r;
        }

        public static ISet<Cell> CreateNewEmptyNeighbors(this IEnumerable<Cell> cells)
        {
            return cells
                .Select(cell => cell.Coords)
                .SelectMany(coords => coords.GetNeighbors())
                .Distinct()
                .Select(coords => new Cell(coords)).ToHashSet();
        }
    }
}