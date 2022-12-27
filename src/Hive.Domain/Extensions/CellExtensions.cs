using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Extensions;

internal static class CellExtensions
{
    internal static bool PlayerControls(this Cell cell, Player player)
    {
        return cell.PlayerControls(player.Id);
    }

    private static bool PlayerControls(this Cell cell, int playerId)
    {
        return cell.Tiles.First().PlayerId == playerId;
    }

    internal static bool PlayerOccupies(this Cell cell, int playerId)
    {
        return cell.Tiles.Any(t => t.PlayerId == playerId);
    }

    internal static IEnumerable<Cell> SelectNeighbors(this Cell cell, IEnumerable<Cell> cells)
    {
        return cells.SelectNeighbors(cell);
    }

    internal static bool HasQueen(this Cell cell)
    {
        return cell.Tiles.FirstOrDefault(t => t.IsQueen()) != null;
    }

    internal static bool HasPlayerQueen(this Cell cell, int playerId)
    {
        return cell.Tiles.FirstOrDefault(t => t.IsQueen() && t.PlayerId == playerId) != null;
    }

    internal static IEnumerable<Cell> QueenNeighbours(this Cell cell, IEnumerable<Cell> cells)
    {
        return cells.SelectOccupiedNeighbors(cell).Where(c => c.HasQueen());
    }
}