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
        protected static ISet<HiveCharacter> AllSymbols = new[] { Empty, Origin, Friend, Enemy }.ToHashSet();

        internal readonly HashSet<Cell> AllCells = new();
        protected List<string> RowStrings = new();

        protected static T AddRow<T>(T builder, string rowString) where T : HiveBuilder
        {
            var rowSplit = rowString.Trim().Replace(Separator, "").ToCharArray();
            var q = builder.GetQOffset(rowString);

            foreach (var token in rowSplit)
            {
                if (token == Origin.Symbol)
                {
                    builder.OriginCell = builder.OriginCell with { Coords = new Coords(q++,builder._currentR) };
                    builder.OriginCell.AddTile(new Tile(1, 1, Origin.Creature));
                    continue;
                }

                var cell = new Cell(new Coords(q++, builder._currentR));
                if (token != Empty.Symbol) builder.ModifyCell(cell, token);
                builder.AllCells.Add(cell);
            }

            builder._currentR++;
            builder.RowStrings.Add(rowString);

            return builder;
        }

        private int GetQOffset(string rowString) => rowString.Trim().Length == rowString.Length ? 0 : (_currentR + 1) % 2;
        internal Cell OriginCell { get; private set; } = new(new Coords(0, 0));
        internal string ToColoredString() => AllSymbols.Aggregate(ToString(), (str, row) => str.Replace(row.Symbol.ToString(), row.ToString()));
        internal abstract void ModifyCell(Cell cell, char symbol);
        public override string ToString() => $"\u001b[0m{string.Join("\n", RowStrings)}\u001b[0m";
    }
}