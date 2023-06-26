using System;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils;

internal sealed record HiveCharacter(Creature Creature, char Symbol, ConsoleColor Color)
{
    public HiveCharacter(string name, char symbol, ConsoleColor color) : this(new Creature(name), symbol, color)
    {
    }

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
            _ => 37
        };

        return $"\u001b[{color}m{Symbol}\u001b[0m";
    }
}
