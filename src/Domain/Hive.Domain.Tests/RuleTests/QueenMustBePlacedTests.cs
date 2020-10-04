using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Hive.Domain.Entities;
using Hive.Domain.Rules;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.RuleTests
{
    public class QueenMustBePlacedTests
    {
        [Fact]
        public void CantMoveWithNoQueen()
        {
            var cells = new HashSet<Cell> {
                new Cell(new Coords(1, 1)).AddTile(new Tile(1, 1, Creatures.Beetle)),
                 new Cell(new Coords(1, 2)).AddTile(new Tile(2, 1, Creatures.Beetle)),
                new Cell(new Coords(1, 3)).AddTile(new Tile(3, 1, Creatures.Beetle)),
            };

            var rule = new QueenMustBePlaced();

            rule.ApplyRule(cells.First(), cells).Should().BeEmpty();
        }

        [Fact]
        public void CanMoveWhenQueenIsPlaced()
        {
            var cells = new HashSet<Cell> {
                new Cell(new Coords(1, 1)).AddTile(new Tile(1, 1, Creatures.Beetle)),
                 new Cell(new Coords(1, 2)).AddTile(new Tile(2, 1, Creatures.Beetle)),
                new Cell(new Coords(1, 3)).AddTile(new Tile(3, 1, Creatures.Beetle)),
                new Cell(new Coords(1, 4)).AddTile(new Tile(4, 1, Creatures.Queen)),
            };

            var rule = new QueenMustBePlaced();

            rule.ApplyRule(cells.First(), cells).Should().NotBeEmpty();
        }
    }
}