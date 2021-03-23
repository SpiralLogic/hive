using System;
using System.Linq;
using System.Text;
using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils
{
    internal class AiAssertions : ReferenceTypeAssertions<Func<Move>, AiAssertions>
    {
        public AiAssertions(Func<Move> subject) : base(subject)
        {
        }

        protected override string Identifier => "Move";

        public AndConstraint<AiAssertions> MatchHive(InitialHiveBuilder initialBuilder, ExpectedAiBuilder expected)
        {
            var expectedMoves = expected.ExpectedMoves();
            var expectedOrigin = initialBuilder.AllCells.First(c => c.Coords == expected.OriginCell.Coords).Tiles.First().Id;

            Execute.Assertion.Given(() => Subject())
                .ForCondition(result => expectedOrigin == result.Tile.Id && expectedMoves.Contains(result.Coords))
                .FailWith("\nResulting " + Identifier + "s did not match expected\n\nInitial:\n{1}\n\nActual - Expected:\n{2}\n",
                    _ => initialBuilder.OriginCell.Coords, _ => new StringBuilder(initialBuilder.ToColoredString()),
                    actual => new StringBuilder(expected.GetMoveDiff(actual)));

            return new AndConstraint<AiAssertions>(this);
        }
    }
}
