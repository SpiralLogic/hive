using System.Collections.Generic;
using Hive.Domain.Entities;
using System.Linq;

namespace Hive.Domain.Extensions
{
    public static class Extensions
    {
        public static Player FindPlayerById(this IEnumerable<Player> players, int playerId)
        {
            return players.Single(p => p.Id == playerId);
        }


        public static Cell FindCell(this IEnumerable<Cell> cells, Coords coords)
        {
            return cells.Single(c => c.Coords.Equals(coords));
        }

        public static ISet<Coords> GetNeighbors(this Coords coords)
        {
            var r = new HashSet<Coords>
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

        public static ISet<Cell> GetEmptyNeighbours(this IEnumerable<Cell> cells)
        {
            return cells
                .WhereOccupied()
                .SelectCoords()
                .SelectMany(coords => coords.GetNeighbors())
                .SelectCells()
                .WhereEmpty()
                .ToHashSet();
        }

        public static IEnumerable<Cell> WhereEmpty(this IEnumerable<Cell> cells) => cells.Where(c => c.IsEmpty());
        public static IEnumerable<Cell> WhereOccupied(this IEnumerable<Cell> cells) => cells.Where(c => !c.IsEmpty());
        public static IEnumerable<Cell> WherePlayerOccupies(this IEnumerable<Cell> cells, Player player) => cells.WhereOccupied().Where(c => c.TopTile().PlayerId == player.Id);
        public static IEnumerable<Coords> SelectCoords(this IEnumerable<Cell> cells) => cells.Select(c => c.Coords);
        public static IEnumerable<Cell> SelectCells(this IEnumerable<Coords> coords) => coords.Select(c => new Cell(c));
        public static ISet<Cell> ToCells(this IEnumerable<Coords> coords) => coords.SelectCells().ToHashSet();
        public static ISet<Coords> ToCoords(this IEnumerable<Cell> cells) => cells.SelectCoords().ToHashSet();
    }
}