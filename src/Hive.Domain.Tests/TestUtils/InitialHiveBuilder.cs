using System;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils;

internal sealed class InitialHiveBuilder : HiveBuilder
{
    public static InitialHiveBuilder operator +(InitialHiveBuilder builder, string newRow)
    {
        return AddRow(builder, newRow);
    }

    public void AddPlayerTrayOriginMove(Coords coords)
    {
        AllCells.Add(new(coords));
        OriginCells.Add(new(coords));
    }

    protected override void ModifyCell(Cell cell, char symbol)
    {
        if (symbol == Origin.Symbol)
        {
            cell.AddTile(new(TileIdSequence++, 0, Origin.Creature));
        }
        else if (symbol == Friend.Symbol)
        {
            cell.AddTile(new(TileIdSequence++, 0, Friend.Creature));
        }
        else if (symbol == Enemy.Symbol)
        {
            cell.AddTile(new(TileIdSequence++, 1, Enemy.Creature));
        }
        else
        {
            var (creature, cellString, _) = AllSymbols.Single(s => s.Symbol == symbol);
            var playerId = cellString.ToString().Equals(cellString.ToString().ToUpperInvariant(), StringComparison.Ordinal) ? 0 : 1;
            cell.AddTile(new(TileIdSequence++, playerId, creature));
        }
    }
}
