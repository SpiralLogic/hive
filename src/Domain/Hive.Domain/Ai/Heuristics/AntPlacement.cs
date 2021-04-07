using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Ai.Heuristics
{
    internal class AntPlacement : IHeuristic
    {
        private readonly Stack<MoveMade> _previousMoves;

        internal AntPlacement(Stack<MoveMade> previousMoves)
        {
            _previousMoves = previousMoves;
        }

        public int Get(HeuristicValues values, Move move)
        {
            if (_previousMoves.Peek().Coords != null) return 0;
            var ((_, _, creature), _) = move;
            if (creature == Creatures.Ant && values.TilesPlaced > 3) return 2 * values.MoveNeighbours.Length;
            return 0;
        }
    }
}
