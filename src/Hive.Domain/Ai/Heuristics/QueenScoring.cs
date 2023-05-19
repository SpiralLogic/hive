using Hive.Domain.Entities;

namespace Hive.Domain.Ai.Heuristics;

internal class QueenScoring : IHeuristicBase,IHeuristic
{

    public int Get(HeuristicValuesBase values, Move move)
    {
        var currentPlayer = values.CurrentQueenNeighbours;
        var opponentPlayer = values.OpponentQueenNeighbours;

        var score = 15 * (opponentPlayer - currentPlayer);
        return score;
    }

    public int Get(HeuristicValues values, Move move)
    {
     return   this.Get((HeuristicValuesBase)values, move);
    }
}
