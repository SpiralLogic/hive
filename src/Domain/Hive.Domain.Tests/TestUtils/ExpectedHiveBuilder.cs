using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils
{
    internal class ExpectedHiveBuilder : HiveBuilder
    {
        internal static Creature Valid = Creatures.Queen with { Name = "✔" };
        internal const string Invalid = "⨯";

        protected HashSet<Cell> ValidCells = new();
        protected HashSet<Cell> InvalidCells = new();

        public static ExpectedHiveBuilder operator +(ExpectedHiveBuilder builder, string newRow) => AddRow(builder, newRow);

        public ISet<Coords> GetValidCoords() => ValidCells.Select(c => c.Coords).ToHashSet();

        internal override void ModifyCell(Cell cell, string cellString)
        {
            if (cellString == Valid.Name) ValidCells.Add(cell);
        }

        internal Actual GetDiff(ISet<Coords> actual)
        {
            return new Actual(this, actual);
        }
        internal class Actual
        {
            private ExpectedHiveBuilder _expected;
            private ISet<Coords> _actual;

            internal Actual(ExpectedHiveBuilder expected, ISet<Coords> actual)
            {
                _expected = expected;
                _actual = actual;
            }

            public override string ToString()
            {
                var actualStrings = new List<string>(_expected._inputStrings);
                var incorrect = _expected.GetValidCoords();
                incorrect.SymmetricExceptWith(_actual);

                foreach (var cell in incorrect)
                {
                    var r = actualStrings[cell.R].Split(Separator);
                    r[cell.Q] = $"{Invalid}";
                    actualStrings[cell.R] = string.Join(Separator, r);
                }
                var final = $"\u001b[0m{string.Join(Environment.NewLine, actualStrings)}";

                return final.Replace(Invalid, $"\u001b[1;91m{Invalid}\u001b[0m")
                    .Replace(Origin.Name, $"\u001b[0;93m{Origin.Name}\u001b[0m")
                    .Replace(Empty.Name, $"\u001b[0;97m{Empty.Name}\u001b[0m")
                    .Replace(Friend.Name, $"\u001b[0;96m{Friend.Name}\u001b[0m")
                    .Replace(Valid.Name, $"\u001b[1;92m{Valid.Name}\u001b[0m");
            }
        }
    }
}