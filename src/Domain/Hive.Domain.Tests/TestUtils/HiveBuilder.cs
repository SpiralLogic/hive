using System.Collections.Generic;
using Hive.Domain.Entities;
using Xunit;
using Xunit.Sdk;

namespace Hive.Domain.Tests.TestUtils
{
    internal abstract class HiveBuilder
    {
        internal const char Separator = ' ';
        internal static Creature Empty = Creatures.Queen with { Name = "⬡" };
        internal static Creature Origin = Creatures.Queen with { Name = "★" };
        internal static Creature Friend = Creatures.Queen with { Name = "⬢" };
        internal static Creature Enemy = Creatures.Queen with { Name = "⏣" };


        protected List<string> _inputStrings = new();
        internal HashSet<Cell> AllCells = new();
        internal Cell OriginCell;
        private int R;

        protected static T AddRow<T>(T builder, string rowString) where T : HiveBuilder
        {
            var rowSplit = rowString.Trim().Split(Separator);
            var q = builder.GetStartingQ(rowString.Trim().Length == rowString.Length);

            foreach (var token in rowSplit)
            {
                var cell = new Cell(new Coords(q, builder.R));

                if (token == Origin.Name)
                {
                    cell.AddTile(new Tile(1, 1, Friend));
                    builder.OriginCell = cell;
                }

                if (token != Empty.Name) builder.ModifyCell(cell, token);

                builder.AllCells.Add(cell);
                q++;
            }

            builder.R++;
            builder._inputStrings.Add(rowString);

            return builder;
        }


        internal abstract void ModifyCell(Cell cell, string cellString);

        protected int GetStartingQ(bool spansWholeRow) => spansWholeRow ? 0 : (R + 1) % 2;

        public override string ToString() => string.Join("\n", _inputStrings);
    }
}