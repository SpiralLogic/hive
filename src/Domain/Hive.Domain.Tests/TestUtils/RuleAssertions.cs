using System;
using System.Collections.Generic;
using System.Text;
using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;
using Hive.Domain.Entities;
using Hive.Domain.Rules;

namespace Hive.Domain.Tests.TestUtils
{
    internal static class HiveTestExtensions
    {
        public static RuleAssertions Should(this IRule rule)
            => new(initialHiveBuilder => rule.ApplyRule(initialHiveBuilder.OriginCell, initialHiveBuilder.AllCells));

        public static RuleAssertions Should(this Creature creature)
            => new(initialHiveBuilder =>
            {
                var currentCell = initialHiveBuilder.OriginCell;
                currentCell.RemoveTopTile();
                initialHiveBuilder.OriginCell.AddTile(new Tile(0, 1, Creatures.Queen));
                initialHiveBuilder.AllCells.Add(currentCell);
                return creature.GetAvailableMoves(initialHiveBuilder.OriginCell, initialHiveBuilder.AllCells);
            });
    }

    internal class RuleAssertions : ReferenceTypeAssertions<Func<InitialHiveBuilder, ISet<Coords>>, RuleAssertions>
    {
        protected override string Identifier => "rule";

        public RuleAssertions(Func<InitialHiveBuilder, ISet<Coords>> subject) : base(subject)
        {
        }

        public AndConstraint<RuleAssertions> HaveMoves(InitialHiveBuilder initial, ExpectedHiveBuilder expected)
        {
            var expectedCoords = expected.ExpectedMoves();

            Execute.Assertion.Given(() => Subject(initial))
                .ForCondition(coords => coords.SetEquals(expectedCoords))
                .FailWith("\nResulting moves did not match expected\n\nInitial:\n{1}\n\nActual - Expected:\n{2}\n",
                    _ => initial.OriginCell.Coords,
                    _ => new StringBuilder(initial.ToColoredString()),
                    actual => new StringBuilder(expected.GetDiff(actual)));

            return new AndConstraint<RuleAssertions>(this);
        }

    }
}
