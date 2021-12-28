using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Ai.Heuristics;

internal class AntPlacement : IHeuristic
{
    public int Get(HeuristicValues values, Move move)
    {
        var ((_, _, creature), _) = move;
        if (creature != Creatures.Ant) return 0;
        if (values.TilesPlaced > 3) return 2 * values.MoveNeighbours.Length;
        return -1;
    }
}
