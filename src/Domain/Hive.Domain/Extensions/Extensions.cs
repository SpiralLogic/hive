using System.Collections.Generic;
using Hive.Domain.Entities;
using System.Linq;

namespace Hive.Domain.Extensions
{
    internal static class Extensions
    {
        internal static Player FindPlayerById(this IEnumerable<Player> players, int playerId)
        {

            return players.Single(p => p.Id == playerId);
        }


        internal static Cell FindCell(this IEnumerable<Cell> cells, Coords coords)
        {
            return cells.Single(c => c.Coords.Equals(coords));
        }

        internal static ISet<Cell> GetEmptyNeighbours(this IEnumerable<Cell> cells)
        {
            return cells
                .WhereOccupied()
                .SelectCoords()
                .SelectMany(coords => coords.GetNeighbors())
                .SelectCells()
                .WhereEmpty()
                .ToHashSet();
        }

        internal static IEnumerable<Cell> WhereEmpty(this IEnumerable<Cell> cells) => cells.Where(c => c.IsEmpty());
        internal static IEnumerable<Cell> WhereOccupied(this IEnumerable<Cell> cells) => cells.Where(c => !c.IsEmpty());
        internal static IEnumerable<Cell> WherePlayerOccupies(this IEnumerable<Cell> cells, Player player) => cells.WhereOccupied().Where(c => c.TopTile().PlayerId == player.Id);
        internal static IEnumerable<Coords> SelectCoords(this IEnumerable<Cell> cells) => cells.Select(c => c.Coords);
        internal static IEnumerable<Cell> SelectCells(this IEnumerable<Coords> coords) => coords.Select(c => new Cell(c));
        internal static ISet<Cell> ToCells(this IEnumerable<Coords> coords) => coords.SelectCells().ToHashSet();
        internal static ISet<Coords> ToCoords(this IEnumerable<Cell> cells) => cells.SelectCoords().ToHashSet();
    }
}