using System;
using System.Linq;
using System.Text;
using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils;

internal sealed class AiAssertions(Func<Move> subject, AssertionChain chain)
    : ReferenceTypeAssertions<Func<Move>, AiAssertions>(subject, chain)
{
    private readonly AssertionChain _chain = chain;

    protected override string Identifier => "Move";

    [CustomAssertion]
    public AndConstraint<AiAssertions> MatchHive(InitialHiveBuilder initialBuilder, ExpectedAiBuilder expected)
    {
        var expectedMoves = expected.ExpectedMoves();
        var expectedTiles = initialBuilder.AllCells.Where(c => expected.OriginCells.Contains(c))
            .Select(c => (c.Coords, Tile: c.TopTile()))
            .ToHashSet();
        expectedTiles.UnionWith(expected.PlayerTrayMoves);

        _chain.Given(() => Subject())
            .ForCondition(result => expectedTiles.Any(t => t.Tile.Id == result.Tile.Id) && expectedMoves.Contains(result.Coords))
            .FailWith(
                "\nResulting " + Identifier + "s did not match expected\n\nInitial:\n{1}\n\nActual - Expected:\n{2}\n",
                _ => initialBuilder.OriginCells.Count,
                _ => new StringBuilder(initialBuilder.ToColoredString(initialBuilder.ToString())),
                actual => new StringBuilder(expected.GetMoveDiff(expectedTiles, actual))
            );

        return new(this);
    }

    [CustomAssertion]
    public AndConstraint<AiAssertions> BeetleOnQueen(InitialHiveBuilder initialBuilder, ExpectedAiBuilder expected)
    {
        var queenCell = initialBuilder.AllCells.Where(c => !c.IsEmpty() && c.Tiles.Any(t => t.Creature.Name == Creatures.Queen.Name));
        var beetleCell = initialBuilder.AllCells.Where(c => !c.IsEmpty() && c.Tiles.Any(t => t.Creature.Name == Creatures.Beetle.Name))
            .Select(c => c.TopTile());

        _chain.Given(() => Subject())
            .ForCondition(result => queenCell.All(c => c.Coords != result.Coords) && beetleCell.All(t => t.Id != result.Tile.Id))
            .FailWith(
                "\nResulting " + Identifier + "s did not match expected\n\nInitial:\n{1}\n\nActual - Expected:\n{2}\n",
                _ => initialBuilder.OriginCells.Count,
                _ => new StringBuilder(initialBuilder.ToColoredString(initialBuilder.ToString())),
                actual => new StringBuilder(expected.GetMoveDiff(new(), actual))
            );

        return new(this);
    }

    [CustomAssertion]
    public AndConstraint<AiAssertions> BeetleOnToQueen(InitialHiveBuilder initialBuilder, ExpectedAiBuilder expected)
    {
        var queenCell = initialBuilder.AllCells.Where(c => !c.IsEmpty() && c.Tiles.Any(t => t.Creature.Name == Creatures.Queen.Name));
        var beetleCell = initialBuilder.AllCells.Where(c => !c.IsEmpty() && c.Tiles.Any(t => t.Creature.Name == Creatures.Beetle.Name))
            .Select(c => c.TopTile());

        _chain.Given(() => Subject())
            .ForCondition(result => queenCell.Any(c => c.Coords == result.Coords) && beetleCell.Any(t => t.Id == result.Tile.Id))
            .FailWith(
                "\nResulting " + Identifier + "s did not match expected\n\nInitial:\n{1}\n\nActual - Expected:\n{2}\n",
                _ => initialBuilder.OriginCells.Count,
                _ => new StringBuilder(initialBuilder.ToColoredString(initialBuilder.ToString())),
                actual => new StringBuilder(expected.GetMoveDiff(new(), actual))
            );

        return new(this);
    }
}

internal static class AiTestExtensions
{
    public static AiAssertions Should(this Move move)
    {
        return new(() => move,  AssertionChain.GetOrCreate());
    }
}