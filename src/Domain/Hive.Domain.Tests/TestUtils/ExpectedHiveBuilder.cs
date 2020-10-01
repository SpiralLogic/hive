using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils
{
    internal class ExpectedHiveBuilder : HiveBuilder
    {
        internal static readonly HiveCharacter Valid = new("Valid", '✔', ConsoleColor.Green);
        internal static readonly HiveCharacter Invalid = new("Invalid", '⨯', ConsoleColor.Red);

        protected HashSet<Cell> ValidCells => AllCells.Where(c => !c.IsEmpty() && c.TopTile().Creature.Name == Valid.Name).ToHashSet();
        protected HashSet<Cell> InvalidCells => AllCells.Where(c => !c.IsEmpty() && c.TopTile().Creature.Name == Invalid.Name).ToHashSet();

        public static ExpectedHiveBuilder operator +(ExpectedHiveBuilder builder, string newRow) => AddRow(builder, newRow);

        internal ISet<Coords> GetValidCoords() => ValidCells.Select(c => c.Coords).ToHashSet();

        internal override void ModifyCell(Cell cell, char cellString)
        {
            if (cellString == Valid.Symbol) cell.AddTile(new Tile(1, 1, Valid.Creature));
            if (cellString == Invalid.Symbol) cell.AddTile(new Tile(1, 2, Invalid.Creature));
        }

        internal string GetDiff(ISet<Coords> actual)
        {
            var invalidCoords = GetValidCoords();
            invalidCoords.SymmetricExceptWith(actual);

            foreach (var coords in invalidCoords)
            {
                var rowSplit = _rowStrings[coords.R].Split(Separator);
                rowSplit[coords.Q] = Invalid.ToString();
                _rowStrings[coords.R] = string.Join(Separator, rowSplit);
            }

            return ToString();
        }

    }
}