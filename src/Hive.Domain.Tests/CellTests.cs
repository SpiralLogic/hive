using System;
using System.Linq;
using System.Text.Json;
using FluentAssertions;
using Hive.Domain.Entities;
using Xunit;

namespace Hive.Domain.Tests;

public class CellTests
{
    [Fact]
    public void CanCreate_WithNoTiles()
    {
        var cell = new Cell(new Coords(1, 1));

        cell.Tiles.Should().BeEmpty();
    }

    [Fact]
    public void CanAddTile()
    {
        var cell = new Cell(new Coords(1, 1)).AddTile(new Tile(1, 2, Creatures.Queen)).AddTile(new Tile(1, 2, Creatures.Queen));

        cell.Tiles.Should().HaveCount(2);
    }

    [Fact]
    public void AddTile_AddsToTop()
    {
        var topTile = new Tile(4, 2, Creatures.Queen);
        var cell = new Cell(new Coords(1, 1)).AddTile(new Tile(1, 2, Creatures.Queen))
            .AddTile(new Tile(2, 2, Creatures.Queen))
            .AddTile(new Tile(3, 2, Creatures.Queen))
            .AddTile(topTile);

        cell.Tiles.Peek().Should().BeSameAs(topTile);
    }

    [Fact]
    public void IsEmpty_WithNoTiles()
    {
        var cell = new Cell(new Coords(1, 1));

        cell.IsEmpty().Should().BeTrue();
    }

    [Fact]
    public void IsNotEmpty_WithTiles()
    {
        var cell = new Cell(new Coords(1, 1)).AddTile(new Tile(1, 2, Creatures.Queen));

        cell.IsEmpty().Should().BeFalse();
    }

    [Fact]
    public void CanGetTopTile()
    {
        var topTile = new Tile(1, 2, Creatures.Queen);
        var cell = new Cell(new Coords(1, 1)).AddTile(new Tile(1, 2, Creatures.Queen)).AddTile(topTile);

        cell.TopTile().Should().BeSameAs(topTile);
    }

    [Fact]
    public void RemoveTopTile_ReturnsTile()
    {
        var topTile = new Tile(1, 2, Creatures.Queen);
        var cell = new Cell(new Coords(1, 1)).AddTile(new Tile(1, 2, Creatures.Queen)).AddTile(topTile);

        cell.RemoveTopTile().Should().BeSameAs(topTile);
    }

    [Fact]
    public void RemoveTopTile_RemovesTile()
    {
        var topTile = new Tile(1, 2, Creatures.Queen);
        var cell = new Cell(new Coords(1, 1)).AddTile(new Tile(1, 4, Creatures.Ant)).AddTile(topTile);

        cell.RemoveTopTile();
        cell.Tiles.Should().NotContain(topTile);
    }

    [Fact]
    public void CellsWithSameCoordinatesAreEqual()
    {
        var cell1 = new Cell(new Coords(1, 1));
        var cell2 = new Cell(new Coords(1, 1)).AddTile(new Tile(1, 2, Creatures.Queen));

        cell1.Equals(cell2).Should().BeTrue();
        cell1.Coords.Equals(cell2.Coords).Should().BeTrue();
    }

    [Fact]
    public void CellSetsAreUniqueByCoordinate()
    {
        var cells = new[] { new Cell(new Coords(1, 1)) }.ToHashSet();
        var cellsWithOverlap = new[] { new Cell(new Coords(1, 1)).AddTile(new Tile(1, 2, Creatures.Queen)) }.ToHashSet();

        cells.UnionWith(cellsWithOverlap);
        cells.Should().ContainSingle(c => c.Coords == new Coords(1, 1));
    }

    [Fact]
    public void Equality()
    {
        var cell1 = new Cell(new Coords(1, 1));
        cell1.Equals(new object()).Should().BeFalse();
        cell1.Equals(null).Should().BeFalse();

        IEquatable<Cell> cell2 = new Cell(new Coords(1, 1));
        cell2.Equals(null).Should().BeFalse();
    }

    [Fact]
    public void Serialization()
    {
        var cell = new Cell(new Coords(1, 1)).AddTile(new Tile(1, 2, Creatures.Queen));

        var serialized = JsonSerializer.Serialize(cell);
        JsonSerializer.Deserialize<Cell>(serialized).Should().BeAssignableTo<Cell>();
    }
}
