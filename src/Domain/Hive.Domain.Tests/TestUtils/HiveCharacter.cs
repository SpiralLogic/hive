using System;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils
{
    internal record HiveCharacter(string Name, char Symbol, ConsoleColor Color)
    {

        internal readonly Creature Creature = Creatures.Queen with {Name = Name};

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
}
