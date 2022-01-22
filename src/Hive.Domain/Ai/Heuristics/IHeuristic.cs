using Hive.Domain.Entities;

namespace Hive.Domain.Ai.Heuristics;

internal interface IHeuristic
{
    int Get(HeuristicValues values, Move move);
}
