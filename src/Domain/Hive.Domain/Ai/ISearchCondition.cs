using Hive.Domain.Ai.Heuristics;

namespace Hive.Domain.Ai
{
    internal interface ISearchCondition
    {
        bool ShouldSearch( HeuristicValues values);
    }
}
