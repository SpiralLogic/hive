using System.Diagnostics;
using Hive.Domain.Ai.Heuristics;

namespace Hive.Domain.Ai
{
    internal class LowScore : ISearchCondition
    {
        private readonly Stopwatch _stopwatch = new Stopwatch();

        internal LowScore()
        {
            _stopwatch.Start();
        }

        public bool ShouldSearch( HeuristicValues values)
        {
            return _stopwatch.Elapsed.Seconds < 3 && values.BestScore <= 0;
        }
    }
}
