using System.Collections.Generic;
using Hive.Domain.Entities;
using System.Linq;

namespace Hive.Domain.Extensions
{
   public static class Extensions
    {
        public static Tile FindTileById(this IEnumerable<Player> players, int tileId)
        {
            return players.SelectMany(p => p.Tiles).First(t => t.Id == tileId);
        }

        public static Player FindPlayerById(this IEnumerable<Player> players, int playerId)
        {
            return players.Single(p => p.Id == playerId);
        }

        public static void RemoveUnplacedTile(this IEnumerable<Player> players, Tile tile)
        {
            players.Single(p=>p.Tiles.Contains(tile)).Tiles.Remove(tile);
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
                .Where(c => !c.IsEmpty())
                .Select(cell => cell.Coords)
                .SelectMany(coords => coords.GetNeighbors())
                .Select(coords => new Cell(coords)).ToHashSet();
        }
    }
}