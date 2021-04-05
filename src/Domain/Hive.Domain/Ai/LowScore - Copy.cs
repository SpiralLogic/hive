using Hive.Domain.Ai.Heuristics;

namespace Hive.Domain.Ai
{
    internal class TopLevel : ISearchCondition
    {

        public bool ShouldSearch(HeuristicValues values)
        {
            return values.Depth == HeuristicValues.MaxDepth;
        }
    }
}
