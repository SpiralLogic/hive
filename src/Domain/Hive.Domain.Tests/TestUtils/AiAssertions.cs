using System;
using System.Linq;
using System.Text;
using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;
using Hive.Domain.Entities;

namespace Hive.Domain.Tests.TestUtils
{
    internal class AiAssertions : ReferenceTypeAssertions<Func<InitialHiveBuilder, Move>, AiAssertions>
    {
        public AiAssertions(Func<InitialHiveBuilder, Move> subject) : base(subject)
        {
        }

        protected override string Identifier => "Move";

        public AndConstraint<AiAssertions> MakeMove(InitialHiveBuilder initial, ExpectedAiBuilder expected)
        {
            var expectedMove = expected.ExpectedMove();
            var expectedOrigin = initial.AllCells.First(c => c.Coords == expected.OriginCell.Coords).Tiles.First().Id;

            Execute.Assertion.Given(() => Subject(initial))
                .ForCondition(move => expectedOrigin == move.Tile.Id && move.Coords == expectedMove.Coords)
                .FailWith("\nResulting " + Identifier + "s did not match expected\n\nInitial:\n{1}\n\nActual - Expected:\n{2}\n", _ => initial.OriginCell.Coords, _ => new StringBuilder(initial.ToColoredString()),
                    actual => new StringBuilder(expected.GetMoveDiff(actual)));

            return new AndConstraint<AiAssertions>(this);
        }
    }
}
