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

        if (!move.Tile.IsCreature(Creatures.Ant) &&
            !move.Tile.IsCreature(Creatures.Spider) &&
            !move.Tile.IsCreature(Creatures.Grasshopper)) return 0;
        if (!values.MoveToLocation.HasPlayerQueen(values.OpponentId)) return 0;
        return values.OpponentQueenNeighbours >= 5 ? 0 : 20;

    }
}
