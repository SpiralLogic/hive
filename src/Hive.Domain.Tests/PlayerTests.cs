using System;
using System.Diagnostics.CodeAnalysis;
using FluentAssertions;
using Hive.Domain.Entities;
using Xunit;

namespace Hive.Domain.Tests;

public class PlayerTests
{
    [Fact]
    public void Equality()
    {
        var player1 = new Player(1, "player 1");
        player1.Equals(new object()).Should().BeFalse();

        player1.Should().BeEquivalentTo(new Player(1, "player 1"));
        player1.Equals(new(1, "player 1")).Should().BeTrue();
        player1.Equals(player1).Should().BeTrue();
        new Player(2, "player 2").Equals(null).Should().BeFalse();
    }

    [Fact]
    public void Hashcode()
    {
        var player1 = new Player(1, "player 1");
        var player2 = new Player(1, "player 1");
        player1.GetHashCode().Should().Be(player2.GetHashCode());
    }
}
