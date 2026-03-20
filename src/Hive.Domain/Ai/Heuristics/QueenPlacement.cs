using Hive.Domain.Entities;

namespace Hive.Domain.Ai.Heuristics;

/// <summary>
/// When placing the Queen, prefer cells with more occupied neighbors so it is harder to surround.
/// In Hive, the Queen is lost when surrounded by 6 pieces; fewer empty slots = safer.
/// </summary>
internal class QueenPlacement : IHeuristic
{
    public int Get(HeuristicValues values, Move move)
    {
        if (move.Tile.Creature != Creatures.Queen) return 0;
        if (values.MoveFromLocation != null) return 0;

        var occupiedNeighbours = values.MoveNeighbours.Count;
        var score = occupiedNeighbours * 8;
        if (values.TilesPlaced >= 3) score += 12;
        return score;
    }
}
