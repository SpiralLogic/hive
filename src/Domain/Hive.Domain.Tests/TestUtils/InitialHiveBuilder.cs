using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils
{
    internal class InitialHiveBuilder : HiveBuilder
    {
        public HashSet<Cell> ValidCells = new();

        public static InitialHiveBuilder operator +(InitialHiveBuilder builder, string newRow) => AddRow(builder, newRow);

        internal override void ModifyCell(Cell cell, string cellString)
        {
            if (cellString == Friend.Name) cell.AddTile(new Tile(1, 1, Friend));
            if (cellString == Enemy.Name) cell.AddTile(new Tile(1, 2, Enemy));
        }
    }
}