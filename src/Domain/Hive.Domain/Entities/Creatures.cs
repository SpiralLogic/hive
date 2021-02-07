using Hive.Domain.Movements;

namespace Hive.Domain.Entities
{
    public static class Creatures
    {
        public static readonly Creature Queen = new("Queen")
        {
            Movements = new IMovements[]
            {
                new IsAdjacent(),
                new IsEmpty(),
                new CanSlideTo(),
                new WontSplitHive(),
                new HasAnyNeighbour(),
            }
        };

        public static readonly Creature Beetle = new("Beetle")
        {
            Movements = new IMovements[]
            {
                new HiveHasQueen(),
                new IsAdjacent(),
                new WontSplitHive(),
                new HasAnyNeighbour(),
            }
        };

        public static readonly Creature Grasshopper = new("Grasshopper")
        {
            Movements = new IMovements[]
            {
                new OnlyJumpStraightOver(),
                new HiveHasQueen(),
                new WontSplitHive(),
                new HasAnyNeighbour(),
            }
        };

        public static readonly Creature Spider = new("Spider")
        {
            Movements = new IMovements[]
            {
                new OnlyThreeSpaces(),
                new CanSlideTo(),
                new HiveHasQueen(),
                new WontSplitHive(),
                new HasAnyNeighbour(),
            }
        };

        public static readonly Creature Ant = new("Ant")
        {
            Movements = new IMovements[]
            {
                new CanSlideTo(),
                new HiveHasQueen(),
                new WontSplitHive(),
                new HasAnyNeighbour(),
            }
        };
    }
}
