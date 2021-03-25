﻿using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Extensions
{
    internal static class CellCollectionExtensions
    {
        internal static Cell FindCell(this IEnumerable<Cell> cells, Coords coords)
        {
            return cells.Single(c => c.Coords.Equals(coords));
        }

        internal static Cell? FindCell(this IEnumerable<Cell> cells, Tile tile)
        {
            return cells.SingleOrDefault(c => c.Tiles.Any(t => t.Id == tile.Id));
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

        internal static IEnumerable<Cell> RemoveCell(this IEnumerable<Cell> cells, Cell cell)
        {
            return cells.Except(new[] {cell});
        }

        internal static IEnumerable<Cell> SelectEmptyNeighbors(this IEnumerable<Cell> cells, Cell originCell)
        {
            return cells.SelectNeighbors(originCell).WhereEmpty();
        }

        internal static IEnumerable<Cell> SelectNeighbors(this IEnumerable<Cell> cells, Cell originCell)
        {
            return cells.Intersect(originCell.Coords.GetNeighbors().ToCells());
        }

        internal static IEnumerable<Cell> WhereEmpty(this IEnumerable<Cell> cells)
        {
            return cells.Where(c => c.IsEmpty());
        }

        internal static IEnumerable<Cell> WhereOccupied(this IEnumerable<Cell> cells)
        {
            return cells.Where(c => !c.IsEmpty());
        }

        internal static IEnumerable<Cell> WherePlayerOccupies(this IEnumerable<Cell> cells, Player player)
        {
            return cells.WhereOccupied().Where(c => c.PlayerOccupies(player));
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