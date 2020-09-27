using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;
using Xunit;

namespace Hive.Domain.Tests
{
    public class HiveTests
    {
        [Fact]
        public void DoesCreateWithPlayerNames()
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
        public void IsCreatedsWithStartingCells(int q, int r)
        {
            var coords = new Cell(new Coords(q, r));
            var hive = new Hive(new[] {"player1"});

            Assert.Contains(coords, hive.Cells);
        }

        [Fact]
        public void AnyPlayerCanStart()
        {
            var hive = new Hive(new[] {"player1", "player2"});
            var firstPlayer = hive.Players.First();
            var firstPlayerTile = firstPlayer.Tiles.First();
            
            var secondPlayer = hive.Players.Skip(1).First();
            var secondPlayerTile = secondPlayer.Tiles.First();

            var firstPlayerCanMoveFirst = hive.Players.SelectMany(p => p.Tiles).Where(t=>t.Moves.Any()).Any(t => t.PlayerId == firstPlayer.Id);
            var secondPlayerCanMoveFirst = hive.Players.SelectMany(p => p.Tiles).Where(t=>t.Moves.Any()).Any(t => t.PlayerId == secondPlayer.Id);

            Assert.True(firstPlayerCanMoveFirst);
            Assert.True(secondPlayerCanMoveFirst);
        }
        [Fact]
        public void AlternatesPlayers()
        {
            var hive = new Hive(new[] {"player1", "player2"});
            var firstPlayer = hive.Players.First();
            var firstPlayerTile = firstPlayer.Tiles.First();
            
            var secondPlayer = hive.Players.Skip(1).First();
            var secondPlayerTile = secondPlayer.Tiles.First();

            hive.Move(new Move(firstPlayerTile.Id, firstPlayerTile.Moves.First()));
            
            var secondPlayerCanMoveSecond= hive.Players.SelectMany(p => p.Tiles).Where(t=>t.Moves.Any()).All(t => t.PlayerId == secondPlayer.Id);
            hive.Move(new Move(secondPlayerTile.Id, secondPlayerTile.Moves.First()));
            
            var firstPlayerCanMoveThird = hive.Players.SelectMany(p => p.Tiles).Where(t=>t.Moves.Any()).All(t => t.PlayerId == firstPlayer.Id);

            Assert.True(secondPlayerCanMoveSecond);
            Assert.True(firstPlayerCanMoveThird);
        }
    }
}