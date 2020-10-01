using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;
using Hive.Domain.Entities;
using System.Text;

namespace Hive.Domain.Tests.TestUtils
{
    internal static class RuleExtensions
    {
        public static RuleAssertions Should(this IRule rule) => new RuleAssertions(rule);
    }

    internal class RuleAssertions : ReferenceTypeAssertions<IRule, RuleAssertions>
    {
        protected override string Identifier => "rule";

        public RuleAssertions(IRule subject) : base(subject)
        {
        }

        public AndConstraint<RuleAssertions> CreateMoves(InitialHiveBuilder initial, ExpectedHiveBuilder expected)
        {
            var allCells = initial.AllCells;
            var originCell = initial.OriginCell;
            var expecteCoords = expected.ExpectedMoves();

            Execute.Assertion
                .Given(() => Subject.ApplyRule(originCell, allCells))
                .ForCondition(coords => coords.SetEquals(expecteCoords))
                .FailWith(
                    "\nResulting moves did not match expected\n\nInitial:\n{1}\n\nActual - Expected:\n{2}\n",
                    _ => originCell.Coords, 
                    _ => new StringBuilder(initial.ToColoredString()), 
                    actual => new StringBuilder(expected.GetDiff(actual)));

            return new AndConstraint<RuleAssertions>(this);
        }

    }
}