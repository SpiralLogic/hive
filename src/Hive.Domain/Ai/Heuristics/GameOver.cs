using Hive.Domain.Entities;

namespace Hive.Domain.Ai.Heuristics;

internal class GameOver : IHeuristic
{

    public int Get(HeuristicValues values, Move move)
    {
        var ((_, playerId, _), _) = move;
        if (values.GameStatus == GameStatus.Player0Win && playerId == 0 ||
            values.GameStatus == GameStatus.Player1Win && playerId == 1 ||
            values.GameStatus == GameStatus.Draw) return 2 * HeuristicValues.ScoreMax;

        return 0;
    }
}
