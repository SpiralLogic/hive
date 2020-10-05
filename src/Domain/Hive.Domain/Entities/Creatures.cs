using Hive.Domain.Rules;

namespace Hive.Domain.Entities
{
    public static class Creatures
    {
        public static readonly Creature Queen =
            new Creature("Queen",
                new IRule[]
                {
                    new AdjacentCells(),
                    new OnlyEmptyCells(),
                    new SlideOnly(),
                    new AllCellsConnected(),
                    new NotAllEmptyNeighbours(),
                }
            );

        public static readonly Creature Beetle =
            new Creature("Beetle",
                new IRule[]
                {
                    new AdjacentCells(),
                    new QueenMustBePlaced(),
                    new AllCellsConnected(), 
                    new NotAllEmptyNeighbours(),
                }
            );

        public static readonly Creature Grasshopper =
            new Creature("Grasshopper",
                new IRule[]
                {
                    new NextEmpty(),
                    new QueenMustBePlaced(),
                    new AllCellsConnected(), 
                    new NotAllEmptyNeighbours(),
                }
            );

        public static readonly Creature Spider =
            new Creature("Spider",
                new IRule[]
                {
                    new ThreeEmptyCells(),
                    new SlideOnly(),
                    new QueenMustBePlaced(),
                    new AllCellsConnected(), 
                    new NotAllEmptyNeighbours(),
                }
            );

        public static readonly Creature Ant =
            new Creature("Ant",
                new IRule[]
                {
                    new SlideOnly(),
                    new QueenMustBePlaced(),
                    new AllCellsConnected(), 
                    new NotAllEmptyNeighbours(),
                }
            );
    }
}