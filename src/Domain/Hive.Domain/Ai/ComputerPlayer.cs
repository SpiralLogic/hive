using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Hive.Domain.Ai.Heuristics;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai
{
    public class ComputerPlayer
    {
        private readonly Hive _board;
        private readonly Func<string, Tile, Task>? _broadcastThought;
        private readonly (Move? best, int score)[] _depth = new (Move? best, int score)[HeuristicValues.MaxDepth];
        private readonly ICollection<IHeuristic> _heuristics;
        private readonly Stack<MoveMade> _previousMoves = new();
        private Tile? _lastBroadcast;
        private Stopwatch _stopWatch = new();

        public ComputerPlayer(Hive board, Func<string, Tile, Task>? broadcastThought = null)
        {
            _broadcastThought = broadcastThought;
            _board = board;
            _heuristics = new List<IHeuristic>
            {
                new GameOver(),
                new NoQueenOrAntFirst(_board),
                new AntPlacement(_board, _previousMoves),
                new BeetleMoveOff(),
                new BeetleMoveOn(),
                new MoveSpread(),
                new QueenScoring()
            };
        }

        public async Task<Move> GetMove()
        {
            _stopWatch = new Stopwatch();
            _stopWatch.Start();
            var r = await Run(null, HeuristicValues.MaxDepth);

            return r.best ?? throw new ApplicationException("Could not determine next move");
        }

        private async Task<(Move? best, int score)> Run(Move? move, int depth)
        {
            if (depth == 0) return (move, 0);

            var bestScore = -HeuristicValues.ScoreMax;
            var worstScore = HeuristicValues.ScoreMax;
            var moves = GetMoves().ToArray();
            var best = moves.FirstOrDefault();

            _lastBroadcast = null;
            foreach (var nextMove in moves)
            {
                var status = MakeMove(nextMove);
                if (status == GameStatus.MoveInvalid) continue;
                var values = new HeuristicValues(_board, _previousMoves, nextMove, depth, status, bestScore,
                    worstScore);

                var (score, newWorstScore) = await GetScore(values);
                worstScore = newWorstScore;
                RevertMove();

                if (score >= bestScore) (best, bestScore) = SetBest(nextMove, score);
            }

            if (depth == HeuristicValues.MaxDepth) await BroadcastDeselect();

            _depth[depth - 1] = SetBest(best, bestScore);
            return SetBest(best, bestScore);
        }

        private async Task<(int score, int worstscore)> GetScore(HeuristicValues values)
        {
            if (values.Depth == HeuristicValues.MaxDepth) await BroadcastMove(values.Move);
            var worstScore = values.WorstScore;
            var score = Evaluate(values);
            if (score >= values.BestScore && score < HeuristicValues.ScoreMax &&
                _stopWatch.ElapsedMilliseconds < 3000)
            {
                worstScore = Math.Min(values.WorstScore, -(await Run(values.Move, values.Depth - 1)).score);
                score += worstScore;
            }
            else
            {
                score += values.WorstScore;
            }

            return (score, worstScore);
        }

        private async Task BroadcastDeselect()
        {
            if (_broadcastThought != null && _lastBroadcast != null)
                await _broadcastThought("deselect", _lastBroadcast);
        }

        private async Task BroadcastMove(Move nextMove)
        {
            if (_broadcastThought != null)
            {
                var (tile, _) = nextMove;
                if (_lastBroadcast != null && _lastBroadcast.Id != tile.Id)
                    await _broadcastThought("deselect", _lastBroadcast);

                if (_lastBroadcast == null || _lastBroadcast.Id != tile.Id)
                {
                    await _broadcastThought("select", tile);

                    _lastBroadcast = tile;
                }
            }
        }

        private static (Move? best, int bestScore) SetBest(Move? nextMove, int score)
        {
            var bestScore = score;
            var best = nextMove;
            return (best, bestScore);
        }

        private int Evaluate(HeuristicValues values) =>
            _heuristics.Sum(h => h.Get(values, values.Move)) * values.Depth;

        private GameStatus MakeMove(Move move)
        {
            var originalCoords = _board.Cells.FindCellOrDefault(move.Tile)?.Coords;
            var mv = new MoveMade(move.Tile.Id, move.Tile.PlayerId, originalCoords);
            _board.RefreshMoves(_board.Players[move.Tile.PlayerId]);
            if (_board.Cells.FindCellOrDefault(move.Coords) == null)
            {
                _board.Cells.Add(new Cell(move.Coords));
                move.Tile.Moves.Add(move.Coords);
            }

            var status = _board.Move(move);
            if (status == GameStatus.MoveInvalid) return status;

            _previousMoves.Push(mv);
            return status;
        }

        private void RevertMove()
        {
            var (tileId, playerId, coords) = _previousMoves.Pop();
            var currentCell = _board.Cells.FindCellOrDefault(tileId);
            if (currentCell == null) return;

            var player = _board.Players.FindPlayerById(playerId);

            if (coords == null)
            {
                revertMoveOnBoard(currentCell, player);
            }
            else
            {
                RevertMoveFromPlayerTiles(currentCell, coords);
            }

            _board.RefreshMoves(player);
        }

        private void RevertMoveFromPlayerTiles(Cell currentCell, Coords coords)
        {
            var tile = currentCell.TopTile();
            var moves = tile.Creature.GetAvailableMoves(currentCell, _board.Cells);
            tile.Moves.AddMany(moves);
            _board.PerformMove(new Move(currentCell.TopTile(), coords));
        }

        private void revertMoveOnBoard(Cell currentCell, Player player)
        {
            var tile = currentCell.RemoveTopTile();
            player.Tiles.Add(tile);
        }

        private IEnumerable<Move> GetMoves()
        {
            var rnd = new Random();
            var cells = _board.Cells.ToHashSet();
            var unplacedTiles = _board.Players.SelectMany(p => p.Tiles.GroupBy(t => t.Creature).Select(g => g.First()))
                .OrderBy(t => t.Creature.Name)
                .SelectMany(t => t.Moves.Select(m => new Move(t, m)).OrderBy(_ => rnd.Next()))
                .ToList();
            var placedTiles = cells.WhereOccupied()
                .OrderBy(c => c.SelectNeighbors(_board.Cells).Any(n => n.HasQueen()))
                .Select(c => c.TopTile())
                .SelectMany(t => t.Moves.Select(m => new Move(t, m)).OrderBy(_ => rnd.Next()))
                .ToList();
            return placedTiles.Count > 3 ? placedTiles.Concat(unplacedTiles) : unplacedTiles.Concat(placedTiles);
        }
    }
}