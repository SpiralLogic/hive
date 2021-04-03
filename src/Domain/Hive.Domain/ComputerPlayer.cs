using System;
using System.Collections.Generic;
using System.Diagnostics;
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
            var stopWatch = new Stopwatch();
            stopWatch.Start();
            var r = await Run(null, 2, stopWatch);
            foreach (var dTuple in _depth)
            {
                Console.WriteLine(dTuple);
            }

            return r.best!;

        }

        private async Task<(Move? best, int score)> Run(Move? move, int depth, Stopwatch stopWatch)
        {
            if (depth == 0) return (move, 0);
            var bestScore = -100;
            var moves = GetMoves().ToArray();
            var best = moves.FirstOrDefault();
            if (!_board.Cells.WhereOccupied().Any()) return (moves.First(m=>m.Tile.Creature!=Creatures.Ant&&m.Tile.Creature!=Creatures.Queen), -100);
            foreach (var nextMove in moves)
            {
                if (!await MakeMove(nextMove)) continue;
                var score = Evaluate(nextMove) * depth;
                if ((score > bestScore || CountQueenNeighbours().Any(c=>c.Value>0)) && (stopWatch.Elapsed.Seconds < 3 && _previousMoves.Peek().Coords == null) )
                {
                    score += -(await Run(nextMove, depth - 1, stopWatch)).score;
                }
                else
                {
                    score /= depth;
                }

                await RevertMove();
                if (score >= bestScore)
                {
                    bestScore = score;
                    best = nextMove;
                }

            }

            _depth[depth] = (best, bestScore);

            return (best, bestScore);

        }

        private int Evaluate(Move move)
        {
            var score = -100;
            var ((_, max, creature), coords) = move;
            var isAntPlacement = creature == Creatures.Ant && _previousMoves.Peek().Coords == null;
            var moveFromLocation = _board.Cells.FindCell(_previousMoves.Peek().Coords!);
            var moveToLocation = _board.Cells.FindCell(coords);

            var beetleOnQueenBefore = creature == Creatures.Beetle &&
                                      (moveFromLocation?.Tiles.Any(t => t.IsQueen() && t.PlayerId != max) ?? false);

            var beetleOnQueenAfter = creature == Creatures.Beetle &&
                                     (moveToLocation?.Tiles.Any(t => t.IsQueen() && t.PlayerId != max) ?? false);
            if (beetleOnQueenAfter) return 50;
            if (beetleOnQueenBefore) return -50;
            score = 0;
            var movesNeighbours = moveToLocation!.SelectNeighbors(_board.Cells).WhereOccupied().Count();
            foreach (var (playerId, count) in CountQueenNeighbours())
            {
                var isMax = playerId == max ? -1 : 1;
                if (count == 6) return isMax * 100;
                score += isMax * 10 * count;
                if (count > 0 && movesNeighbours > 1 && max==1) score -= movesNeighbours;
            }

            if (MoveHasQueenNeighbour(moveFromLocation)) score -= movesNeighbours;
            score += MoveHasQueenNeighbour(moveToLocation) && score > 0 ? 0 : movesNeighbours;
            if (isAntPlacement) score += _board.Cells.WherePlayerOccupies(move.Tile.PlayerId).Count() > 3 ? 2 : -1;

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
            var unplacedTiles = _board.Players.SelectMany(p => p.Tiles.GroupBy(t => t.Creature).Select(g => g.First()))
                .OrderBy(t => t.Creature.Name);
            var placedTiles = cells.WhereOccupied().Select(c => c.TopTile()).OrderBy(t => t.Creature.Name).ToHashSet();
            var tiles = placedTiles.Count > 3 ? placedTiles.Concat(unplacedTiles) : unplacedTiles.Concat(placedTiles);
            return tiles.SelectMany(t => t.Moves.Select(m => new Move(t, m)));
        }

        private Dictionary<int, int> CountQueenNeighbours()
        {
            return _board.Players.ToDictionary(
                p => p.Id,
                p => _board.Cells.WherePlayerOccupies(p.Id)
                         .FirstOrDefault(c => c.HasQueen() && c.Tiles.First(t=>t.IsQueen()).PlayerId==p.Id)
                         ?.SelectNeighbors(_board.Cells)
                         .WhereOccupied()
                         .Count() ??
                     0
            );
        }

        private record MoveMade(int TileId, int PlayerId, Coords? Coords);
    }
}
