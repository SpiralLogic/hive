using System.Linq;
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
            if (cellString == Origin.Symbol)
            {
                cell.AddTile(new Tile(TileIdSequence++, 0, Origin.Creature));
            } else if (cellString == Friend.Symbol)
            {
                cell.AddTile(new Tile(TileIdSequence++, 0, Friend.Creature));
            }
            else if (cellString == Enemy.Symbol)
            {
                cell.AddTile(new Tile(TileIdSequence++, 1, Enemy.Creature));
            }
            else
            {
                var (creature, symbol, _) = AllSymbols.Single(s => s.Symbol == cellString);
                var playerId = symbol.ToString().ToUpper() == symbol.ToString() ? 0 : 1;
                cell.AddTile(new Tile(TileIdSequence++, playerId, creature));
            }
        }
    }
}
