using FluentAssertions;
using Hive.Domain.Entities;
using Xunit;

namespace Hive.Domain.Tests;

public class MoveTests
{
    [Fact]
    public void Equality()
    {
        var move1 = new Move(new(1, 1, Creatures.Ant), new(1, 1));
        move1.Equals(new object()).Should().BeFalse();

        move1.Should().BeEquivalentTo(new Move(new(1, 1, Creatures.Ant), new(1, 1)));
        move1.Equals(new(new(1, 1, Creatures.Ant), new(1, 1))).Should().BeTrue();
        move1.Equals(move1).Should().BeTrue();
        new Move(new(3, 1, Creatures.Ant), new(1, 1)).Equals(null).Should().BeFalse();
    }

    [Fact]
    public void When_SameTileId_DifferentCoords_NotEqual()
    {
        var move1 = new Move(new(1, 1, Creatures.Ant), new(1, 1));
        var move2 = new Move(new(1, 1, Creatures.Ant), new(1, 2));

        move1.Equals(move2).Should().BeFalse();
    }

    [Fact]
    public void When_SameCoords_DifferentTileId_NotEqual()
    {
        var move1 = new Move(new(1, 1, Creatures.Ant), new(1, 1));
        var move2 = new Move(new(2, 1, Creatures.Ant), new(1, 1));

        move1.Equals(move2).Should().BeFalse();
    }

    [Fact]
    public void Hashcode()
    {
        var move1 = new Move(new(1, 1, Creatures.Ant), new(1, 1));
        var move2 = new Move(new(1, 1, Creatures.Ant), new(1, 1));
        move1.GetHashCode().Should().Be(move2.GetHashCode());
    }
}
