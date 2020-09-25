using Hive.Domain.Entities;
using Hive.Domain.Extensions;
using Xunit;

namespace Hive.Domain.Tests
{
    public class HiveTests
    {
        [Fact]
        public void CanCreateWithPlayerNames()
        {
            var hive = new Hive(new[] {"player1", "player2"});

            Assert.Equal("player1", hive.Players.FindPlayerById(0).Name);
            Assert.Equal("player2", hive.Players.FindPlayerById(1).Name);
        }

        [Theory]
        [InlineData(-1, -1)]
        [InlineData(-1, 1)]
        [InlineData(0, 1)]
        [InlineData(0, -1)]
        [InlineData(1, 0)]
        public void CreatesWithStartingCells(int q, int r)
        {
            var coords = new Cell(new Coords(q, r));
            var hive = new Hive(new[] {"player1"});

            Assert.Contains(coords, hive.Cells);
        }
    }
}