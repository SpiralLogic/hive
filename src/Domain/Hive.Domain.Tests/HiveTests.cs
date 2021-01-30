using System.Linq;
using FluentAssertions;
using Hive.Domain.Entities;
using Xunit;

namespace Hive.Domain.Tests
{
    public class HiveTests
    {
        [Fact]
        public void DoesCreateWithPlayerNames()
        {
            var hive = new Hive(new[] {"player1", "player2"});

            hive.Players.Should().ContainSingle(p => p.Name == "player1");
            hive.Players.Should().ContainSingle(p => p.Name == "player2");
        }

        [Theory]
        [InlineData(-1, -1)]
        [InlineData(0, -1)]
        [InlineData(-1, 0)]
        [InlineData(1, 0)]
        [InlineData(0, 0)]
        [InlineData(-1, 1)]
        [InlineData(0, 1)]
        public void IsCreatedWithStartingCells(int q, int r)
        {
            var hive = new Hive(new[] {"player1"});

            var cell = new Cell(new Coords(q, r));

            hive.Cells.Should().Contain(cell);
        }

        [Theory]
        [InlineData(0, -2)]
        [InlineData(1, -2)]
        [InlineData(-1, -1)]
        [InlineData(0, -1)]
        [InlineData(1, -1)]
        [InlineData(-1, 0)]
        [InlineData(0, 0)]
        [InlineData(1, 0)]
        [InlineData(-1, 1)]
        [InlineData(0, 1)]
        public void EvenHeightHasCorrectNeighbours(int q, int r)
        {
            var hive = new Hive(new[] {"player1", "player2"});
            var p1Queen = hive.Players.First().Tiles.First(t => t.Creature == Creatures.Queen);
            var p2Queen = hive.Players.Skip(1).First().Tiles.First(t => t.Creature == Creatures.Queen);

            hive.Move(p1Queen.Id, new Coords(0, 0));
            hive.Move(p2Queen.Id, new Coords(0, -1));

            var cell = new Cell(new Coords(q, r));

            hive.Cells.Should().Contain(cell);
        }

        [Fact]
        public void CanMoveFromPlayerTiles()
        {
            var hive = new Hive(new[] {"player1", "player2"});
            var player = hive.Players[0];
            var playerTile = player.Tiles.First();

            hive.Move(playerTile.Id, playerTile.Moves.First());

            hive.Cells.Should().Contain(cell => cell.TopTile() == playerTile);
        }

        [Fact]
        public void CanMoveFromAnotherCell()
        {
            var hive = new Hive(new[] {"player1", "player2"});
            var player1 = hive.Players[0];
            var player2 = hive.Players[1];
            var player1Tile = player1.Tiles.First();
            var player2Tile = player2.Tiles.First();

            hive.Move(player1Tile.Id, player1Tile.Moves.First());
            hive.Move(player2Tile.Id, player2Tile.Moves.First());

            var fromCell = hive.Cells.First(cell => !cell.IsEmpty());
            var tileToMove = fromCell.TopTile();
            var toCell = hive.Cells.Single(cell => cell.Coords == tileToMove.Moves.First());

            hive.Move(tileToMove.Id, toCell.Coords);

            toCell.TopTile().Should().Be(tileToMove);
        }

        [Fact]
        public void AnyPlayerCanStart()
        {
            var hive = new Hive(new[] {"player1", "player2"});
            var firstPlayer = hive.Players.First();
            var secondPlayer = hive.Players.Skip(1).First();

            var firstPlayerCanMoveFirst = hive.Players.SelectMany(p => p.Tiles).Where(t => t.Moves.Any())
                .Any(t => t.PlayerId == firstPlayer.Id);
            var secondPlayerCanMoveFirst = hive.Players.SelectMany(p => p.Tiles).Where(t => t.Moves.Any())
                .Any(t => t.PlayerId == secondPlayer.Id);

            firstPlayerCanMoveFirst.Should().BeTrue();
            secondPlayerCanMoveFirst.Should().BeTrue();
        }

        [Fact]
        public void AlternatesPlayers()
        {
            var hive = new Hive(new[] {"player1", "player2"});
            var firstPlayer = hive.Players.First();
            var firstPlayerTile = firstPlayer.Tiles.First();

            var secondPlayer = hive.Players.Skip(1).First();
            var secondPlayerTile = secondPlayer.Tiles.First();

            hive.Move(firstPlayerTile.Id, firstPlayerTile.Moves.First());

            var secondPlayerCanMoveSecond = hive.Players.SelectMany(p => p.Tiles).Where(t => t.Moves.Any())
                .All(t => t.PlayerId == secondPlayer.Id);
            hive.Move(secondPlayerTile.Id, secondPlayerTile.Moves.First());

            var firstPlayerCanMoveThird = hive.Players.SelectMany(p => p.Tiles).Where(t => t.Moves.Any())
                .All(t => t.PlayerId == firstPlayer.Id);

            secondPlayerCanMoveSecond.Should().BeTrue();
            firstPlayerCanMoveThird.Should().BeTrue();
        }

        [Fact]
        public void CanCreateFromPlayersAndCells()
        {
            var hive = new Hive(new[] {"player1", "player2"});
            var players = hive.Players;
            var cells = hive.Cells;

            var hive2 = new Hive(players, cells);

            hive2.Cells.Should().BeSameAs(cells);
            hive2.Players.Should().BeSameAs(players);
        }

        [Fact]
        public void InvalidMovesHaveNoEffect()
        {
            var hive = new Hive(new[] {"player1", "player2"});
            hive.Move(1,new Coords(34,34)).Should().Be(false);
        }
        
        [Fact]
        public void QueenMustMoveOnFourth()
        {
            var hive = new Hive(new[] {"player1", "player2"});
            var player1 = hive.Players[0];
            var player2 = hive.Players[1];
            var player1Tiles = player1.Tiles.Skip(1).Take(3);
            var player2Tiles = player2.Tiles.Skip(1).Take(3);
            foreach (var z in player1Tiles.Zip(player2Tiles))
            {
                hive.Move(z.First.Id, z.First.Moves.First());
                hive.Move(z.Second.Id, z.Second.Moves.First());
            }

            hive.Players.SelectMany(p => p.Tiles)
                .Union(hive.Cells.SelectMany(c => c.Tiles))
                .Where(t => t.Moves.Any())
                .Select(t => t.Creature)
                .Should()!.BeEquivalentTo(Creatures.Queen);
        }

        [Fact]
        public void GameOver()
        {
            var hive = new Hive(new[] {"player1", "player2"});
            var players = hive.Players;
            var cells = hive.Cells;

            cells.Clear();
            cells.Add(new Cell(new Coords(-1, -1)).AddTile(new Tile(2, 1, Creatures.Ant)));
            cells.Add(new Cell(new Coords(0, -1)).AddTile(new Tile(3, 1, Creatures.Ant)));
            cells.Add(new Cell(new Coords(-1, 0)).AddTile(new Tile(4, 1, Creatures.Ant)));
            cells.Add(new Cell(new Coords(1, 0)).AddTile(new Tile(5, 1, Creatures.Ant)));
            cells.Add(new Cell(new Coords(-1, 1)).AddTile(new Tile(6, 1, Creatures.Ant)));
            cells.Add(new Cell(new Coords(0, 1)).AddTile(new Tile(7, 1, Creatures.Ant)));

            cells.Add(new Cell(new Coords(0, 0)));

            var queen = players.First(p => p.Id != 1).Tiles.First(t => t.Creature == Creatures.Queen);

            var hive2 = new Hive(players, cells);
            hive2.Move(queen.Id, new Coords(0, 0));

            hive2.Cells.Should().NotContain(c => !c.IsEmpty() && c.TopTile().PlayerId == queen.PlayerId);
        }
    }
}
