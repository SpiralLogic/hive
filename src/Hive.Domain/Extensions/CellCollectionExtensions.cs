using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Extensions;

internal static class CellCollectionExtensions
{

    extension(IEnumerable<Cell> cells)
    {
        internal Cell FindCell(Coords coords)
        {
            return cells.First(c => c.Coords.Equals(coords));
        }

        internal Cell? FindCellOrDefault(Coords coords)
        {
            return cells.FirstOrDefault(c => c.Coords.Equals(coords));
        }

        internal Cell? FindCellOrDefault(Tile tile)
        {
            return cells.WhereOccupied().FirstOrDefault(c => c.Tiles.Any(t => t.Id == tile.Id));
        }
    }

    internal static IEnumerable<Cell> CreateAllEmptyNeighbours(this ISet<Cell> cells)
    {
        var occupied = cells.WhereOccupied().ToCoords().ToHashSet();
        return cells.SelectMany(cell => cell.Coords.Neighbours()).Except(occupied).ToCells();
    }

    extension(IEnumerable<Cell> cells)
    {
        internal IEnumerable<Cell> SelectOccupiedNeighbors(Cell originCell)
        {
            return cells.SelectNeighbors(originCell).WhereOccupied();
        }

        internal IEnumerable<Cell> SelectNeighbors(Cell originCell)
        {
            return cells.Intersect(originCell.Coords.Neighbours().ToCells());
        }

        internal IEnumerable<Cell> WhereEmpty()
        {
            return cells.Where(c => c.IsEmpty());
        }

        internal IEnumerable<Cell> WhereOccupied()
        {
            return cells.Where(c => !c.IsEmpty());
        }

        internal IEnumerable<Cell> WherePlayerOccupies(int playerId)
        {
            return cells.WhereOccupied().Where(c => c.PlayerOccupies(playerId));
        }

        internal ISet<Coords> ToCoords()
        {
            return cells.Select(c => c.Coords).ToHashSet();
        }

        internal IEnumerable<Cell> WherePlayerControls(Player player)
        {
            return cells.WhereOccupied().Where(c => c.PlayerControls(player));
        }
    }
}