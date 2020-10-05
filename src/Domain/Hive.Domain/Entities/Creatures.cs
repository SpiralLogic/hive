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
                    new OnlyEmptyCells(),
                    new SlideOnly(),
                    }
            );
        public static readonly Creature Beetle =
        new Creature("Beetle",
            new IRule[] {
                    new AdjacentCells(),
                    new QueenMustBePlaced()
                }
        );
        public static readonly Creature Grasshopper =
        new Creature("Grasshopper",
            new IRule[] {
                    new NextEmpty(),
                    new QueenMustBePlaced(),
                }
        );
        public static readonly Creature Spider =
        new Creature("Spider",
            new IRule[] {
                    new ThreeEmptyCells(),
                    new SlideOnly(),
                    new QueenMustBePlaced(),
                }
        );
        public static readonly Creature Ant =
        new Creature("Ant",
            new IRule[] {
                    new SlideOnly(),
                    new QueenMustBePlaced(),
                }
        );
    }
}
