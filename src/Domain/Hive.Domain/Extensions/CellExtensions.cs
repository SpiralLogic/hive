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

        internal static bool PlayerOccupies(this Cell cell, Player player)
        {
            return cell.PlayerOccupies(player.Id);
        }

        internal static bool PlayerOccupies(this Cell cell, int playerId)
        {
            return cell.Tiles.Any(t => t.PlayerId == playerId);
        }

        internal static IEnumerable<Cell> SelectNeighbors(this Cell cell, IEnumerable<Cell> fromCells)
        {
            return fromCells.SelectNeighbors(cell);
        }

        internal static bool HasQueen(this Cell? cell)
        {
            return cell?.Tiles.Any(t => t.IsQueen()) ?? false;
        }
    }
}
