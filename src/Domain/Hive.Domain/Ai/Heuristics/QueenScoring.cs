using Hive.Domain.Entities;

namespace Hive.Domain.Ai.Heuristics
{
    internal class QueenScoring : IHeuristic
    {

        public int Get(HeuristicValues values, Move move)
        {
            var currentPlayer = values.CurrentQueenNeighbours;
            var opponentPlayer = values.OpponentQueenNeighbours;

            return 10 * (opponentPlayer - currentPlayer);
        }
    }
}
