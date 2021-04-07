using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics
{
    internal class HeuristicValues
    {
        internal const int MaxDepth = 3;
        internal const int ScoreMax = 100;
        private readonly Hive _hive;
        internal readonly GameStatus GameStatus;
        internal readonly Move Move;
        internal readonly Cell? MoveFromLocation;
        internal readonly List<Cell> MoveFromNeighbours = new();
        internal readonly Cell[] MoveNeighbours ;
        internal readonly Cell MoveToLocation;

        public HeuristicValues(Hive hive, Stack<MoveMade> previousMoves, Move move, GameStatus gameStatus)
        {
            _hive = hive;
            Move = move;
            GameStatus = gameStatus;
            if (previousMoves.TryPeek(out var moveFromCoords) && moveFromCoords.Coords != null)
            {
                MoveFromLocation = _hive.Cells.FindCell(moveFromCoords.Coords);
                MoveFromNeighbours = MoveFromLocation.SelectNeighbors(_hive.Cells).WhereOccupied().ToList();
            }

            MoveToLocation = _hive.Cells.FindCell(move.Coords);
            MoveNeighbours = MoveToLocation.SelectNeighbors(_hive.Cells).WhereOccupied().ToArray();
            CurrentQueenNeighbours = CountPlayerQueenNeighbours(move.Tile.PlayerId);
            OpponentQueenNeighbours =
                _hive.Players.Where(p => p.Id != move.Tile.PlayerId).Select(p => CountPlayerQueenNeighbours(p.Id)).Sum();

        }


        internal int CurrentQueenNeighbours { get; }

        internal int OpponentQueenNeighbours { get; }

        private int CountPlayerQueenNeighbours(int playerId)
        {
            return _hive.Cells.WhereOccupied()
                       .FirstOrDefault(c => c.HasQueen() && c.Tiles.Any(t => t.IsQueen() && t.PlayerId == playerId))
                       ?.SelectNeighbors(_hive.Cells)
                       .WhereOccupied()
                       .Count() ??
                   0;
        }
    }
}
