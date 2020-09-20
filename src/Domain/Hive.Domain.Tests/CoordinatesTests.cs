using Hive.Domain.Entities;
using Xunit;

namespace Hive.Domain.Tests
{
    public class CoordinateTests
    {

        [Fact]
        public void CoordsAreEqual()
        {
            var coord1 = new Coords(1, 1);
            var coord2 = new Coords(1, 1);

            Assert.Equal(coord1, coord2);
        }


        [Fact]
        public void CoordsAreNotEqual()
        {
            var coord1 = new Coords(1, 1);
            var coord2 = new Coords(1, 2);

            Assert.NotEqual(coord1, coord2);
        }

        [Fact]
        public void CoordsAretEqualWith()
        {
            var coord1 = new Coords(1, 1);
            var coord2 = new Coords(1, 2);
            var coord3 = coord2 with { R = 1 };


            Assert.Equal(coord1, coord3);
        }

        [Fact]
        public void CoordsAreNotEqualWith()
        {
            var coord1 = new Coords(1, 1);
            var coord2 = coord1 with { R = 2 };

            Assert.NotEqual(coord1, coord2);
        }
    }
}
