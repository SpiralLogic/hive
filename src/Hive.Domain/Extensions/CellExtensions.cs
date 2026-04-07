using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Extensions;

internal static class CellExtensions
{
    extension(Cell cell)
    {
        internal bool PlayerControls(Player player)
        {
            return cell.PlayerControls(player.Id);
        }

        private bool PlayerControls(int playerId)
        {
            return cell.Tiles.First().PlayerId == playerId;
        }

        internal bool PlayerOccupies(int playerId)
        {
            return cell.Tiles.Any(t => t.PlayerId == playerId);
        }

        internal IEnumerable<Cell> SelectNeighbors(IEnumerable<Cell> cells)
        {
            return cells.SelectNeighbors(cell);
        }

        internal bool HasQueen()
        {
            return cell.Tiles.Any(t => t.IsQueen());
        }

        internal bool HasPlayerQueen(int playerId)
        {
            return cell.Tiles.Any(t => t.IsQueen() && t.PlayerId == playerId);
        }

        internal IEnumerable<Cell> QueenNeighbours(IEnumerable<Cell> cells)
        {
            return cells.SelectOccupiedNeighbors(cell).Where(c => c.HasQueen());
        }
    }
}