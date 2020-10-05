using Hive.Domain.Rules;

namespace Hive.Domain.Entities
{
    public static class Creatures
    {
        public static readonly Creature Queen =
            new Creature("Queen",
                new IRule[]
                {
                    new OnlyOneSpace(),
                    new EmptySpacesOnly(),
                    new SlideOnly(),
                    new OneHive(),
                    new MustTouchAnotherPiece(),
                }
            );

        public static readonly Creature Beetle =
            new Creature("Beetle",
                new IRule[]
                {
                    new OnlyOneSpace(),
                    new QueenIsPlaced(),
                    new OneHive(), 
                    new MustTouchAnotherPiece(),
                }
            );

        public static readonly Creature Grasshopper =
            new Creature("Grasshopper",
                new IRule[]
                {
                    new NextUnoccupied(),
                    new QueenIsPlaced(),
                    new OneHive(), 
                    new MustTouchAnotherPiece(),
                }
            );

        public static readonly Creature Spider =
            new Creature("Spider",
                new IRule[]
                {
                    new ThreeSpaces(),
                    new SlideOnly(),
                    new QueenIsPlaced(),
                    new OneHive(), 
                    new MustTouchAnotherPiece(),
                }
            );

        public static readonly Creature Ant =
            new Creature("Ant",
                new IRule[]
                {
                    new SlideOnly(),
                    new QueenIsPlaced(),
                    new OneHive(), 
                    new MustTouchAnotherPiece(),
                }
            );
    }
}