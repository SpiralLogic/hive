using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Ai.Heuristics;

internal class BeetlePlacement : IHeuristic
{
    private readonly Stack<InProgressMove> _previousMoves;

    internal BeetlePlacement(Stack<InProgressMove> previousMoves)
    {
        _previousMoves = previousMoves;
    }

    public int Get(HeuristicValues values, Move move)
    {

        var ((_, _, creature), _) = move;
        if (creature != Creatures.Beetle) return 0;
        if (_previousMoves.Peek().Coords == null && values.TilesPlaced < 2) return 1;
        return -2;
    }
}
