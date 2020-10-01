using System;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils
{
    internal record HiveCharacter(string Name, char Symbol, ConsoleColor Color)
    {
        public override string ToString()
        {
            var color = Color switch
            {
                ConsoleColor.Red => 31,
                ConsoleColor.Green => 32,
                ConsoleColor.Yellow => 33,
                ConsoleColor.Magenta => 35,
                ConsoleColor.White => 37,
                ConsoleColor.Cyan => 36,
                ConsoleColor.Blue => 34,
                _ => 0,
            };

            return $"\u001b[{color}m{Symbol}\u001b[0m";
        }

        internal Creature Creature = Creatures.Queen with { Name = Name };
    }
}