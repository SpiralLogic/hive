using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils;

internal class InitialHiveBuilder : HiveBuilder
{
    public static InitialHiveBuilder operator +(InitialHiveBuilder builder, string newRow)
    {
        return AddRow(builder, newRow);
    }

    protected override void ModifyCell(Cell cell, char symbol)
    {
        if (symbol == Origin.Symbol)
        {
            cell.AddTile(new Tile(TileIdSequence++, 0, Origin.Creature));
        } else if (symbol == Friend.Symbol)
        {
            cell.AddTile(new Tile(TileIdSequence++, 0, Friend.Creature));
        }
        else if (symbol == Enemy.Symbol)
        {
            cell.AddTile(new Tile(TileIdSequence++, 1, Enemy.Creature));
        }
        else
        {
            var (creature, cellString, _) = AllSymbols.Single(s => s.Symbol == symbol);
            var playerId = cellString.ToString().ToUpper() == cellString.ToString() ? 0 : 1;
            cell.AddTile(new Tile(TileIdSequence++, playerId, creature));
        }
    }
}