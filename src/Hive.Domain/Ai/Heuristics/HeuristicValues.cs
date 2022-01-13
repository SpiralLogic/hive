using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics;

internal class HeuristicValues
{
    internal const int MaxSearchTime = 7000;
    internal const int MaxDepth = 3;
    internal const int ScoreMax = 100;
    private readonly Hive _hive;
    internal readonly GameStatus GameStatus;
    internal readonly Move Move;
    internal readonly Cell? MoveFromLocation;
    internal readonly List<Cell> MoveFromNeighbours = new();
    internal readonly Cell[] MoveNeighbours;
    internal readonly Cell MoveToLocation;
    internal readonly int OpponentId;
    internal readonly int TilesPlaced;

    public HeuristicValues(Hive hive, Stack<InProgressMove> previousMoves, Move move, GameStatus gameStatus)
    {
        _hive = hive;
        Move = move;
        GameStatus = gameStatus;
        TilesPlaced = _hive.Cells.WherePlayerOccupies(move.Tile.PlayerId).Count();
        var (_, _, coords) = previousMoves.Peek();
        if (coords != null)
        {
            MoveFromLocation = _hive.Cells.FindCell(coords);
            MoveFromNeighbours = MoveFromLocation.SelectNeighbors(_hive.Cells).WhereOccupied().ToList();
        }

        MoveToLocation = _hive.Cells.FindCell(move.Coords);
        OpponentId = _hive.Players.First(p => p.Id != move.Tile.PlayerId).Id;
        MoveNeighbours = MoveToLocation.SelectNeighbors(_hive.Cells).WhereOccupied().ToArray();
        CurrentQueenNeighbours = CountPlayerQueenNeighbours(move.Tile.PlayerId);
        OpponentQueenNeighbours = CountPlayerQueenNeighbours(OpponentId);

    }

    internal int CurrentQueenNeighbours { get; }

    internal int OpponentQueenNeighbours { get; }

    private int CountPlayerQueenNeighbours(int playerId)
    {
        return _hive.Cells.WhereOccupied()
                   .FirstOrDefault(c => c.HasQueen(playerId))
                   ?.SelectNeighbors(_hive.Cells)
                   .WhereOccupied()
                   .Count() ??
               0;
    }
}
