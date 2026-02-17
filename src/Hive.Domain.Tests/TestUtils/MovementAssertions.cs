using System;
using System.Collections.Generic;
using System.Text;
using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;
using Hive.Domain.Entities;
using Hive.Domain.Movements;

namespace Hive.Domain.Tests.TestUtils;

internal sealed class MovementAssertions : ReferenceTypeAssertions<Func<InitialHiveBuilder, ISet<Coords>>, MovementAssertions>
{
    private readonly AssertionChain _chain;

    public MovementAssertions(Func<InitialHiveBuilder, ISet<Coords>> subject, AssertionChain chain) : base(subject,chain)
    {
        this._chain = chain;
    }

    protected override string Identifier => "Movements";

    [CustomAssertion]
    public AndConstraint<MovementAssertions> HaveMoves(InitialHiveBuilder initial, ExpectedMovementBuilder expected)
    {
        var expectedCoords = expected.ExpectedMoves();

       _chain.Given(() => Subject(initial))
            .ForCondition(coords => coords.SetEquals(expectedCoords))
            .FailWith(
                "\nResulting " + Identifier + "s did not match expected\n\nInitial:\n{1}\n\nActual - Expected:\n{2}\n",
                _ => initial.OriginCell.Coords,
                _ => new StringBuilder(initial.ToColoredString(initial.ToString())),
                actual => new StringBuilder(expected.GetMovementDiff(actual))
            );

        return new(this);
    }
}

internal static class MovementTestExtensions
{
    public static MovementAssertions Should(this IMovement movement)
    {
        return new(initialHiveBuilder => movement.GetMoves(initialHiveBuilder.OriginCell, new HashSet<Cell>(initialHiveBuilder.AllCells)),  AssertionChain.GetOrCreate());
    }

    public static MovementAssertions Should(this Creature creature)
    {
        return new(
            initialHiveBuilder => creature.GetAvailableMoves(initialHiveBuilder.OriginCell, new HashSet<Cell>(initialHiveBuilder.AllCells)),  AssertionChain.GetOrCreate()
        );
    }
}
