using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain
{
    public class ComputerPlayer
    {
        private readonly Hive _board;
        private readonly Func<GameStatus, Task>? _broadcast;

        private readonly Stack<MoveMade> _previousMoves = new();
        private readonly (Move? best, int score)[] _depth = new (Move? best, int score)[4];

        public ComputerPlayer(Hive board, Func<GameStatus, Task>? broadcast)
        {
            _board = board;
            _broadcast = broadcast;
        }

        public async Task<Move> GetMove(int color)
        {
            var r = await Run(null, 3, -100, 100, color);
            Console.WriteLine(r);
            foreach (var dTuple in _depth)
            {
                Console.WriteLine(dTuple);
            }

            return r.best!;

        }

        private async Task<(Move? best, int score)> Run(Move? move, int depth, int alpha, int beta, int color = 1)
        {
            if (depth <= 0 || CountQueenNeighbours().Any(kvp => kvp.Value == 6)) return (move, color * Evaluate(move!, depth));

            var bestScore = -100;
            var moves = GetMoves().ToArray();
            var best = moves.FirstOrDefault(m => m.Tile.Creature == Creatures.Ant) ?? moves.FirstOrDefault();
            if (!_board.Cells.WhereOccupied().Any()) return (best, 0);

            foreach (var nextMove in moves)
            {
                if (!await MakeMove(nextMove)) continue;
                var score = -(await Run(nextMove, depth - 1, -beta, -alpha, -color)).score;
                await RevertMove();
                if (score >= bestScore) best = nextMove;
                bestScore = Math.Max(bestScore, score);
                alpha = Math.Max(score, alpha);
                if (alpha >= beta)
                {
                    break;
                }

            }

            _depth[depth] = (best, bestScore);

            return (best, bestScore);

        }

        private int Evaluate(Move move, int depth)
        {
            var score = -100;
            var ((_, max, creature), coords) = move;
            var isAntPlacement = creature == Creatures.Ant && _previousMoves.Peek().Coords == null;
            var moveFromLocation = _board.Cells.FindCell(_previousMoves.Peek().Coords!);
            var moveToLocation = _board.Cells.FindCell(coords);

            var moveHasQueenNeighbour = MoveHasQueenNeighbour(moveFromLocation);

            var beetleOnQueenBefore = creature == Creatures.Beetle &&
                                      (moveFromLocation?.Tiles.Any(t => t.IsQueen() && t.PlayerId != max) ?? false);

            var beetleOnQueenAfter = creature == Creatures.Beetle &&
                                     (moveToLocation?.Tiles.Any(t => t.IsQueen() && t.PlayerId != max) ?? false);
            if (beetleOnQueenAfter) return -50;
            if (beetleOnQueenBefore) return 50;
            score = 0;
            foreach (var (playerId, count) in CountQueenNeighbours())
            {
                var isMax = playerId == max ? -1 : 1;
                if (count == 6) return isMax * 100;
                score += isMax * 4 * count;
            }

            var movesNeighbours = moveToLocation!.SelectNeighbors(_board.Cells).WhereOccupied().Count();

            if (moveHasQueenNeighbour && score == 0) score -= 2;
            if (score == 0) score += movesNeighbours;
            if (isAntPlacement && _board.Cells.WherePlayerOccupies(max).Count() > 3) score += 1;

            return score;
        }

        private bool MoveHasQueenNeighbour(Cell? cell)
        {
            return cell?.SelectNeighbors(_board.Cells).Any(c => c.HasQueen()) ?? false;
        }

        private async Task<bool> MakeMove(Move move)
        {
            var originalCoords = _board.Cells.FindCell(move.Tile)?.Coords;
            var mv = new MoveMade(move.Tile.Id, move.Tile.PlayerId, originalCoords);
            _board.RefreshMoves(_board.Players[move.Tile.PlayerId]);
            if (_board.Cells.FindCell(move.Coords) == null)
            {
                _board.Cells.Add(new Cell(move.Coords));
                move.Tile.Moves.Add(move.Coords);
            }

            var status = _board.Move(move);
            if (status == GameStatus.MoveInvalid)
            {
                Console.WriteLine("ERROR" + move);
                return false;
            }

            _previousMoves.Push(mv);
            await Task.CompletedTask;
         //   if (_broadcast != null) await _broadcast(status);
            return true;
        }

        private async Task RevertMove()
        {
            var (tileId, playerId, coords) = _previousMoves.Pop();
            //   if (coords != null) Thread.Sleep(1000);
            //    else Thread.Sleep(300);
            Cell currentCell;
            try
            {
                currentCell = _board.Cells.WhereOccupied().First(c => c.TopTile().Id == tileId);
            }
            catch
            {
                Console.WriteLine("ERROR" + coords);
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
                var status = _board.Move(new Move(currentCell.TopTile(), coords));
                if (status == GameStatus.MoveInvalid)
                {
                    Console.WriteLine("ERROR" + coords);
                }

                await Task.CompletedTask;
         //       if (_broadcast != null) await _broadcast(status);
                _board.RefreshMoves(player);
            }

            return;

        }

        private IEnumerable<Move> GetMoves()
        {
            var cells = _board.Cells;
            var rnd = new Random();
            return _board.Players.SelectMany(p => p.Tiles.GroupBy(t => t.Creature).Select(g => g.First()))
                .Concat(cells.WhereOccupied().Select(c => c.TopTile()))
                .SelectMany(t => t.Moves.Select(m => new Move(t, m)))
                //.OrderBy(_ => rnd.Next())
                .ToHashSet();
        }

        private Dictionary<int, int> CountQueenNeighbours()
        {
            return _board.Players.ToDictionary(
                p => p.Id,
                p => _board.Cells.WherePlayerOccupies(p.Id)
                         .FirstOrDefault(c => c.HasQueen())
                         ?.SelectNeighbors(_board.Cells)
                         .WhereOccupied()
                         .Count() ??
                     0
            );
        }

        private record MoveMade(int TileId, int PlayerId, Coords? Coords);
    }
}
