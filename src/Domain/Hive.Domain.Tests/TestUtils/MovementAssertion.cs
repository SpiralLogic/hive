using System;
using System.Collections.Generic;
using System.Text;
using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils
{

    internal class MovementAssertion : ReferenceTypeAssertions<Func<InitialHiveBuilder, ISet<Coords>>, MovementAssertion>
    {

        public MovementAssertion(Func<InitialHiveBuilder, ISet<Coords>> subject) : base(subject)
        {
        }

        protected override string Identifier => "Movements";

        public AndConstraint<MovementAssertion> HaveMoves(InitialHiveBuilder initial, ExpectedMovementBuilder expected)
        {
            var expectedCoords = expected.ExpectedMoves();

            Execute.Assertion.Given(() => Subject(initial))
                .ForCondition(coords => coords.SetEquals(expectedCoords))
                .FailWith("\nResulting " + Identifier + "s did not match expected\n\nInitial:\n{1}\n\nActual - Expected:\n{2}\n",
                    _ => initial.OriginCell.Coords, _ => new StringBuilder(initial.ToColoredString()),
                    actual => new StringBuilder(expected.GetMovementDiff(actual)));

            return new AndConstraint<MovementAssertion>(this);
        }
    }
}
