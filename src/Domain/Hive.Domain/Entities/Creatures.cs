using Hive.Domain.Rules;

namespace Hive.Domain.Entities
{
    public static class Creatures
    {
        public static readonly Creature Queen = new("Queen")
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

        public static readonly Creature Beetle = new("Beetle")
        {
            Rules = new IRule[]
            {
                new QueenIsPlaced(),
                new OneSpace(),
                new OneHive(),
                new NeighborsOccupied(),
            }
        };

        public static readonly Creature Grasshopper = new("Grasshopper")
        {
            Rules = new IRule[]
            {
                new NextUnoccupied(),
                new QueenIsPlaced(),
                new OneHive(),
                new NeighborsOccupied(),
            }
        };

        public static readonly Creature Spider = new("Spider")
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

        public static readonly Creature Ant = new("Ant")
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
