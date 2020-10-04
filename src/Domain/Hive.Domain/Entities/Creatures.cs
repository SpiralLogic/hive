using System.Collections.Generic;
using Hive.Domain.Rules;

namespace Hive.Domain.Entities
{
    public static class Creatures
    {
        public static readonly Creature Queen =
            new Creature("Queen",
                new IRule[] {
                    new AdjacentCells(),
                    new OnlyEmptyCells()
                    }
            );
        public static readonly Creature Beetle =
        new Creature("Beetle",
            new IRule[] {
                    new AdjacentCells(),
                    new QueenMustBePlaced()
                }
        );
    }
}
