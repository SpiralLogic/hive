using Hive.Domain.Entities;

namespace Hive.Domain.Ai.Heuristics;

internal class AntPlacement : IHeuristic
{
    public int Get(HeuristicValues values, Move move)
    {
        if (move.Tile.Creature != Creatures.Ant) return 0;
        if (values.TilesPlaced > 1) return 2 * values.MoveNeighbours.Count;
        return -1;
    }
}
