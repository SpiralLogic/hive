using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain
{
    public class ComputerPlayer
    {
        private readonly Hive _board;
        private readonly Func<string, Tile, Task>? _broadcastThought;
        private readonly (Move? best, int score)[] _depth = new (Move? best, int score)[4];

        private readonly Stack<MoveMade> _previousMoves = new();

        public ComputerPlayer(Hive board, Func<string, Tile, Task>? broadcastThought = null)
        {
            _broadcastThought = broadcastThought;
            _board = board;
        }

        public async Task<Move> GetMove()
        {
            var stopWatch = new Stopwatch();
            stopWatch.Start();
            var r = await Run(null, 2, stopWatch);
            return r.best ?? throw new ApplicationException("Could not determine next move");
        }

        private async Task<(Move? best, int score)> Run(Move? move, int depth, Stopwatch stopWatch)
        {
            if (depth == 0) return (move, 0);
            var bestScore = -100;
            var moves = GetMoves().ToArray();
            var best = moves.FirstOrDefault();
            if (!_board.Cells.WhereOccupied().Any())
                return (moves.First(m => m.Tile.Creature != Creatures.Ant && m.Tile.Creature != Creatures.Queen), -100);
            Tile? lastBroadcast = null;
            foreach (var nextMove in moves)
            {

                if (!MakeMove(nextMove)) continue;
                if (depth == 2 && _broadcastThought != null)
                {
                    if (lastBroadcast != null && lastBroadcast.Id != nextMove.Tile.Id)
                    {
                        await _broadcastThought("deselect", lastBroadcast);
                        await _broadcastThought("select", nextMove.Tile);
                    }
                    else if (lastBroadcast == null)
                    {
                        await _broadcastThought("select", nextMove.Tile);

                    }

                    lastBroadcast = nextMove.Tile;
                }

                var score = Evaluate(nextMove) * depth;
                if (score<100 || (stopWatch.Elapsed.Seconds < 20 &&
                     depth == 2 &&
                     CountQueenNeighbours().Where(c => c.Key != nextMove.Tile.PlayerId).Any(c => c.Value > 0)) ||
                    (stopWatch.Elapsed.Seconds < 10 && CountQueenNeighbours().Any(c => c.Value > 0)) ||
                    (stopWatch.Elapsed.Seconds < 5 && bestScore <= 0))
                {
                    score += -(await Run(nextMove, depth - 1, stopWatch)).score;
                }
                else
                {
                    score /= depth;
                }

                RevertMove();
                if (score >= bestScore)
                {
                    bestScore = score;
                    best = nextMove;
                }

            }

            if (depth == 2 && _broadcastThought != null && lastBroadcast != null)
            {
                await _broadcastThought("deselect", lastBroadcast);
            }

            _depth[depth] = (best, bestScore);
            return (best, bestScore);

        }

        private int Evaluate(Move move)
        {
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
            var score = 0;
            var movesNeighbours = moveToLocation!.SelectNeighbors(_board.Cells).WhereOccupied().Count();
            foreach (var (playerId, count) in CountQueenNeighbours())
            {
                var isMax = playerId == max ? -1 : 1;
                if (count == 6) return isMax * 100;
                score += isMax * 10 * count;
                if (count > 0 && movesNeighbours > 1 && max == playerId) score -= movesNeighbours;
            }

            if (MoveHasQueenNeighbour(moveFromLocation)) score -= movesNeighbours;
            score += MoveHasQueenNeighbour(moveToLocation) && score > 0 ? 0 : movesNeighbours;
            if (isAntPlacement)
                score += _board.Cells.WherePlayerOccupies(move.Tile.PlayerId).Count() > 3 ? 2 * movesNeighbours : -movesNeighbours;

            return score;
        }

        private bool MoveHasQueenNeighbour(Cell? cell)
        {
            return cell?.SelectNeighbors(_board.Cells).Any(c => c.HasQueen()) ?? false;
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

            var status = _board.Move(move);
            if (status == GameStatus.MoveInvalid)
            {
                return false;
            }

            _previousMoves.Push(mv);
            return true;
        }

        private void RevertMove()
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
                _board.Move(new Move(currentCell.TopTile(), coords));

                _board.RefreshMoves(player);
            }
        }

        private IEnumerable<Move> GetMoves()
        {
            var rnd = new Random();
            var cells = _board.Cells.ToHashSet();
            var unplacedTiles = _board.Players.SelectMany(p => p.Tiles.GroupBy(t => t.Creature).Select(g => g.First()))
                .OrderBy(t => t.Creature.Name).SelectMany(t => t.Moves.Select(m => new Move(t, m)).OrderBy(t => rnd.Next())).ToList();
            var placedTiles = cells.WhereOccupied().OrderBy(c=>c.SelectNeighbors(_board.Cells).Any(c=>c.HasQueen())).Select(c => c.TopTile()).SelectMany(t => t.Moves.Select(m => new Move(t, m)).OrderBy(t => rnd.Next())).ToList();
            var tiles = placedTiles.Count > 3?unplacedTiles.Concat(placedTiles):placedTiles.Concat(unplacedTiles);
            return tiles;
        }

        private Dictionary<int, int> CountQueenNeighbours()
        {
            return _board.Players.ToDictionary(
                p => p.Id,
                p => _board.Cells.WherePlayerOccupies(p.Id)
                         .FirstOrDefault(c => c.HasQueen() && c.Tiles.First(t => t.IsQueen()).PlayerId == p.Id)
                         ?.SelectNeighbors(_board.Cells)
                         .WhereOccupied()
                         .Count() ??
                     0
            );
        }

        private record MoveMade(int TileId, int PlayerId, Coords? Coords);
    }
}
