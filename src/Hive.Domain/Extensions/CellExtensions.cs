using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Extensions
{
    internal static class CellExtensions
    {
        internal static bool PlayerControls(this Cell cell, Player player)
        {
            return cell.PlayerControls(player.Id);
        }

        internal static bool PlayerControls(this Cell cell, int playerId)
        {
            return cell.Tiles.First().PlayerId == playerId;
        }

        internal static bool PlayerOccupies(this Cell cell, int playerId)
        {
            return cell.Tiles.Any(t => t.PlayerId == playerId);
        }

        internal static IEnumerable<Cell> SelectNeighbors(this Cell cell, IEnumerable<Cell> fromCells)
        {
            return fromCells.SelectNeighbors(cell);
        }

        internal static bool HasQueen(this Cell? cell, int? playerId = null)
        {
            var queen = cell?.Tiles.FirstOrDefault(t => t.IsQueen());

            return playerId.HasValue && queen != null ? queen.PlayerId == playerId.Value : queen != null;
        }

        internal static IEnumerable<Cell> QueenNeighbours(this Cell cell, IEnumerable<Cell> cells, int? playerId = null)
        {
            return  cells.SelectOccupiedNeighbors(cell).Where(c => c.HasQueen(playerId));
        }
    }
}
