using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;
using Hive.Domain.Entities;
using Xunit;
using Xunit.Sdk;

namespace Hive.Domain.Tests.RuleTests
{
    public class HiveBuilder
    {
        private readonly string Separator;
        private readonly string Selected;
        private readonly string Unoccupied;
        private string _inputString = "\n";
        private int R = 0;

        public HashSet<Cell> TargetCells = new();
        public HashSet<Cell> AllCells = new();

        public HiveBuilder(string targetCell = "⬢", string emptyCell = "⬡", string separator = " ")
        {
            Selected = targetCell;
            Unoccupied = emptyCell;
            Separator = separator;
        }

        public static HiveBuilder operator +(HiveBuilder builder, string rowString)
        {
            var rowSplit = rowString.Trim().Split(builder.Separator);
            var q = GetStartingQ(builder, rowString.Trim().Length==rowString.Length);
            
            foreach (var cellString in rowSplit)
            {
                var cell = new Cell(new Coords(q, builder.R));

                if (cellString == builder.Selected)
                {
                    cell.AddTile(new Tile(1, 1, Creatures.Queen));
                    builder.TargetCells.Add(cell);
                };

                builder.AllCells.Add(cell);
                q++;
            }

            builder.R++;
            builder._inputString += rowString + "\n";
            
            return builder;
        }

        private static int GetStartingQ(HiveBuilder builder, bool spansWholeRow)
        {
            return spansWholeRow ? 0 : (builder.R + 1) % 2;
        }

        public Cell GetOriginCell() => TargetCells.Single();

        public ISet<Coords> GetTargetCellCoords() => TargetCells.Select(c => c.Coords).ToHashSet();

        public override string ToString()
        {
            return _inputString;
        }
    }

    internal static class MovementExtensions
    {
        public static MovementAssertions Should(this IMovementRule movement)
        {
            return new MovementAssertions(movement);
        }
    }

    internal class MovementAssertions : ReferenceTypeAssertions<IMovementRule, MovementAssertions>
    {
        protected override string Identifier => "movement";

        public MovementAssertions(IMovementRule subject) : base(subject)
        {
        }

        public AndConstraint<MovementAssertions> CreateMoves(HiveBuilder initial, HiveBuilder expected)
        {
            var originCell = initial.GetOriginCell();
            var allCells = initial.TargetCells;
            var expectedMoves = expected.GetTargetCellCoords();

            Execute.Assertion.Given(() => Subject.GetAvailableMoves(originCell, allCells)).ForCondition(coords => coords.SetEquals(expectedMoves)).FailWith("Origin At:{0}\n\nResulting moves did not match expected:\n{1}\n\nActual:\n{2}", _ => originCell.Coords, _ => expected, actual => actual);

            return new AndConstraint<MovementAssertions>(this);
        }
    }
}
