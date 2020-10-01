using System;
using System.Collections.Generic;
using System.Linq;
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
    internal abstract class HiveBuilder
    {
        internal const string Separator = " ";
        internal static readonly HiveCharacter Empty = new("Empty", '⬡', ConsoleColor.Red);
        internal static readonly HiveCharacter Origin = new("Origin", '★', ConsoleColor.Yellow);
        internal static readonly HiveCharacter Friend = new("Cyan", '⬢', ConsoleColor.Cyan);
        internal static readonly HiveCharacter Enemy = new("Enemy", '⏣', ConsoleColor.Magenta);

        private static ISet<HiveCharacter> _allSymbols = new[] { Empty, Origin, Friend, Enemy }.ToHashSet();

        internal readonly HashSet<Cell> AllCells = new();
        internal Cell OriginCell => AllCells.Single(c => !c.IsEmpty() && c.TopTile().Creature.Name == Origin.Name);

        private int _currentR;
        protected List<string> _rowStrings = new();

        protected static T AddRow<T>(T builder, string rowString) where T : HiveBuilder
        {
            var rowSplit = rowString.Trim().Replace(Separator, "").ToCharArray();
            var q = builder.GetStartingQ(rowString);

            foreach (var token in rowSplit)
            {
                var cell = new Cell(new Coords(q, builder._currentR));

                if (token == Origin.Symbol) cell.AddTile(new Tile(1, 1, Origin.Creature));
                if (token != Empty.Symbol) builder.ModifyCell(cell, token);

                builder.AllCells.Add(cell);
                q++;
            }

            builder._currentR++;
            builder._rowStrings.Add(rowString);

            return builder;
        }


        internal abstract void ModifyCell(Cell cell, char symbol);

        protected int GetStartingQ(string rowString) => rowString.Trim().Length == rowString.Length ? 0 : (_currentR + 1) % 2;
        internal string ToColoredString() => _allSymbols.Aggregate(ToString(), (str, row) => str.Replace(row.Symbol.ToString(), row.ToString()));
        public override string ToString() => $"\u001b[0m{string.Join("\n", _rowStrings)}\u001b[0m";
    }
}