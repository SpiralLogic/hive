using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics;

internal class MoveSpread : IHeuristic
{

    public int Get(HeuristicValues values, Move move)
    {
        var toOpponentQueen = values.MoveNeighbours.Exists(c => c.HasPlayerQueen(values.OpponentId));
        var fromOpponentQueen = values.MoveFromLocation != null && values.MoveFromNeighbours.Exists(c => c.HasPlayerQueen(values.OpponentId));
        if (fromOpponentQueen && toOpponentQueen) return -2 * values.MoveNeighbours.Count;
        if (toOpponentQueen && (values.OpponentQueenNeighbours < 4 || values.MoveNeighbours.Count < 3))
            return -2 * values.MoveNeighbours.Count;
        if (fromOpponentQueen) return -values.MoveNeighbours.Count;
        return values.MoveNeighbours.Count > 1 ? 2 : 0;
    }
}
