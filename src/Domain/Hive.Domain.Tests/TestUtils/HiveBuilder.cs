using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils
{
    internal abstract class HiveBuilder
    {
        internal const string Separator = " ";
        internal static readonly HiveCharacter Empty = new("Empty", '⬡', ConsoleColor.White);
        internal static readonly HiveCharacter Origin = new("Origin", '★', ConsoleColor.Yellow);
        internal static readonly HiveCharacter Friend = new("Cyan", '⬢', ConsoleColor.Cyan);
        internal static readonly HiveCharacter Enemy = new("Enemy", '⏣', ConsoleColor.Magenta);

        private int _currentR;
        protected static ISet<HiveCharacter> _allSymbols = new[] { Empty, Origin, Friend, Enemy }.ToHashSet();

        internal readonly HashSet<Cell> AllCells = new();
        protected List<string> _rowStrings = new();

        protected static T AddRow<T>(T builder, string rowString) where T : HiveBuilder
        {
            var rowSplit = rowString.Trim().Replace(Separator, "").ToCharArray();
            var q = builder.GetQOffset(rowString);

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

        private int GetQOffset(string rowString) => rowString.Trim().Length == rowString.Length ? 0 : (_currentR + 1) % 2;
        internal Cell OriginCell => AllCells.Single(c => !c.IsEmpty() && c.TopTile().Creature.Name == Origin.Name);
        internal string ToColoredString() => _allSymbols.Aggregate(ToString(), (str, row) => str.Replace(row.Symbol.ToString(), row.ToString()));
        internal abstract void ModifyCell(Cell cell, char symbol);
        public override string ToString() => $"\u001b[0m{string.Join("\n", _rowStrings)}\u001b[0m";
    }
}