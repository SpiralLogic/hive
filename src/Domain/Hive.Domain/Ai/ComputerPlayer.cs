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
            if (depth == 0 || _stopWatch.ElapsedMilliseconds > 7000) return (move, 0);

            var toExplore = FindMovesToExplore();

            ReduceToBestMoves(toExplore, depth);

            var (best, bestScore) = await Explore(depth, toExplore);

            _depth[depth - 1] = (best, bestScore);
            return _depth[depth - 1];
        }

        private static void ReduceToBestMoves(IDictionary<Tile, List<(int score, HeuristicValues values)>> toExplore, int depth)
        {

            foreach (var (tile, values) in toExplore)
            {
                var newList = values.OrderByDescending(t => t.score).Take(depth).ToList();
                toExplore[tile] = newList;
            }
        }

        private async Task<(Move? best, int bestScore)> Explore(
            int depth,
            Dictionary<Tile, List<(int score, HeuristicValues values)>> toExplore
        )
        {
            var best = toExplore.First().Value.First().values.Move;
            var bestScore = -HeuristicValues.MaxDepth;
            foreach (var (nextScore, values) in toExplore.SelectMany(kvp => kvp.Value))
            {
                var status = MakeMove(values.Move);
                if (status == GameStatus.MoveInvalid) continue;
                if (depth == HeuristicValues.MaxDepth) await BroadcastMove(values.Move);
                var score = nextScore / (HeuristicValues.MaxDepth - depth + 1);
                if (score >= bestScore && score < HeuristicValues.ScoreMax)
                {
                    score -= (await Run(values.Move, depth - 1)).score;
                }

                RevertMove();

                if (score >= bestScore) (best, bestScore) = (values.Move, score);

                if (depth == HeuristicValues.MaxDepth) await BroadcastDeselect();
            }

            return (best, bestScore);
        }

        private Dictionary<Tile, List<(int score, HeuristicValues values)>> FindMovesToExplore()
        {
            var moves = GetMoves().ToArray();
            var toExplore = new Dictionary<Tile, List<(int score, HeuristicValues values)>>();
            foreach (var nextMove in moves)
            {
                var status = MakeMove(nextMove);
                if (status == GameStatus.MoveInvalid) continue;
                if (!toExplore.ContainsKey(nextMove.Tile)) toExplore.Add(nextMove.Tile, new List<(int, HeuristicValues)>());

                var tileMoves = toExplore[nextMove.Tile]!;
                var values = new HeuristicValues(_board, _previousMoves, nextMove, status);
                var score = _heuristics.Sum(h => h.Get(values, values.Move));
                RevertMove();
                tileMoves.Add((score, values));
            }

            return toExplore;
        }

        private async Task BroadcastDeselect()
        {
            if (_broadcastThought != null && _lastBroadcast != null)
                await _broadcastThought("deselect", _lastBroadcast);
            _lastBroadcast = null;
        }

        private async Task BroadcastMove(Move nextMove)
        {
            if (_broadcastThought != null)
            {
                var (tile, _) = nextMove;
                if (_lastBroadcast != null && _lastBroadcast.Id != tile.Id)
                    await BroadcastDeselect();

                if (_lastBroadcast == null || _lastBroadcast.Id != tile.Id)
                {
                    await _broadcastThought("select", tile);
                    _lastBroadcast = tile;
                }
            }
        }

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

            if (coords == null) revertMoveOnBoard(currentCell, player);
            else RevertMoveFromPlayerTiles(currentCell, coords);

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
                .SelectMany(t => t.Moves.Select(m => new Move(t, m)).OrderBy(_ => rnd.Next())).Reverse()
                .ToList();
            return placedTiles.Concat(unplacedTiles) ;
        }
    }
}
