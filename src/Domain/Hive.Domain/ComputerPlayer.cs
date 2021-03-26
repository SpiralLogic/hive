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

        public ComputerPlayer(Hive board)
        {
            _board = board;
        }

        public Move GetMove(int maximize, int minimize)
        {
            var moves = GetMoves().ToArray();
            var best = moves.FirstOrDefault(m => m.Tile.Creature == Creatures.Ant) ?? moves.First();
            foreach (var move in moves)
            {
                var maximizeQueenInitialNeighbours = CountQueenNeighbours(maximize);
                var minimizeQueenInitialNeighbours = CountQueenNeighbours(minimize);
                MakeMove(move);
                var minimizeQueenNeighbours = CountQueenNeighbours(minimize);
                var maximizeQueenNeighbours = CountQueenNeighbours(maximize);
                var moveHasQueenNeighbour = MoveHasQueenNeighbour(move);
                var movesNeighbours = _board.Cells.FindCell(move.Coords).SelectNeighbors(_board.Cells).WhereOccupied().Count();
                RevertMove();
                if (minimizeQueenNeighbours == 6) return move;

                if (minimizeQueenNeighbours > minimizeQueenInitialNeighbours) return move;
                if (maximizeQueenNeighbours < maximizeQueenInitialNeighbours) return move;
                if (minimizeQueenInitialNeighbours == minimizeQueenNeighbours && maximizeQueenNeighbours == maximizeQueenInitialNeighbours &&
                    !moveHasQueenNeighbour && movesNeighbours > 1) best = move;
            }

            return best;
        }

        private bool MoveHasQueenNeighbour(Move move)
        {
            return _board.Cells.FindCell(move.Coords).SelectNeighbors(_board.Cells).Any(c => c.HasQueen());
        }

        private void MakeMove(Move move)
        {
            var originalCell = _board.Cells.FindCell(move.Tile)?.Coords;
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

        private int CountQueenNeighbours(int playerId)
        {
            return _board.Cells.WherePlayerOccupies(playerId)
                .FirstOrDefault(c => c.HasQueen())
                ?.SelectNeighbors(_board.Cells)
                .WhereOccupied()
                .Count() ?? 0;
        }

        private record MoveMade(Tile Tile, Coords? Coords)
        {
            internal bool IsPlayerMove => Coords == null;

            internal Move ToMove()
            {
                return Coords != null ? new Move(Tile, Coords) : throw new ApplicationException();
            }
        }
    }
}
