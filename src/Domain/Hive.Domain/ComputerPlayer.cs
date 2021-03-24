using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain
{
    public class ComputerPlayer
    {

        private readonly Hive _board;

        private readonly Stack<MoveMade> _previousMoves = new();

        public ComputerPlayer(Hive board) =>
            _board = board;

        public Move GetMove() =>
            Run();

        private Move Run()
        {
            var moves = GetMoves().ToArray();
            var best = moves.First();
            foreach (var move in moves)
            {
                var surroundingPlayer0Queen = GetPlayerQueenCount(0);
                var surroundingPlayer1Queen = GetPlayerQueenCount(1);
                MakeMove(move);
                var surroundingPlayer0QueenAfter = GetPlayerQueenCount(0);
                var surroundingPlayer1QueenAfter = GetPlayerQueenCount(1);
                var moveIsQueensNeighbour = MoveNeighboursQueen(move);
                RevertMove();
                if (surroundingPlayer0Queen == 6 || surroundingPlayer1Queen == 6) return move;

                if (surroundingPlayer0QueenAfter - surroundingPlayer0Queen  >   surroundingPlayer1QueenAfter - surroundingPlayer1Queen) return move;
                if (surroundingPlayer1Queen == surroundingPlayer1QueenAfter && surroundingPlayer0Queen == surroundingPlayer0QueenAfter &&
                    !moveIsQueensNeighbour) best = move;

            }

            return best;
        }

        private bool MoveNeighboursQueen(Move move) =>
            _board.Cells.FindCell(move.Coords).SelectNeighbors(_board.Cells).Any(c => c.Tiles.Any(t => t.IsQueen()));

        private void MakeMove(Move move)
        {
            var originalCell = _board.Cells.SingleOrDefault(c => c.Tiles.Any(t => t.Id == move.Tile.Id))?.Coords;
            _board.PerformMove(move);

            _previousMoves.Push(new MoveMade(move.Tile with {Moves = new HashSet<Coords>(move.Tile.Moves)}, originalCell));

        }

        private void RevertMove()
        {

            var move = _previousMoves.Pop();
            if (move.IsPlayerMove)
            {
                _board.ReturnTileToPlayer(move.Tile);
                return;
            }

            _board.PerformMove(move.ToMove());
        }

        private IEnumerable<Move> GetMoves()
        {
            var cells = _board.Cells;
            var rnd = new Random();
            return _board.Players.SelectMany(p => p.Tiles)
                .Concat(cells.WhereOccupied().Select(c => c.TopTile()))
                .SelectMany(t => t.Moves.Select(m => new Move(t, m)))
                .OrderBy(item => rnd.Next())
                .ToHashSet();
        }

        private int GetPlayerQueenCount(int playerId) =>
            _board.Cells.WherePlayerOccupies(playerId)
                .FirstOrDefault(c => c.HasQueen())
                ?.SelectNeighbors(_board.Cells)
                .WhereOccupied()
                .Count() ?? 0;

        private record MoveMade(Tile Tile, Coords? Coords)
        {
            internal bool IsPlayerMove => Coords == null;

            internal Move ToMove() =>
                Coords != null ? new Move(Tile, Coords) : throw new ApplicationException();
        }
    }
}
