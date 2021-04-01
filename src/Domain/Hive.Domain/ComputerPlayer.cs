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
        private int _minimize;
        private int _maximize;

        public ComputerPlayer(Hive board) =>
            _board = board;

        public Move GetMove(int maximize, int minimize)
        {
            _maximize = maximize;
            _minimize = minimize;
            return Run(null, 1, -100, 100, 1).best!;

        }

        private (Move? best, int score) Run(Move? move, int depth, int alpha, int beta, int color)
        {

            if (CountQueenNeighbours(_minimize) == 6) return (move, 100);
            if (CountQueenNeighbours(_maximize) == 6) return (move, -100);
            if (depth == 0)
            {
                return (move, color * Evaluate(move!));
            }

            var bestScore = -100;
            var moves = GetMoves(_maximize).ToArray();

            var best = moves.FirstOrDefault(m => m.Tile.Creature == Creatures.Ant) ?? moves.FirstOrDefault();
            if (best == null) return (null, -100);

            foreach (var nextMove in moves)
            {
                if (!MakeMove(nextMove)) continue;
                var score = -Run(nextMove, depth - 1, -beta, -alpha, -color).score;
                RevertMove();

                if (score > bestScore)
                {
                    bestScore = score;
                    best = move;
                }

                if (score > alpha)
                {
                    alpha = score;
                }

                if (alpha >= beta) return (best, alpha);
            }

            return (best, bestScore);

        }

        private int Evaluate(Move move)
        {
            var score = -100;
            var isAntPlacement = move.Tile.Creature.Name == Creatures.Ant.Name &&
                                 _board.Players[move.Tile.PlayerId].Tiles.Any(t => t.Id == _previousMoves.Peek()!.TileId);
            var moveHasQueenNeighbour = MoveHasQueenNeighbour(move);
            var maximizeQueenNeighbours = CountQueenNeighbours(_maximize);
            var minimizeQueenNeighbours = CountQueenNeighbours(_minimize);

            var moveFromLocation = _board.Cells.FindCell(_previousMoves.Peek().Coords!);
            var beetleOnQueenBefore = move.Tile.Creature == Creatures.Beetle &&
                                      (moveFromLocation?.Tiles.Any(t => t.IsQueen() && t.PlayerId == _minimize) ?? false);

            var moveLocation = _board.Cells.FindCell(move.Coords);
            var beetleOnQueenAfter = move.Tile.Creature == Creatures.Beetle &&
                                     (moveFromLocation?.Tiles.Any(t => t.IsQueen() && t.PlayerId == _minimize) ?? false);
            var changeInQueenMin = minimizeQueenNeighbours ;
            var changeInQueenMax = maximizeQueenNeighbours ;
            if (beetleOnQueenAfter) return 100;
            if (beetleOnQueenBefore) return -100;
            if (minimizeQueenNeighbours == 6) return 100;
            score = 0;
            var movesNeighbours = moveLocation!.SelectNeighbors(_board.Cells).WhereOccupied().Count();
            score -= 3 * changeInQueenMax;
            score += 3 * changeInQueenMin;
            if (moveHasQueenNeighbour && score == 0) score -= 2;
            if (score == 0) score += movesNeighbours;
            if (isAntPlacement) score += 1;

            return score;
        }

        private bool MoveHasQueenNeighbour(Move move)
        {
            return _board.Cells.FindCell(move.Coords)?.SelectNeighbors(_board.Cells).Any(c => c.HasQueen()) ?? false;
        }

        private bool MakeMove(Move move)
        {
            var originalCoords = _board.Cells.FindCell(move.Tile)?.Coords;
            var mv = new MoveMade(move.Tile.Id, move.Tile.PlayerId, originalCoords);
            _board.RefreshMoves(_board.Players[move.Tile.PlayerId]);
            if (_board.Cells.FindCell(move.Coords) == null)
            {
                _board.Cells.Add(new Cell(move.Coords));
                move.Tile.Moves.Add(move.Coords);
            }

            if (_board.Move(move) == GameStatus.MoveInvalid)
            {
                Console.WriteLine(move);
                return false;
            }

            _previousMoves.Push(mv);

            return true;
        }

        private void RevertMove()
        {

            var (tileId, playerId, coords) = _previousMoves.Pop();
            Cell currentCell;
            try
            {
                currentCell = _board.Cells.WhereOccupied().First(c => c.TopTile().Id == tileId);
            }
            catch
            {
                return;
            }

            if (coords == null)
            {
                var player = _board.Players.FindPlayerById(playerId);
                var tile = currentCell.RemoveTopTile();
                player.Tiles.Add(tile);
                _board.RefreshMoves(player);
            }
            else
            {
                var player = _board.Players.FindPlayerById(playerId);
                var tile = currentCell.TopTile();
                var moves = tile.Creature.GetAvailableMoves(currentCell, _board.Cells);
                tile.Moves.AddMany(moves);
                if (_board.Move(new Move(currentCell.TopTile(), coords)) == GameStatus.MoveInvalid)
                    Console.WriteLine(coords);

                _board.RefreshMoves(player);
            }

        }

        private IEnumerable<Move> GetMoves(int playerId)
        {
            var cells = _board.Cells;
            var rnd = new Random();
            return _board.Players[playerId]
                .Tiles.Concat(cells.WherePlayerControls(_board.Players.FindPlayerById(playerId)).Select(c => c.TopTile()))
                .SelectMany(t => t.Moves.Select(m => new Move(t, m)))
                .OrderBy(_ => rnd.Next())
                .ToHashSet();
        }

        private int CountQueenNeighbours(int playerId)
        {
            var qc = _board.Cells.WherePlayerOccupies(playerId).FirstOrDefault(c => c.HasQueen());
            if (qc == null) return 0;
            return qc.SelectNeighbors(_board.Cells).WhereOccupied().Count();

        }

        private record MoveMade(int TileId, int PlayerId, Coords? Coords);
    }
}
