using Hive.Domain.Entities;
using System.Collections.Generic;
using Xunit;

namespace Hive.Domain.Tests
{
    public class CellTests
    {
        [Fact]
        public void StartWithNoTiles()
        {
            var cell = new Cell( new Coords(1, 1));

            Assert.Empty(cell.Tiles);
        }
        
        [Fact]
        public void CanStartWithTiles()
        {
            var cell = new Cell(new Coords(1, 1)) { Tiles = new HashSet<Tile> { new Tile(1, 2, "tile1"), new Tile(1, 2, "tile2") } };

            Assert.Equal(2, cell.Tiles.Count);
        }

    }
}
