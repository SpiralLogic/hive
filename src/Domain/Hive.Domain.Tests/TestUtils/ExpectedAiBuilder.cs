using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils
{
    internal class ExpectedAiBuilder : HiveBuilder
    {
        private static readonly HiveCharacter Expected = new("Expected", '✔', ConsoleColor.Green);
        private static readonly HiveCharacter Unexpected = new("Unexpected", '⨯', ConsoleColor.Red);

        internal ExpectedAiBuilder()
        {
            AllSymbols.Add(Expected);
            AllSymbols.Add(Unexpected);
        }

        private IEnumerable<Cell> ExpectedCells =>
            AllCells.Where(c => !c.IsEmpty() && c.TopTile().Creature.Name == Expected.Creature.Name).ToHashSet();

        public static ExpectedAiBuilder operator +(ExpectedAiBuilder builder, string newRow)
        {
            return AddRow(builder, newRow);
        }

        internal ISet<Coords> ExpectedMoves()
        {
            return ExpectedCells.Select(c => c.Coords).ToHashSet();
        }

        protected override void ModifyCell(Cell cell, char cellString)
        {
            if (cellString == Expected.Symbol) cell.AddTile(new Tile(1, 2, Expected.Creature));
            if (cellString == Unexpected.Symbol) cell.AddTile(new Tile(1, 2, Unexpected.Creature));
        }

        internal string GetMoveDiff(Move move)
        {
            var actualRows = new List<string>(RowStrings);
            foreach (var cell in ExpectedCells)
            {
                UpdateCoords(Unexpected.ToString(), cell.Coords, actualRows);
            }

            UpdateCoords(Origin.ToString(), OriginCell.Coords, actualRows);
            UpdateCoords(Expected.ToString(), move.Coords, actualRows);

            var coloredRows = ToColoredString().Split("\n");
            var comparison = actualRows.Select((row, i) => $"{row:coloredRows[0].Length+4} | {coloredRows[i]:coloredRows[0].Length+4}");
            return $"\u001b[37m{string.Join("\n", comparison)}\u001b[0m";
        }
    }
}
