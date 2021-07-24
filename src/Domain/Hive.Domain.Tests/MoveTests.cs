using System;
using FluentAssertions;
using Hive.Domain.Entities;
using Xunit;

namespace Hive.Domain.Tests
{
    public class MoveTests
    {
        [Fact]
        public void Equality()
        {
            var move1 = new Move(new Tile(1, 1, Creatures.Ant),new Coords(1,1));
            var move2 = new Move(new Tile(2, 2, Creatures.Ant),new Coords(1,1));
            move1.Equals(new object()).Should().BeFalse();
            move2.Equals(null).Should().BeFalse();

            move1.Should().BeEquivalentTo(new Move(new Tile(1, 1, Creatures.Ant),new Coords(1,1)));
            move1.Equals(new Move(new Tile(1, 1, Creatures.Ant),new Coords(1,1))).Should().BeTrue();
            move1.Equals(move1).Should().BeTrue();
            IEquatable<Move> move3 = new Move(new Tile(3, 1, Creatures.Ant), new Coords(1, 1));
            move3.Equals(null).Should().BeFalse();
        }

        [Fact]
        public void Hashcode()
        {
            var move1 = new Move(new Tile(1, 1, Creatures.Ant),new Coords(1,1));
            var move2 = new Move(new Tile(1, 1, Creatures.Ant),new Coords(1,1));
            move1.GetHashCode().Should().Be(move2.GetHashCode());
        }
    }
}
