using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics
{
    internal class MoveSpread : IHeuristic
    {

        public int Get(HeuristicValues values, Move move)
        {
            var toOpponentQueen = values.MoveNeighbours.Any(c => c.HasQueen(values.OpponentId));
            var fromOpponentQueen = values.MoveFromLocation != null && values.MoveFromNeighbours.Any(c => c.HasQueen(values.OpponentId));
            if (fromOpponentQueen && toOpponentQueen) return -2 * values.MoveNeighbours.Length;
            if (toOpponentQueen && (values.OpponentQueenNeighbours < 4 || values.MoveNeighbours.Length < 3)) return -2 * values.MoveNeighbours.Length;
            if (fromOpponentQueen) return -values.MoveNeighbours.Length;
            if (values.MoveNeighbours.Length > 1) return 2;
            return 0;
        }
    }
}
