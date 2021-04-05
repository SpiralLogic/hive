using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics
{
    internal class HeuristicValues
    {
        private readonly Hive _hive;
        internal const int MaxDepth = 4;
        internal readonly Move Move;
        internal readonly int Depth;
        internal readonly GameStatus GameStatus;
        internal readonly int BestScore;
        internal readonly Cell[] MoveNeighbours;
        internal readonly Cell? MoveFromLocation;
        internal readonly Cell MoveToLocation;
        private readonly Lazy<int> _currentQueenNeighbours;
        private readonly Lazy<int> _opponentQueenNeighbours;
        internal const int ScoreMax = 100;

        public HeuristicValues(Hive hive, Stack<MoveMade> previousMoves, Move move, int depth, GameStatus gameStatus, int bestScore)
        {
            _hive = hive;
            Move = move;
            Depth = depth;
            GameStatus = gameStatus;
            BestScore = bestScore;
            if (previousMoves.TryPeek(out var moveFromCoords) && moveFromCoords.Coords != null)
            {
                MoveFromLocation = _hive.Cells.FindCell(moveFromCoords.Coords);
            }

            MoveToLocation = _hive.Cells.FindCell(move.Coords);
            MoveNeighbours = MoveToLocation.SelectNeighbors(_hive.Cells).WhereOccupied().ToArray();

            QueenSearch = MoveNeighbours.Any(c => c.HasQueen()) || depth != MaxDepth && QueenSearch;
            _currentQueenNeighbours = new Lazy<int>(() => CountPlayerQueenNeighbours(move.Tile.PlayerId));
            _opponentQueenNeighbours = new Lazy<int>(
                () => _hive.Players.Where(p => p.Id != move.Tile.PlayerId).Select(p => CountPlayerQueenNeighbours(p.Id)).Sum()
            );
        }

        internal static bool QueenSearch;

        internal int CurrentQueenNeighbours => _currentQueenNeighbours.Value;
        internal int OpponentQueenNeighbours => _opponentQueenNeighbours.Value;

        private int CountPlayerQueenNeighbours(int playerId)
        {
            return _hive.Cells.WherePlayerOccupies(playerId)
                       .FirstOrDefault(c => c.HasQueen())
                       ?.SelectNeighbors(_hive.Cells)
                       .WhereOccupied()
                       .Count() ??
                   0;
        }
    }
}
