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

        internal string CreateDiff(ISet<Coords> actual)
        {
            var actualStrings = new List<string>(_inputStrings);
            var incorrect = GetValidCoords();
            incorrect.SymmetricExceptWith(actual);

            foreach (var cell in incorrect)
            {
                var r = actualStrings[cell.R].Split(Separator);
                r[cell.Q] = $"{Invalid}";
                actualStrings[cell.R] = string.Join(Separator, r);
            }

            return string.Join(Environment.NewLine, actualStrings);
        }
    }
}