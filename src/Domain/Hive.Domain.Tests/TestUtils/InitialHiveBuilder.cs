using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils
{
    internal class InitialHiveBuilder : HiveBuilder
    {
        public static InitialHiveBuilder operator +(InitialHiveBuilder builder, string newRow)
        {
            return AddRow(builder, newRow);
        }

        protected override void ModifyCell(Cell cell, char cellString)
        {
            if (cellString == Friend.Symbol) cell.AddTile(new Tile(1, 1, Friend.Creature));
            if (cellString == Enemy.Symbol) cell.AddTile(new Tile(1, 2, Enemy.Creature));
        }
    }
}
