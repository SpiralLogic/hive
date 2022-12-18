using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Ai.Heuristics;

internal class BeetlePlacement : IHeuristic
{
    private readonly IEnumerable<HistoricalMove> _previousMoves;

    internal BeetlePlacement(IEnumerable<HistoricalMove> previousMoves)
    {
        _previousMoves = previousMoves;
    }

    public int Get(HeuristicValues values, Move move)
    {
        if (move.Tile.Creature != Creatures.Beetle) return 0;
        if (_previousMoves.Last().OriginalCoords == null && values.TilesPlaced < 2) return 1;
        return -2;
    }
}
