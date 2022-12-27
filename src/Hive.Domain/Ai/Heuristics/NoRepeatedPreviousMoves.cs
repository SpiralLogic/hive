using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Ai.Heuristics;

internal class NoRepeatedPreviousMoves : IHeuristic
{
    private readonly IEnumerable<HistoricalMove> _previousMoves;

    internal NoRepeatedPreviousMoves(IEnumerable<HistoricalMove> previousMoves)
    {
        _previousMoves = previousMoves;
    }

    public int Get(HeuristicValues values, Move move)
    {
        return _previousMoves.Where(m => m.Move.Tile.PlayerId == move.Tile.PlayerId)
            .SkipLast(1)
            .TakeLast(3)
            .Any(m => m.OriginalCoords == values.MoveFromLocation?.Coords && m.Move == move)
            ? -4
            : 0;
    }
}