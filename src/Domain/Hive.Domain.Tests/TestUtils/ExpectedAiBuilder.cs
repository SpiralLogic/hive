using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Tests.TestUtils
{
    internal class ExpectedAiBuilder : HiveBuilder
    {
        private static readonly HiveCharacter Expected = new("Expected", '✔', ConsoleColor.Green);
        private static readonly HiveCharacter IncorrectExpected = new("IncorrectExpected", '✓', ConsoleColor.Red);
        private static readonly HiveCharacter AvailableOrigin = new("AvailableOrigin", '☆', ConsoleColor.Green);
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
            if (cellString == Expected.Symbol) cell.AddTile(new Tile(TileIdSequence++, 2, Expected.Creature));
            if (cellString == Unexpected.Symbol) cell.AddTile(new Tile(TileIdSequence++, 2, Unexpected.Creature));
            if (cellString == Origin.Symbol) cell.AddTile(new Tile(TileIdSequence++, 0, Origin.Creature));
        }

        internal string GetMoveDiff(HashSet<(Coords Coords, Tile Tile)> origins, Move move)
        {
            var actualRows = new List<string>(RowStrings);
            foreach (var cell in ExpectedCells) UpdateCoords(Unexpected.ToString(), cell.Coords, actualRows);
            foreach (var cell in OriginCells) UpdateCoords(AvailableOrigin.ToString(), cell.Coords, actualRows);

            UpdateCoords(IncorrectExpected.ToString(), move.Coords, actualRows);
            var origin = origins.FirstOrDefault(o => o.Tile.Id == move.Tile.Id).Coords;
            if (origin != null)
            {
                UpdateCoords(Origin.ToString(),origin ,actualRows);
            }
            var coloredRows = ToColoredString(ToString()).Split("\n");
            var comparison = actualRows.Select((row, i) =>
                $"{ToColoredString(row):coloredRows[0].Length+4} | {coloredRows[i]:coloredRows[0].Length+4}");
            return
                $"Creature:{move.Tile.Creature.Name} - {move.Tile.Id} to coords: {move.Coords.Q}-{move.Coords.R}\n\u001b[37m{string.Join("\n", comparison)}\u001b[0m";
        }
    }
}
