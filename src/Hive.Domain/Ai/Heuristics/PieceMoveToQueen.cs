using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics;

/// <summary>
/// Rewards moving Ant, Spider, or Grasshopper next to the opponent's Queen (surrounding threat).
/// Beetle has its own BeetleMoveOn heuristic with stronger weight.
/// </summary>
internal class PieceMoveToQueen : IHeuristic
{
    public int Get(HeuristicValues values, Move move)
    {
        if (move.Tile.IsCreature(Creatures.Beetle)) return 0;

        if (move.Tile.IsCreature(Creatures.Ant) || move.Tile.IsCreature(Creatures.Spider) ||
            move.Tile.IsCreature(Creatures.Grasshopper))
        {
            if (values.MoveToLocation.HasPlayerQueen(values.OpponentId) == false) return 0;
            if (values.OpponentQueenNeighbours >= 5) return 0;
            return 20;
        }

        return 0;
    }
}
