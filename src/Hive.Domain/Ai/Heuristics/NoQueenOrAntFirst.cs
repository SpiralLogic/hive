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
        var ((_, playerId, creature), _) = move;
        var occupied = _hive.Cells.WherePlayerOccupies(playerId).Count();
        if (occupied == 1 && (creature == Creatures.Ant || creature == Creatures.Queen))
            return -HeuristicValues.ScoreMax;
        return 0;
    }
}
