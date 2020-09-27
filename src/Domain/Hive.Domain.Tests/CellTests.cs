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
                .AddTile(new Tile(1, 2, Creatures.Queen))
                .AddTile(new Tile(1, 2, Creatures.Queen));

            Assert.Equal(2, cell.Tiles.Count);
        }

        [Fact]
        public void CellsWithSameCoordinatesAreEqual()
        {
            var cell1 = new Cell(new Coords(1, 1));
            var cell2 = new Cell(new Coords(1, 1))
                .AddTile(new Tile(1, 2, Creatures.Queen));

            Assert.Equal(cell1, cell2);
        }

        [Fact]
        public void UnionOfCells()
        {
            var cell1 = new HashSet<Cell>(new[] {new Cell(new Coords(1, 1))});
            var cell2 = new HashSet<Cell>(new[] {new Cell(new Coords(1, 1)).AddTile(new Tile(1, 2, Creatures.Queen))});

            cell1.UnionWith(cell2);
            Assert.Single(cell1);
        }    
        
        [Fact]
        public void UnionOfCells2()
        {
            var cell1 = new HashSet<Cell>(new[] {new Cell(new Coords(1, 2))});
            var cell2 = new HashSet<Cell>(new[] {new Cell(new Coords(1, 1)).AddTile(new Tile(1, 2, Creatures.Queen))});

            cell1.UnionWith(cell2);
            Assert.Equal(2, cell1.Count);
        }
    }
}