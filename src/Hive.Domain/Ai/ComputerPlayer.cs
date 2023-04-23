using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Hive.Domain.Ai.Heuristics;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai;

internal class ComputerPlayer
{
    private readonly Func<string, Tile, ValueTask>? _broadcastThought;
    private readonly ScoredMove[] _depth = new ScoredMove[HeuristicValues.MaxDepth];
    private readonly ICollection<IHeuristic> _heuristics;
    private readonly Hive _hive;
    private readonly Random _rnd = new();
    private readonly Stopwatch _globalStopwatch = new();
    private readonly Stopwatch _localStopwatch = new();
    private Tile? _lastBroadcast;

    public ComputerPlayer(Hive hive, Func<string, Tile, ValueTask>? broadcastThought = null)
    {
        _broadcastThought = broadcastThought;
        _hive = hive;
        _heuristics = new List<IHeuristic>
        {
            new GameOver(),
            new NoQueenOrAntFirst(_hive),
            new AntPlacement(),
            new BeetlePlacement(_hive.History),
            new BeetleMoveOff(),
            new BeetleMoveOn(),
            new MoveSpread(),
            new NoRepeatedPreviousMoves(_hive.History),
            new QueenScoring()
        };
    }

    public async ValueTask<Move> GetMove()
    {
        _globalStopwatch.Start();
        var r = await Run(null, HeuristicValues.MaxDepth).ConfigureAwait(false);
        return r.Move ?? throw new InvalidDataException("Could not determine next move");
    }

    private async ValueTask<ScoredMove> Run(Move? move, int depth)
    {
        if (depth == 0 || _globalStopwatch.ElapsedMilliseconds > Hive.GlobalMaxSearchTime) return new(move, 0);
        _localStopwatch.Restart();

        var tilesToExplore = FindMovesToExplore();
        var toExplore = ReduceToBestMoves(tilesToExplore);

        if (!toExplore.Any()) return new(null, 0);

        var (best, bestScore) = await Explore(depth, toExplore);

        _depth[depth - 1] = new(best, bestScore);
        return _depth[depth - 1];
    }

    private Dictionary<int, List<ExploreNode>> FindMovesToExplore()
    {
        var moves = GetMoves().ToImmutableArray();
        var toExplore = new Dictionary<int, List<ExploreNode>>();
        foreach (var nextMove in moves)
        {
            var status = MakeMove(nextMove);
            if (!toExplore.ContainsKey(nextMove.Tile.Id)) toExplore.Add(nextMove.Tile.Id, new());

            var tileMoves = toExplore[nextMove.Tile.Id];
            var values = new HeuristicValues(_hive, nextMove, status);
            var score = _heuristics.Sum(h => h.Get(values, values.Move));
            _hive.RevertMove();
            tileMoves.Add(new(score, values));
        }

        return toExplore;
    }

    private IList<ExploreNode> ReduceToBestMoves(IDictionary<int, List<ExploreNode>> toExplore)
    {
        var moves = new List<ExploreNode>();
        foreach (var (_, values) in toExplore) moves.AddRange(values.OrderByDescending(t => t.Score).Take(3).ToList());

        var max = moves.Count != 0 ? moves.Max(m => m.Score) : 0;

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
            if (((HeuristicValues.MaxDepth - depth)) % 2 == 1 && _localStopwatch.ElapsedMilliseconds > Hive.LocalMaxSearchTime) break;
            MakeMove(values.Move);
            if (depth == HeuristicValues.MaxDepth) await BroadcastSelect(values.Move.Tile);

            var score = nextScore;
            if (nextScore < HeuristicValues.ScoreMax)
                score += -(await Run(values.Move, depth - 1)).Score / (HeuristicValues.MaxDepth - depth + 1);

            _hive.RevertMove();

            if (score >= bestScore) (best, bestScore) = (values.Move, score);

        }

        if (depth == HeuristicValues.MaxDepth) await BroadcastDeselect();

        return new(best, bestScore);
    }

    private async ValueTask BroadcastSelect(Tile tile)
    {
        if (_broadcastThought == null || _lastBroadcast?.Id == tile.Id) return;
        await BroadcastDeselect();
        await _broadcastThought("select", tile).ConfigureAwait(false);

        _lastBroadcast = tile;
    }

    private async ValueTask BroadcastDeselect()
    {
        if (_broadcastThought != null && _lastBroadcast != null)
        {
            await _broadcastThought("deselect", _lastBroadcast).ConfigureAwait(false);
            _lastBroadcast = null;
        }
    }

    private GameStatus MakeMove(Move move)
    {
        if (_hive.Cells.FindCellOrDefault(move.Coords) == null)
        {
            _hive.Cells.Add(new(move.Coords));
            move.Tile.Moves.Add(move.Coords);
        }

        var status = _hive.Move(move);

        return status;
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
        return placedTiles.Concat(unplacedTiles);
    }
}