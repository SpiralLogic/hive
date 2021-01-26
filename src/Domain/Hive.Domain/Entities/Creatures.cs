using Hive.Domain.Movements;

namespace Hive.Domain.Entities
{
    public static class Creatures
    {
        public static readonly Creature Queen = new("Queen")
        {
            Movements = new IMovements[]
            {
                new Adjacent(),
                new Empty(),
                new SlideOnly(),
                new WontSplitHive(),
                new ConnectedToHive(),
            }
        };

        public static readonly Creature Beetle = new("Beetle")
        {
            Movements = new IMovements[]
            {
                new HiveHasQueen(),
                new Adjacent(),
                new WontSplitHive(),
                new ConnectedToHive(),
            }
        };

        public static readonly Creature Grasshopper = new("Grasshopper")
        {
            Movements = new IMovements[]
            {
                new FirstEmptyAlongAxis(),
                new HiveHasQueen(),
                new WontSplitHive(),
                new ConnectedToHive(),
            }
        };

        public static readonly Creature Spider = new("Spider")
        {
            Movements = new IMovements[]
            {
                new ThreeSpaces(),
                new SlideOnly(),
                new HiveHasQueen(),
                new WontSplitHive(),
                new ConnectedToHive(),
            }
        };

        public static readonly Creature Ant = new("Ant")
        {
            Movements = new IMovements[]
            {
                new SlideOnly(),
                new HiveHasQueen(),
                new WontSplitHive(),
                new ConnectedToHive(),
            }
        };
    }
}
