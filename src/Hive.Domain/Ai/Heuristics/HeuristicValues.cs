using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics;

internal class HeuristicValues : HeuristicValuesBase
{
    internal readonly Cell? MoveFromLocation;
    internal readonly Cell[] MoveNeighbours;
    internal readonly Cell MoveToLocation;    internal readonly List<Cell> MoveFromNeighbours = new();

    internal readonly int TilesPlaced;

    public HeuristicValues(Hive hive, Move move, GameStatus gameStatus) : base(hive, move,gameStatus)
    {
        TilesPlaced = Hive.Cells.WherePlayerOccupies(move.Tile.PlayerId).Count();
        var ( _, coords, _) = Hive.History.Last();
        if (coords != null)
        {
            MoveFromLocation = Hive.Cells.FindCell(coords);
            MoveFromNeighbours = MoveFromLocation.SelectNeighbors(Hive.Cells).WhereOccupied().ToList();
        }

        MoveToLocation = Hive.Cells.FindCell(move.Coords);
        MoveNeighbours = MoveToLocation.SelectNeighbors(Hive.Cells).WhereOccupied().ToArray();
    }
}
