using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils;

internal class ExpectedMovementBuilder : HiveBuilder
{
    private static readonly HiveCharacter Expected = new("Expected", '✔', ConsoleColor.Green);
    private static readonly HiveCharacter Unexpected = new("Unexpected", '⨯', ConsoleColor.Red);

    internal ExpectedMovementBuilder()
    {
        AllSymbols.Add(Expected);
        AllSymbols.Add(Unexpected);
    }

    private IEnumerable<Cell> ExpectedCells =>
        AllCells.Where(c => !c.IsEmpty() && c.TopTile().Creature.Name == Expected.Creature.Name).ToHashSet();

    public static ExpectedMovementBuilder operator +(ExpectedMovementBuilder builder, string newRow)
    {
        return AddRow(builder, newRow);
    }

    internal ISet<Coords> ExpectedMoves()
    {
        return ExpectedCells.Select(c => c.Coords).ToHashSet();
    }

    protected override void ModifyCell(Cell cell, char symbol)
    {
        if (symbol == Expected.Symbol) cell.AddTile(new Tile(1, 1, Expected.Creature));
        if (symbol == Unexpected.Symbol) cell.AddTile(new Tile(1, 2, Unexpected.Creature));
    }

    internal string GetMovementDiff(IEnumerable<Coords> actual)
    {
        var actualRows = new List<string>(RowStrings);
        var unexpected = ExpectedMoves();
        unexpected.SymmetricExceptWith(actual);

        foreach (var coords in unexpected) UpdateCoords(Unexpected.ToString(), coords, actualRows);

        var coloredRows = ToColoredString(ToString()).Split("\n");

        return $"\u001b[37m{string.Join("\n", actualRows.Select((row, i) => row + " | " + coloredRows[i]))}\u001b[0m";
    }
}
