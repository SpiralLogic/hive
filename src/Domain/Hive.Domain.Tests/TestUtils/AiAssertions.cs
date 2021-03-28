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
            var expectedTiles = initialBuilder.AllCells.Where(c => expected.OriginCells.Contains(c)).Select(c => (c.Coords,Tile:c.TopTile())).ToHashSet();

            Execute.Assertion.Given(() => Subject())
                .ForCondition(result => expectedTiles.Any(t => t.Tile.Id == result.Tile.Id) && expectedMoves.Contains(result.Coords))
                .FailWith("\nResulting " + Identifier + "s did not match expected\n\nInitial:\n{1}\n\nActual - Expected:\n{2}\n",
                    _ => initialBuilder.OriginCells.Count,
                    _ => new StringBuilder(initialBuilder.ToColoredString(initialBuilder.ToString())),
                    actual => new StringBuilder(expected.GetMoveDiff(expectedTiles, actual)));

            return new AndConstraint<AiAssertions>(this);
        }
    }

    internal static class AiTestExtensions
    {
        public static AiAssertions Should(this ComputerPlayer computerPlayer)
        {
            return new(() => computerPlayer.GetMove(0, 1));
        }
    }
}
