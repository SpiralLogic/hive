using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils;

internal abstract class HiveBuilder
{
    internal const string Separator = " ";
    internal static readonly HiveCharacter Empty = new("Empty", '⬡', ConsoleColor.White);
    internal static readonly HiveCharacter Origin = new("Origin", '★', ConsoleColor.Yellow);
    internal static readonly HiveCharacter Friend = new("Cyan", '⬢', ConsoleColor.Cyan);
    internal static readonly HiveCharacter Enemy = new("Enemy", '⏣', ConsoleColor.Magenta);

    internal readonly HashSet<Cell> AllCells = new();
    internal readonly HashSet<Cell> OriginCells = new();
    protected readonly ISet<HiveCharacter> AllSymbols = new[] {Empty, Origin, Friend, Enemy}.ToHashSet();
    protected readonly List<string> RowStrings = new();

    private int _currentR;
    protected int TileIdSequence;
    private int _rowLength;

    protected HiveBuilder()
    {
        WithCreatureSymbols();
    }

    internal Cell OriginCell => OriginCells.First();

    protected static T AddRow<T>(T builder, string rowString) where T : HiveBuilder
    {
        if (builder._rowLength == 0) builder._rowLength = rowString.Length;
        if (builder._rowLength != rowString.Length) throw new InvalidOperationException("Row lengths are inconsistent");
        var q = builder.GetQOffset(rowString);

        var rowSplit = rowString.Replace(Separator, "").ToCharArray();

        foreach (var token in rowSplit)
        {
            var cell = new Cell(new Coords(q++, builder._currentR));
            if (token == Origin.Symbol) builder.OriginCells.Add(cell);

            if (token != Empty.Symbol) builder.ModifyCell(cell, token);
            builder.AllCells.Add(cell);
        }

        builder._currentR++;
        builder.RowStrings.Add(rowString);

        return builder;
    }

    private int GetQOffset(string rowString)
    {
        return rowString.TrimStart().Length == _rowLength ? 0 : (_currentR + 1) % 2;
    }

    private void WithCreatureSymbols()
    {
        foreach (Creature? creature in typeof(Creatures).GetFields().Select(f => f.GetValue(null)))
        {
            if (creature == null) return;
            var p0Symbol = creature.Name.ToUpperInvariant().First();
            var p1Symbol = creature.Name.ToLowerInvariant().First();

            AllSymbols.Add(new HiveCharacter(creature, p0Symbol, Friend.Color));
            AllSymbols.Add(new HiveCharacter(creature, p1Symbol, Enemy.Color));
        }
    }

    protected void UpdateCoords(string newSymbol, Coords coords, List<string> actualRows)
    {
        var rowSplit = actualRows[coords.R].Split(Separator);
        var qOffset = coords.Q + GetQOffset(RowStrings[coords.R], coords.R);
        rowSplit[qOffset] = newSymbol;
        actualRows[coords.R] = string.Join(Separator, rowSplit);
    }

    private static int GetQOffset(string rowString, int r)
    {
        return rowString.StartsWith(Separator) && r % 2 != 0 ? 1 : 0;
    }

    internal string ToColoredString(string rows)
    {
        return AllSymbols.Aggregate(rows, (str, c) => str.Replace(c.Symbol.ToString(), c.ToString()));
    }

    protected abstract void ModifyCell(Cell cell, char symbol);

    public override string ToString()
    {
        return $"\u001b[0m{string.Join("\n", RowStrings)}\u001b[0m";
    }
}
