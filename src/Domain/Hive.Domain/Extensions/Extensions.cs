using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

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

        internal static ISet<Cell> CreateAllEmptyNeighbours(this IEnumerable<Cell> cells)
        {
            var enumerable = cells as Cell[] ?? cells.ToArray();
            return enumerable.SelectCoords()
                .SelectMany(coords => coords.GetNeighbors())
                .SelectCells()
                .Except(enumerable.WhereOccupied())
                .ToHashSet();
        }

        internal static IEnumerable<Cell> SelectNeighbors(this Cell cell, IEnumerable<Cell> fromCells) =>
            fromCells.SelectNeighbors(cell);

        internal static IEnumerable<Cell> RemoveCell(this IEnumerable<Cell> cells, Cell cell)
        {
            return cells.Except(new[] {cell});
        }

        internal static IEnumerable<Cell> SelectEmptyNeighbors(this IEnumerable<Cell> cells, Cell originCell) =>
            cells.SelectNeighbors(originCell).WhereEmpty();

        internal static IEnumerable<Cell> SelectNeighbors(this IEnumerable<Cell> cells, Cell originCell) =>
            cells.Intersect(originCell.Coords.GetNeighbors().ToCells());

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
            return cells.WhereOccupied().Where(c => c.Tiles.Any(t => t.PlayerId == playerId));
        }

        internal static ISet<Coords> ToCoords(this IEnumerable<Cell> cells) =>
            cells.SelectCoords().ToHashSet();

        internal static IEnumerable<Cell> WherePlayerControls(this IEnumerable<Cell> cells, int playerId)
        {
            return cells.WhereOccupied().Where(c => c.Tiles.First().PlayerId == playerId);
        }

        internal static ISet<Cell> ToCells(this IEnumerable<Coords> coords) =>
            coords.SelectCells().ToHashSet();

        internal static IEnumerable<Coords> SelectCoords(this IEnumerable<Cell> cells)
        {
            return cells.Select(c => c.Coords);
        }

        internal static bool HasQueen(this Cell cell)
        {
            return cell.Tiles.Any(t => t.IsQueen());
        }

        internal static bool IsQueen(this Tile tile) =>
            tile.Creature.Equals(Creatures.Queen);

        private static IEnumerable<Cell> SelectCells(this IEnumerable<Coords> coords)
        {
            return coords.Select(c => new Cell(c));
        }
    }
}
