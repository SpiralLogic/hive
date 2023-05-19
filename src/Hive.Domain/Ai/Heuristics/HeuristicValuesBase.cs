using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics;

internal class HeuristicValuesBase {
    internal const int MaxDepth = 3;
    internal const int ScoreMax = 100;
    protected readonly Hive Hive;
    internal readonly GameStatus GameStatus;
    internal readonly Move Move;
    internal readonly int OpponentId;

    public HeuristicValuesBase(Hive hive, Move move, GameStatus gameStatus)
    {
        Hive = hive;
        Move = move;
        GameStatus = gameStatus;
        OpponentId = Hive.Players.First(p => p.Id != move.Tile.PlayerId).Id;
        CurrentQueenNeighbours = CountPlayerQueenNeighbours(move.Tile.PlayerId);
        OpponentQueenNeighbours = CountPlayerQueenNeighbours(OpponentId);

    }

    internal int CurrentQueenNeighbours { get; }

    internal int OpponentQueenNeighbours { get; }

    private int CountPlayerQueenNeighbours(int playerId)
    {
        return Hive.Cells.WhereOccupied()
                   .FirstOrDefault(c => c.HasPlayerQueen(playerId))
                   ?.SelectNeighbors(Hive.Cells)
                   .WhereOccupied()
                   .Count() ??
               0;
    }
}
