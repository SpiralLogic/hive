using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics;

internal class NoQueenOrAntFirst : IHeuristic
{
    private readonly Hive _hive;

    internal NoQueenOrAntFirst(Hive hive)
    {
        _hive = hive;
    }

    public int Get(HeuristicValues values, Move move)
    {
        var occupied = _hive.Cells.WherePlayerOccupies(move.Tile.PlayerId).Count();
        if (occupied == 1 && (move.Tile.Creature == Creatures.Ant || move.Tile.Creature == Creatures.Queen))
            return -HeuristicValues.ScoreMax;
        return 0;
    }
}
