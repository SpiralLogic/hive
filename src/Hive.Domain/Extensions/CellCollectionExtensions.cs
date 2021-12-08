using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Extensions
{
    public static class CellCollectionExtensions
    {

        internal static Cell FindCell(this IEnumerable<Cell> cells, Coords coords)
        {
            return cells.First(c => c.Coords.Equals(coords));
        }

        internal static Cell? FindCellOrDefault(this IEnumerable<Cell> cells, Coords coords)
        {
            return cells.FirstOrDefault(c => c.Coords.Equals(coords));
        }

        internal static Cell? FindCellOrDefault(this IEnumerable<Cell> cells, Tile tile)
        {
            return cells.WhereOccupied().FirstOrDefault(c => c.Tiles.Any(t => t.Id == tile.Id));
        }

        internal static Cell? FindCellOrDefault(this IEnumerable<Cell> cells, int tileId)
        {
            return cells.WhereOccupied().FirstOrDefault(c => c.Tiles.Any(t => t.Id == tileId));
        }

        internal static ISet<Cell> CreateAllEmptyNeighbours(this IEnumerable<Cell> cells)
        {
            var enumerable = cells as Cell[] ?? cells.ToArray();
            return enumerable.SelectCoords()
                .SelectMany(coords => coords.Neighbours())
                .SelectCells()
                .Except(enumerable.WhereOccupied())
                .ToHashSet();
        }


        internal static IEnumerable<Cell> SelectOccupiedNeighbors(this IEnumerable<Cell> cells, Cell originCell)
        {
            return cells.SelectNeighbors(originCell).WhereOccupied();
        }

        public static IEnumerable<Cell> SelectNeighbors(this IEnumerable<Cell> cells, Cell originCell)
        {
            return cells.Intersect(originCell.Coords.Neighbours().ToCells());
        }

        internal static IEnumerable<Cell> WhereEmpty(this IEnumerable<Cell> cells)
        {
            return cells.Where(c => c.IsEmpty());
        }

        internal static IEnumerable<Cell> WhereOccupied(this IEnumerable<Cell> cells)
        {
            return cells.Where(c => !c.IsEmpty());
        }

        internal static IEnumerable<Cell> WherePlayerOccupies(this IEnumerable<Cell> cells, int playerId)
        {
            return cells.WhereOccupied().Where(c => c.PlayerOccupies(playerId));
        }

        internal static ISet<Coords> ToCoords(this IEnumerable<Cell> cells)
        {
            return cells.SelectCoords().ToHashSet();
        }

        internal static IEnumerable<Cell> WherePlayerControls(this IEnumerable<Cell> cells, Player player)
        {
            return cells.WhereOccupied().Where(c => c.PlayerControls(player));
        }

        internal static IEnumerable<Coords> SelectCoords(this IEnumerable<Cell> cells)
        {
            return cells.Select(c => c.Coords);
        }
    }
}
