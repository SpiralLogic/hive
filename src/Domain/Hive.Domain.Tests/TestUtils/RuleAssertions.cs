using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;
using Hive.Domain.Entities;

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
            var expecteCoords = expected.GetValidCoords();

            Execute.Assertion
                .Given(() => Subject.ApplyRule(originCell, allCells))
                .ForCondition(coords => coords.SetEquals(expecteCoords))
                .FailWith(
                    "Origin At:{0}\n\nResulting moves did not match expected:\n{1}\n\nActual:\n{2}",
                    _ => originCell.Coords, _ => expected, actual => expected.CreateDiff(actual));

            return new AndConstraint<RuleAssertions>(this);
        }

    }
}