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

        public Move GetMove(int maximize, int minimize) =>
            Run(maximize, minimize).best;

        public (Move best, int score) Run(int maximize, int minimize)
        {
            var moves = GetMoves(maximize).ToArray();
            var best = moves.FirstOrDefault(m => m.Tile.Creature == Creatures.Ant) ?? moves.First();
            var bestScore = -100;
            var score = -100;
            foreach (var move in moves)
            {
                var beetleMoveOffTop = _board.Cells.WherePlayerOccupies(minimize)
                    .FirstOrDefault(c => c.Tiles.Contains(move.Tile))
                    .HasQueen();
                var maximizeQueenInitialNeighbours = CountQueenNeighbours(maximize);
                var minimizeQueenInitialNeighbours = CountQueenNeighbours(minimize);
                var moveHasQueenNeighbour = MoveHasQueenNeighbour(move);
                var isAntPlacement = move.Tile.Creature.Name == Creatures.Ant.Name &&
                                     _board.Players[move.Tile.PlayerId].Tiles.Any(t => t.Id == move.Tile.Id);
                MakeMove(move);
                var minimizeQueenNeighbours = CountQueenNeighbours(minimize);
                var maximizeQueenNeighbours = CountQueenNeighbours(maximize);
                var movesNeighbours = _board.Cells.FindCell(move.Coords)?.SelectNeighbors(_board.Cells).WhereOccupied().Count() ?? 0;

                var beetleMoveOnTop = move.Tile.Creature.Name == Creatures.Beetle.Name &&
                                      _board.Cells.WherePlayerOccupies(minimize).FindCell(move.Coords).HasQueen();
                var changeInQueen = 3 * (minimizeQueenNeighbours - minimizeQueenInitialNeighbours + maximizeQueenInitialNeighbours -
                                         maximizeQueenNeighbours);
                score = Score(changeInQueen, moveHasQueenNeighbour, movesNeighbours, isAntPlacement, minimizeQueenNeighbours,
                    beetleMoveOnTop, beetleMoveOffTop);
                RevertMove();
                if (score >= 100) return (move, score);
                if (score <= bestScore) continue;
                bestScore = score;
                best = move;
            }

            return (best, score);
        }

        private static int Score(
            int changeInQueen,
            bool moveHasQueenNeighbour,
            int movesNeighbours,
            bool isAntPlacement,
            int minimizeQueenNeighbours,
            bool beetleMoveOnTop,
            bool beetleMoveOffTop
        )
        {
            var score = 0;
            if (changeInQueen != 0) score = 2 * changeInQueen;
            if (moveHasQueenNeighbour && score == 0) score -= 2;
            if (score == 0) score += movesNeighbours;
            if (isAntPlacement) score += 1;
            if (minimizeQueenNeighbours == 6) return 100;
            if (beetleMoveOnTop) return 100;
            if (beetleMoveOffTop) return -100;
            return score;
        }

        private bool MoveHasQueenNeighbour(Move move)
        {
            return _board.Cells.FindCell(move.Coords)?.SelectNeighbors(_board.Cells).Any(c => c.HasQueen()) ?? false;
        }

        private void MakeMove(Move move)
        {
            var originalCoords = _board.Cells.FindCell(move.Tile)?.Coords;
            _previousMoves.Push(new MoveMade(move.Tile.Id, move.Tile.PlayerId, originalCoords));
            if (_board.Move(move) == GameStatus.MoveInvalid) Console.WriteLine(move);
        }

        private void RevertMove()
        {
            var (tileId, playerId, coords) = _previousMoves.Pop();
            var currentCell = _board.Cells.WhereOccupied().First(c => c.TopTile().Id == tileId);
            if (coords == null)
            {
                var player = _board.Players.FindPlayerById(playerId);
                var tile = currentCell.RemoveTopTile();
                player.Tiles.Add(tile);
                _board.UpdateMoves(player);
            }
            else
            {
                var player = _board.Players.FindPlayerById(playerId);
                var tile = currentCell.TopTile();
                var moves = tile.Creature.GetAvailableMoves(currentCell, _board.Cells);
                tile.Moves.UnionWith(moves);
                if (_board.Move(new Move(currentCell.TopTile(), coords)) == GameStatus.MoveInvalid) 
                    Console.WriteLine(coords);

                _board.UpdateMoves(player);
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
            return _board.Cells.WherePlayerOccupies(playerId)
                .FirstOrDefault(c => c.HasQueen() && c.Tiles.First(t => t.IsQueen()).PlayerId == playerId)
                ?.SelectNeighbors(_board.Cells)
                .WhereOccupied()
                .Count() ?? 0;
        }

        private record MoveMade(int TileId, int PlayerId, Coords? Coords);
    }
}
