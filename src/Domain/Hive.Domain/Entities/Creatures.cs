using System.Collections.Generic;
using Hive.Domain.Rules;
using Hive.Domain.Rules.Movements;
using Hive.Domain.Rules.Restrictions;

namespace Hive.Domain.Entities
{
    public static class Creatures
    {
        public static readonly Creature Queen =
            new Creature("Queen",
                new [] {new AdjacentCells()},
                new [] {new EmptyCells()}
            );
    }
}
