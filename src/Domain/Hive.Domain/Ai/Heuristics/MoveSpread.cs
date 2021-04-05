using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics
{
    internal class MoveSpread : IHeuristic
    {

        public int Get(HeuristicValues values, Move move)
        {
            if (values.MoveNeighbours.Any(c => c.HasQueen())) return  -values.MoveNeighbours.Length;
            return values.MoveNeighbours.Length;
        }
    }
}
