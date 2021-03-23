using System;
using FluentAssertions;
using FluentAssertions.Common;
using Hive.Domain.Entities;
using Xunit;

namespace Hive.Domain.Tests
{
    public class CoordinateTests
    {
        [Fact]
        public void CoordsAreEqual()
        {
            var coords1 = new Coords(1, 1);
            var coords2 = new Coords(1, 1);

            coords1.Should().IsSameOrEqualTo(coords2);
        }

        [Fact]
        public void CoordsAreNotEqual()
        {
            var coords1 = new Coords(1, 1);
            var coords2 = new Coords(1, 2);

            coords1.Should().NotBe(coords2);
        }

        [Fact]
        public void CoordsAreEqualWith()
        {
            var coords1 = new Coords(1, 1);
            var coords2 = new Coords(1, 2);
            var coords3 = coords2 with {R = 1};

            coords1.Should().IsSameOrEqualTo(coords3);
        }

        [Fact]
        public void CoordsAreNotEqualWith()
        {
            var coords1 = new Coords(1, 1);
            var coords2 = coords1 with {R = 2};

            coords1.Should().NotBe(coords2);
        }

        [Fact]
        public void Equality()
        {
            var coords1 = new Coords(1, 1);
            coords1.Should().NotBeNull();
            coords1.Equals(new object()).Should().BeFalse();
            coords1.Equals(null).Should().BeFalse();

            IEquatable<Coords> coords2 = new Coords(2, 2);
            coords2.Equals(null).Should().BeFalse();
        }
    }
}
