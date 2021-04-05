using System.Diagnostics;
using Hive.Domain.Ai.Heuristics;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai
{
    internal class QueenSequence : ISearchCondition
    {
        private readonly Stopwatch _stopwatch = new();

        internal QueenSequence()
        {
            _stopwatch.Start();
        }

        public bool ShouldSearch(HeuristicValues values)
        {
            return _stopwatch.Elapsed.Seconds < 5 && HeuristicValues.QueenSearch && values.Move.Tile.IsCreature(Creatures.Beetle);
        }
    }
}
