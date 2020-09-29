using FluentAssertions;
using FluentAssertions.Common;
using Hive.Domain.Entities;
using System.Collections.Generic;
using Xunit;

namespace Hive.Domain.Tests
{
    public class CellTests
    {
        [Fact]
        public void CanCreateWithNoTiles()
        {
            var cell = new Cell(new Coords(1, 1));

            cell.Tiles.Should().BeEmpty();
        }

        [Fact]
        public void CanCreateWithTiles()
        {
            var cell = new Cell(new Coords(1, 1))
                .AddTile(new Tile(1, 2, Creatures.Queen))
                .AddTile(new Tile(1, 2, Creatures.Queen));

            cell.Tiles.Should().HaveCount(2);
        }

        [Fact]
        public void CellsWithSameCoordinatesAreEqual()
        {
            var cell1 = new Cell(new Coords(1, 1));
            var cell2 = new Cell(new Coords(1, 1))
                .AddTile(new Tile(1, 2, Creatures.Queen));

            cell1.Should().IsSameOrEqualTo(cell2);
        }

        [Fact]
        public void CellSetsAreUniqueByCoordinate()
        {
            var cells = new HashSet<Cell>(new[] { new Cell(new Coords(1, 1)) });
            var cellsWithOverlap = new HashSet<Cell>(new[] { new Cell(new Coords(1, 1)).AddTile(new Tile(1, 2, Creatures.Queen)) });

            cells.UnionWith(cellsWithOverlap);

            cells.Should().ContainSingle(c=>c.Coords == new Coords(1,1));
        }
    }
}