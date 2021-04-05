using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics
{
    internal class AntPlacement : IHeuristic
    {
        private readonly Hive _hive;
        private readonly Stack<MoveMade> _previousMoves;

        internal AntPlacement(Hive hive, Stack<MoveMade> previousMoves)
        {
            _hive = hive;
            _previousMoves = previousMoves;

        }

        public int Get(HeuristicValues values, Move move)
        {
            var (tile, _) = move;
            if (tile.Creature != Creatures.Ant || _previousMoves.Peek().Coords != null) return 0;
            return _hive.Cells.WherePlayerOccupies(tile.PlayerId).Count() > 3 ? 2 * values.MoveNeighbours.Length : -values.MoveNeighbours.Length;
        }
    }
}
