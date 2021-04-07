using Hive.Domain.Entities;

namespace Hive.Domain.Ai.Heuristics
{
    internal class GameOver : IHeuristic
    {
     
        public int Get(HeuristicValues values, Move move)
        {
            if (values.GameStatus == GameStatus.Player0Win && move.Tile.PlayerId == 0 ||
                values.GameStatus == GameStatus.Player1Win && move.Tile.PlayerId == 1)
            {
                return 2*HeuristicValues.ScoreMax;
            }

            if (values.GameStatus == GameStatus.Draw)
            {
                return -10;
            }

            return 0;
        }
    }
}
