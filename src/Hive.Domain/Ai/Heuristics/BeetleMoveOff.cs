using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics;

internal class BeetleMoveOff : IHeuristic
{
    public int Get(HeuristicValues values, Move move)
    {
        if (values.MoveFromLocation == null) return 0;
        if (move.Tile.IsCreature(Creatures.Beetle) &&
            values.MoveFromLocation.HasPlayerQueen(values.OpponentId) &&
            values.OpponentQueenNeighbours < 4) return -60;
        return 0;
    }
}
