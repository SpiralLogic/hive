using Hive.Domain.Rules;

namespace Hive.Domain.Entities
{
    public static class Creatures
    {
        public static readonly Creature Queen =
            new Creature("Queen") with
        {
            Rules = new IRule[]
                {
                    new OneSpace(),
                    new IsEmpty(),
                    new CanSlide(),
                    new OneHive(),
                    new NeighborsOccupied(),
                }
        };

        public static readonly Creature Beetle =
            new Creature("Beetle") with
        {
            Rules = new IRule[]
                {
                    new OneSpace(),
                    new QueenIsPlaced(),
                    new OneHive(),
                    new NeighborsOccupied(),
                }
        };

        public static readonly Creature Grasshopper =
            new Creature("Grasshopper") with
        {
            Rules = new IRule[]
                {
                    new NextUnoccupied(),
                    new QueenIsPlaced(),
                    new OneHive(),
                    new NeighborsOccupied(),
                }
        };

        public static readonly Creature Spider =
            new Creature("Spider") with
        {
            Rules = new IRule[]
                {
                    new ThreeSpaces(),
                    new CanSlide(),
                    new QueenIsPlaced(),
                    new OneHive(),
                    new NeighborsOccupied(),
                }
        };

        public static readonly Creature Ant =
            new Creature("Ant") with
        {
            Rules = new IRule[]
                {
                    new CanSlide(),
                    new QueenIsPlaced(),
                    new OneHive(),
                    new NeighborsOccupied(),
                }
        };
    }
}