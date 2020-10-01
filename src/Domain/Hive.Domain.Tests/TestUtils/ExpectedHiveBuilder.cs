using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils
{
    internal class ExpectedHiveBuilder : HiveBuilder
    {
        internal static readonly HiveCharacter Expected = new("Expected", '✔', ConsoleColor.Green);
        internal static readonly HiveCharacter Unexpected = new("Unexpected", '⨯', ConsoleColor.Red);

        internal ExpectedHiveBuilder()
        {
            _allSymbols.Add(Expected);
            _allSymbols.Add(Unexpected);
        }

        protected HashSet<Cell> ExpectedCells => AllCells.Where(c => !c.IsEmpty() && c.TopTile().Creature.Name == Expected.Name).ToHashSet();
        protected HashSet<Cell> UnexpecteCells => AllCells.Where(c => !c.IsEmpty() && c.TopTile().Creature.Name == Unexpected.Name).ToHashSet();

        public static ExpectedHiveBuilder operator +(ExpectedHiveBuilder builder, string newRow) => AddRow(builder, newRow);

        internal ISet<Coords> ExpectedMoves() => ExpectedCells.Select(c => c.Coords).ToHashSet();

        internal override void ModifyCell(Cell cell, char cellString)
        {
            if (cellString == Expected.Symbol) cell.AddTile(new Tile(1, 1, Expected.Creature));
            if (cellString == Unexpected.Symbol) cell.AddTile(new Tile(1, 2, Unexpected.Creature));
        }

        internal string GetDiff(ISet<Coords> actual)
        {
            var actualRows = new List<string>(_rowStrings);
            var unexpected = ExpectedMoves();
            unexpected.SymmetricExceptWith(actual);

            foreach (var coords in unexpected)
            {
                var rowSplit = actualRows[coords.R].Split(Separator);
                var q = coords.Q + GetQOffset(_rowStrings[coords.R]);
                rowSplit[q] = Unexpected.ToString();
                actualRows[coords.R] = string.Join(Separator, rowSplit);
            }
            var coloredRows = ToColoredString().Split("\n");

            return $"\u001b[37m{string.Join("\n", actualRows.Select((row, i)=> row + " | " + coloredRows[i]))}\u001b[0m";
        }

        private int GetQOffset(string rowString) => rowString.StartsWith(Separator) ? 1 : 0;
    }
}