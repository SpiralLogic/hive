using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics
{
    internal class BeetleMoveOn : IHeuristic
    {
        public int Get(HeuristicValues values, Move move)
        {

            if (move.Tile.IsCreature(Creatures.Beetle) &&
                values.MoveToLocation.HasQueen(values.OpponentId) && values.OpponentQueenNeighbours<4) return 30;

            return 0;
        }
    }
}
