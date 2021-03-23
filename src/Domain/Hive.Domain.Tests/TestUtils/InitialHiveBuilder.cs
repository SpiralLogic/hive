using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils
{
    internal class InitialHiveBuilder : HiveBuilder
    {
        public static InitialHiveBuilder operator +(InitialHiveBuilder builder, string newRow) =>
            AddRow(builder, newRow);

        protected override void ModifyCell(Cell cell, char cellString)
        {
            if (cellString == Friend.Symbol)
            {
                cell.AddTile(new Tile(1, 1, Friend.Creature));
            }
            else if (cellString == Enemy.Symbol)
            {
                cell.AddTile(new Tile(1, 2, Enemy.Creature));
            }
            else
            {
                var symbol = AllSymbols.Single(s => s.Symbol == cellString);
                var playerId = symbol.Symbol.ToString().ToUpper() == symbol.Symbol.ToString() ? 1 : 0;
                cell.AddTile(new Tile(AllCells.Count, playerId, symbol.Creature));
            }
        }
    }
}
