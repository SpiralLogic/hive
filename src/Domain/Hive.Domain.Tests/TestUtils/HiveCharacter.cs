using System;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils
{
    internal record HiveCharacter(Creature Creature, char Symbol, ConsoleColor Color)
    {
        public HiveCharacter(string Name, char Symbol, ConsoleColor Color) : this(Creatures.Queen with {Name = Name}, Symbol, Color)
        {

        }

        public override string ToString()
        {
            var color = Color is ConsoleColor.Red ? 31 :
                Color is ConsoleColor.Green ? 32 :
                Color is ConsoleColor.Yellow ? 33 :
                Color is ConsoleColor.Magenta ? 35 :
                Color is ConsoleColor.White ? 37 :
                Color is ConsoleColor.Cyan ? 36 : 0;

            return $"\u001b[{color}m{Symbol}\u001b[0m";
        }
    }

    internal record HiveCreature : HiveCharacter
    {
        public HiveCreature(Creature creature, bool isEnemy) : base(creature,
            isEnemy ? creature.Name.ToLowerInvariant().First() : creature.Name.ToUpperInvariant().First(),
            isEnemy ? ConsoleColor.Magenta : ConsoleColor.Cyan)
        {
        }

        public override string ToString() =>
            base.ToString();
    }
}
