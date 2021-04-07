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
            if (_previousMoves.Peek().Coords != null) return 0;
            var ((_, playerId, creature), _) = move;
            var placed = _hive.Cells.WherePlayerOccupies(playerId).Count();
            if (creature == Creatures.Ant && placed > 3) return 2 * values.MoveNeighbours.Length;
            if (creature == Creatures.Beetle && placed > HiveFactory.StartingTiles.Length - 2) return -2;
            return 0;
        }
    }
}
