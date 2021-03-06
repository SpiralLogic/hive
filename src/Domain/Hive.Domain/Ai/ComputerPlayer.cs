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
        private readonly Hive _hive;
        private readonly Func<string, Tile, ValueTask>? _broadcastThought;
        private readonly ScoredMove[] _depth = new ScoredMove[HeuristicValues.MaxDepth];
        private readonly ICollection<IHeuristic> _heuristics;
        private readonly Stack<InProgressMove> _previousMoves = new();
        private Tile? _lastBroadcast;
        private readonly Stopwatch _stopWatch = new();
        private readonly Random _rnd = new();

        public ComputerPlayer(Hive hive, Func<string, Tile, ValueTask>? broadcastThought = null)
        {
            _broadcastThought = broadcastThought;
            _hive = hive;
            _heuristics = new List<IHeuristic>
            {
                new GameOver(),
                new NoQueenOrAntFirst(_hive),
                new AntPlacement(_previousMoves),
                new BeetlePlacement(_previousMoves),
                new BeetleMoveOff(),
                new BeetleMoveOn(),
                new MoveSpread(),
                new QueenScoring()
            };
        }

        public async ValueTask<Move> GetMove()
        {
            _stopWatch.Start();
            var r = await Run(null, HeuristicValues.MaxDepth);

            return r.Move ?? throw new ApplicationException("Could not determine next move");
        }

        private async ValueTask<ScoredMove> Run(Move? move, int depth)
        {

            if (depth == 0 || _stopWatch.ElapsedMilliseconds > HeuristicValues.MaxSearchTime) return new ScoredMove(move, 0);

            var tilesToExplore = FindMovesToExplore();
            var toExplore = ReduceToBestMoves(tilesToExplore);
            var (best, bestScore) = await Explore(depth, toExplore);

            _depth[depth - 1] = new ScoredMove(best, bestScore);
            return _depth[depth - 1];
        }

        private IDictionary<int, List<ExploreNode>> FindMovesToExplore()
        {
            var moves = GetMoves().ToArray();
            var toExplore = new Dictionary<int, List<ExploreNode>>();
            foreach (var nextMove in moves)
            {
                var status = MakeMove(nextMove);
                if (status == GameStatus.MoveInvalid) continue;
                if (!toExplore.ContainsKey(nextMove.Tile.Id)) toExplore.Add(nextMove.Tile.Id, new List<ExploreNode>());

                var tileMoves = toExplore[nextMove.Tile.Id]!;
                var values = new HeuristicValues(_hive, _previousMoves, nextMove, status);
                var score = _heuristics.Sum(h => h.Get(values, values.Move));
                RevertMove();
                tileMoves.Add(new ExploreNode(score, values));
            }

            return toExplore;
        }

        private IList<ExploreNode> ReduceToBestMoves(IDictionary<int, List<ExploreNode>> toExplore)
        {
            var moves = new List<ExploreNode>();
            foreach (var (_, values) in toExplore)
            {
                moves.AddRange(values.OrderByDescending(t => t.Score).Take(3).ToList());
            }

            var max = moves.Max(m => m.Score);

            return moves.OrderByDescending(t => t.Score)
                .Where(s => s.Score > 0 || max <= 0)
                .Take(2 * toExplore.Count)
                .OrderBy(_ => _rnd.Next())
                .ToArray();
        }

        private async ValueTask<ScoredMove> Explore(int depth, IList<ExploreNode> toExplore)
        {
            var best = toExplore.First().Values.Move;
            var bestScore = -HeuristicValues.ScoreMax;

            foreach (var (nextScore, values) in toExplore.OrderBy(_ => _rnd.Next()))
            {
                if (MakeMove(values.Move) == GameStatus.MoveInvalid) continue;
                if (depth == HeuristicValues.MaxDepth) await BroadcastSelect(values.Move.Tile);

                var score = nextScore;
                if (nextScore < HeuristicValues.ScoreMax)
                {
                    score += -(await Run(values.Move, depth - 1)).Score / (HeuristicValues.MaxDepth - depth + 1);
                }

                RevertMove();

                if (score >= bestScore)
                {
                    (best, bestScore) = (values.Move, score);
                }

            }

            if (depth == HeuristicValues.MaxDepth) await BroadcastDeselect();

            return new ScoredMove(best, bestScore);
        }

        private async ValueTask BroadcastSelect(Tile tile)
        {
            if (_broadcastThought == null || _lastBroadcast?.Id == tile.Id) return;
            if (_lastBroadcast != null) await BroadcastDeselect();

            if (_lastBroadcast == null)
            {
                await _broadcastThought("select", tile).ConfigureAwait(false);
                _lastBroadcast = tile;
            }
        }

        private async ValueTask BroadcastDeselect()
        {
            if (_broadcastThought != null && _lastBroadcast != null)
                await _broadcastThought("deselect", _lastBroadcast).ConfigureAwait(false);
            _lastBroadcast = null;
        }

        private GameStatus MakeMove(Move move)
        {
            var originalCoords = _hive.Cells.FindCellOrDefault(move.Tile)?.Coords;
            var mv = new InProgressMove(move.Tile.Id, move.Tile.PlayerId, originalCoords);

            if (_hive.Cells.FindCellOrDefault(move.Coords) == null)
            {
                _hive.Cells.Add(new Cell(move.Coords));
                move.Tile.Moves.Add(move.Coords);
            }

            var status = _hive.Move(move);
            if (status == GameStatus.MoveInvalid) return status;

            _previousMoves.Push(mv);
            return status;
        }

        private void RevertMove()
        {
            var (tileId, playerId, coords) = _previousMoves.Pop();
            var currentCell = _hive.Cells.FindCellOrDefault(tileId);
            if (currentCell == null) return;

            var player = _hive.Players.FindPlayerById(playerId);

            if (coords == null) RevertMoveOnBoard(currentCell, player);
            else RevertMoveFromPlayerTiles(currentCell, coords);

            _hive.RefreshMoves(player);
        }

        private void RevertMoveFromPlayerTiles(Cell currentCell, Coords coords)
        {
            var tile = currentCell.TopTile();
            var moves = tile.Creature.GetAvailableMoves(currentCell, _hive.Cells);
            tile.Moves.AddMany(moves);
            _hive.PerformMove(new Move(currentCell.TopTile(), coords));
        }

        private static void RevertMoveOnBoard(Cell currentCell, Player player)
        {
            player.Tiles.Add(currentCell.RemoveTopTile());
        }

        private IEnumerable<Move> GetMoves()
        {
            var cells = _hive.Cells.ToHashSet();
            var unplacedTiles = _hive.Players.SelectMany(p => p.Tiles.GroupBy(t => t.Creature).Select(g => g.First()))
                .SelectMany(t => t.Moves.Select(m => new Move(t, m)).OrderBy(_ => _rnd.Next()));
            var placedTiles = cells.WhereOccupied()
                .OrderBy(c => c.QueenNeighbours(_hive.Cells).Any())
                .Select(c => c.TopTile())
                .SelectMany(t => t.Moves.Select(m => new Move(t, m)));
            return placedTiles.Concat(unplacedTiles).ToList();
        }
    }
}
