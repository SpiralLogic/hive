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

            Assert.Empty(cell.Tiles);
        }

        [Fact]
        public void CanCreateWithTiles()
        {
            var cell = new Cell(new Coords(1, 1))
                {Tiles = new HashSet<Tile> {new Tile(1, 2, "tile1"), new Tile(1, 2, "tile2")}};

            Assert.Equal(2, cell.Tiles.Count);
        }

        [Fact]
        public void CellsWithSameCoordinatesAreEqual()
        {
            var cell1 = new Cell(new Coords(1, 1)) {Tiles = new HashSet<Tile>()};
            var cell2 = new Cell(new Coords(1, 1)) {Tiles = new HashSet<Tile> {new Tile(1, 2, "tile1")}};

            Assert.Equal(cell1, cell2);
        }
    }
}