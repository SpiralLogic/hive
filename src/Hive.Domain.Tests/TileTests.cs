using System;
using FluentAssertions;
using Hive.Domain.Entities;
using Xunit;

namespace Hive.Domain.Tests;

public class TileTests
{
    [Fact]
    public void Equality()
    {
        var tile1 = new Tile(1, 1, Creatures.Ant);
        var tile2 = new Tile(2, 2, Creatures.Ant);
        tile1.Equals(new object()).Should().BeFalse();
        tile2.Equals(null).Should().BeFalse();

        tile1.Should().BeEquivalentTo(new Tile(1, 1, Creatures.Ant));
        tile1.Equals(new Tile(1, 1, Creatures.Ant)).Should().BeTrue();
        tile1.Equals(tile1).Should().BeTrue();
        IEquatable<Tile> tile3 = new Tile(3, 1, Creatures.Ant);
        tile3.Equals(null).Should().BeFalse();
    }

    [Fact]
    public void When_SameTileId_DifferentCoords_NotEqual()
    {
        var tile1 = new Tile(1, 1, Creatures.Ant);
        var tile2 = new Tile(1, 2, Creatures.Queen);

        tile1.Equals(tile2).Should().BeFalse();
    }

    [Fact]
    public void Hashcode()
    {
        var tile1 = new Tile(1, 1, Creatures.Ant);
        var tile2 = new Tile(1, 1, Creatures.Ant);
        tile1.GetHashCode().Should().Be(tile2.GetHashCode());
    }
}
