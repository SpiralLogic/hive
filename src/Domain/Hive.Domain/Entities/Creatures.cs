using Hive.Domain.Movements;

namespace Hive.Domain.Entities
{
    public static class Creatures
    {
        public static readonly Creature Queen = new("Queen")
        {
            Movements = new IMovement[]
            {
                new IsAdjacent(),
                new IsEmpty(),
                new CanSlideTo(),
                new WontSplitHive(),
                new HasAnyNeighbour()
            }
        };

        public static readonly Creature Beetle = new("Beetle")
        {
            Movements = new IMovement[]
            {
                new HiveHasQueen(),
                new IsAdjacent(),
                new WontSplitHive(),
                new HasAnyNeighbour()
            }
        };

        public static readonly Creature Grasshopper = new("Grasshopper")
        {
            Movements = new IMovement[]
            {
                new OnlyJumpStraightOver(),
                new HiveHasQueen(),
                new WontSplitHive(),
                new HasAnyNeighbour()
            }
        };

        public static readonly Creature Spider = new("Spider")
        {
            Movements = new IMovement[]
            {
                new OnlyThreeSpaces(),
                new CanSlideTo(),
                new HiveHasQueen(),
                new WontSplitHive(),
                new HasAnyNeighbour()
            }
        };

        public static readonly Creature Ant = new("Ant")
        {
            Movements = new IMovement[]
            {
                new CanSlideTo(),
                new HiveHasQueen(),
                new WontSplitHive(),
                new HasAnyNeighbour()
            }
        };
    }
}
