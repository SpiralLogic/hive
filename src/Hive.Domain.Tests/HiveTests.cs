﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Hive.Domain.Entities;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests;

public class HiveTests
{
    private static readonly string[] PlayerNames = new[]
    {
        "player1", "player2"
    };
    private static readonly string[] SinglePlayerName = new[]
    {
        "player1"
    };

    [Fact]
    public void DoesCreateWithPlayerNames()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );

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
        var hive = HiveFactory.Create(
            SinglePlayerName
        );

        var cell = new Cell(new(q, r));

        hive.Cells.Should().Contain(cell);
    }

    [Fact]
    public void CantCreateWithNulls()
    {
        Assert.Throws<ArgumentNullException>(() => new Hive(new List<Player>(), null!));
        Assert.Throws<ArgumentNullException>(() => new Hive(null!, new HashSet<Cell>()));
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
        var hive = HiveFactory.Create(
            PlayerNames
        );
        var p1Queen = hive.Players.First().Tiles.First(t => t.Creature == Creatures.Queen);
        var p2Queen = hive.Players.Skip(1).First().Tiles.First(t => t.Creature == Creatures.Queen);

        hive.Move(new(p1Queen, new(0, 0)));
        hive.Move(new(p2Queen, new(0, -1)));

        var cell = new Cell(new(q, r));

        hive.Cells.Should().Contain(cell);
    }

    [Fact]
    public void CanMoveFromPlayerTiles()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );
        var player = hive.Players[0];
        var playerTile = player.Tiles.First();

        hive.Move(new(playerTile, playerTile.Moves.First()));

        hive.Cells.Should().Contain(cell => cell.TopTile() == playerTile);
    }

    [Fact]
    public void CanMoveFromAnotherCell()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );
        var player1 = hive.Players[0];
        var player2 = hive.Players[1];
        var player1Tile = player1.Tiles.First();
        var player2Tile = player2.Tiles.First();

        hive.Move(new(player1Tile, player1Tile.Moves.First()));
        hive.Move(new(player2Tile, player2Tile.Moves.First()));

        var fromCell = hive.Cells.First(cell => !cell.IsEmpty());
        var tileToMove = fromCell.TopTile();
        var toCell = hive.Cells.Single(cell => cell.Coords == tileToMove.Moves.First());

        hive.Move(new(tileToMove, toCell.Coords));

        toCell.TopTile().Should().Be(tileToMove);
    }

    [Fact]
    public async Task CanAiMove()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );
        var command = string.Empty;
        Tile? tile = null;

        ValueTask Broadcast(string s, Tile t)
        {
            command = s;
            tile = t;
            return ValueTask.CompletedTask;
        }

        var status = await hive.AiMove(Broadcast);

        status.Should().Be(GameStatus.MoveSuccess);
        command.Should().Be("deselect");
        tile.Should().BeAssignableTo<Tile>().And.NotBeNull();
    }

    [Fact]
    public void OnlyPlayer0CanStart()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );
        var firstPlayer = hive.Players.First();
        var secondPlayer = hive.Players.Skip(1).First();

        var firstPlayerCanMoveFirst = hive.Players.SelectMany(p => p.Tiles)
            .Where(t => t.Moves.Any())
            .Any(t => t.PlayerId == firstPlayer.Id);
        var secondPlayerCanMoveFirst = hive.Players.SelectMany(p => p.Tiles)
            .Where(t => t.Moves.Any())
            .Any(t => t.PlayerId == secondPlayer.Id);

        firstPlayerCanMoveFirst.Should().BeTrue();
        secondPlayerCanMoveFirst.Should().BeFalse();
    }

    [Fact]
    public void AlternatesPlayers()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );
        var firstPlayer = hive.Players.First();
        var firstPlayerTile = firstPlayer.Tiles.First();

        var secondPlayer = hive.Players.Skip(1).First();
        var secondPlayerTile = secondPlayer.Tiles.First();

        hive.Move(new(firstPlayerTile, firstPlayerTile.Moves.First()));

        var secondPlayerCanMoveSecond = hive.Players.SelectMany(p => p.Tiles)
            .Where(t => t.Moves.Any())
            .All(t => t.PlayerId == secondPlayer.Id);
        hive.Move(new(secondPlayerTile, secondPlayerTile.Moves.First()));

        var firstPlayerCanMoveThird = hive.Players.SelectMany(p => p.Tiles)
            .Where(t => t.Moves.Any())
            .All(t => t.PlayerId == firstPlayer.Id);

        secondPlayerCanMoveSecond.Should().BeTrue();
        firstPlayerCanMoveThird.Should().BeTrue();
    }

    [Fact]
    public void CanCreateFromPlayersAndCells()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );
        var players = hive.Players;
        var cells = hive.Cells;

        var hive2 = new Hive(players, cells);

        hive2.Cells.Should().BeSameAs(cells);
        hive2.Players.Should().BeSameAs(players);
    }

    [Fact]
    public void InvalidMovesHaveNoEffect()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );
        hive.Move(new(new(1, 1, Creatures.Grasshopper), new(34, 34))).Should().Be(GameStatus.MoveInvalid);
    }

    [Fact]
    public void QueenMustMoveOnFourth()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );
        var player1 = hive.Players[0];
        var player2 = hive.Players[1];
        var player1Tiles = player1.Tiles.Where(t => t.Creature.Name != Creatures.Queen.Name).Take(3);
        var player2Tiles = player2.Tiles.Where(t => t.Creature.Name != Creatures.Queen.Name).Take(3);
        foreach (var (first, second) in player1Tiles.Zip(player2Tiles))
        {
            hive.Move(new(first, first.Moves.First()));
            hive.Move(new(second, second.Moves.First()));
        }

        hive.Players.SelectMany(p => p.Tiles)
            .Union(hive.Cells.SelectMany(c => c.Tiles))
            .Where(t => t.Moves.Any())
            .Should()
            .OnlyContain(t => t.Creature == Creatures.Queen);
    }

    [Fact]
    public void Player0Wins()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );
        var players = hive.Players;
        var cells = hive.Cells;

        cells.Clear();
        cells.Add(new Cell(new(-1, -1)).AddTile(new(2, 1, Creatures.Ant)));
        cells.Add(new Cell(new(0, -1)).AddTile(new(3, 0, Creatures.Ant)));
        cells.Add(new Cell(new(-1, 0)).AddTile(new(4, 1, Creatures.Ant)));
        cells.Add(new Cell(new(1, 0)).AddTile(new(5, 0, Creatures.Ant)));
        cells.Add(new Cell(new(-1, 1)).AddTile(new(6, 1, Creatures.Ant)));
        cells.Add(new Cell(new(0, 1)).AddTile(new(8, 1, Creatures.Ant)));

        cells.Add(new(new(0, 0)));

        var queen = players.First(p => p.Id == 1).Tiles.First(t => t.Creature == Creatures.Queen);

        var hive2 = HiveFactory.CreateInProgress(
            players,
            cells,
            new List<HistoricalMove>
            {
                new(new(new(9, 0, Creatures.Beetle), new(4, 3)), new(1, 1))
            }
        );
        hive2.Move(new(queen, new(0, 0))).Should().Be(GameStatus.Player0Win);
    }

    [Fact]
    public void Player1Wins()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );
        var players = hive.Players;
        var cells = hive.Cells;

        cells.Clear();
        cells.Add(new Cell(new(-1, -1)).AddTile(new(2, 1, Creatures.Ant)));
        cells.Add(new Cell(new(0, -1)).AddTile(new(3, 0, Creatures.Ant)));
        cells.Add(new Cell(new(-1, 0)).AddTile(new(4, 1, Creatures.Ant)));
        cells.Add(new Cell(new(1, 0)).AddTile(new(5, 0, Creatures.Ant)));
        cells.Add(new Cell(new(-1, 1)).AddTile(new(6, 1, Creatures.Ant)));
        cells.Add(new Cell(new(0, 1)).AddTile(new(8, 1, Creatures.Ant)));

        cells.Add(new(new(0, 0)));

        var queen = players.First(p => p.Id == 0).Tiles.First(t => t.Creature == Creatures.Queen);

        var hive2 = HiveFactory.CreateInProgress(players, cells);
        hive2.Move(new(queen, new(0, 0))).Should().Be(GameStatus.Player1Win);
    }

    [Fact]
    public void Draw()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );
        foreach (var player in hive.Players) player.Tiles.Clear();

        var initial = new InitialHiveBuilder();
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ a a a a ⬡ ⬡";
        initial += "⬡ ⬡ a a q Q a ⬡ ";
        initial += " ⬡ ⬡ a a ⬡ a A ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var hive2 = HiveFactory.CreateInProgress(hive.Players, initial.AllCells);
        var ant = hive2.Cells.First(c => !c.IsEmpty() && c.TopTile().Moves.Count > 0).TopTile();
        var result = hive2.Move(new(ant, new(4, 3)));
        result.Should().Be(GameStatus.Draw);
    }

    [Fact]
    public void MoveAfterGameOverShouldReturnFinishedGame()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );
        var players = hive.Players;
        var cells = hive.Cells;

        cells.Clear();
        cells.Add(new Cell(new(-1, -1)).AddTile(new(2, 1, Creatures.Ant)));
        cells.Add(new Cell(new(0, -1)).AddTile(new(3, 0, Creatures.Ant)));
        cells.Add(new Cell(new(-1, 0)).AddTile(new(4, 1, Creatures.Ant)));
        cells.Add(new Cell(new(1, 0)).AddTile(new(5, 0, Creatures.Ant)));
        cells.Add(new Cell(new(-1, 1)).AddTile(new(6, 1, Creatures.Ant)));
        cells.Add(new Cell(new(0, 1)).AddTile(new(8, 1, Creatures.Ant)));

        cells.Add(new(new(0, 0)));

        var queen = players.First(p => p.Id == 1).Tiles.First(t => t.Creature == Creatures.Queen);

        var hive2 = HiveFactory.CreateInProgress(
            players,
            cells,
            new List<HistoricalMove>
            {
                new(new(new(9, 0, Creatures.Beetle), new(4, 3)), new(1, 1))
            }
        );
        hive2.Move(new(queen, new(0, 0))).Should().Be(GameStatus.Player0Win);
        hive2.Move(new(queen, new(0, 0))).Should().Be(GameStatus.Player0Win);
        hive2.Move(new(queen, new(0, 0))).Should().Be(GameStatus.Player0Win);
    }

    [Fact]
    public void FinishedGamesHaveNoAvailableMoves()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );

        var cells = new HashSet<Cell>
        {
            new Cell(new(-1, -1)).AddTile(new(2, 1, Creatures.Ant)),
            new Cell(new(0, -1)).AddTile(new(3, 0, Creatures.Ant)),
            new Cell(new(-1, 0)).AddTile(new(4, 1, Creatures.Ant)),
            new Cell(new(1, 0)).AddTile(new(5, 0, Creatures.Ant)),
            new Cell(new(-1, 1)).AddTile(new(6, 1, Creatures.Ant)),
            new Cell(new(0, 1)).AddTile(new(8, 1, Creatures.Ant)),
            new(new(0, 0))
        };

        var hiveUnderTest = HiveFactory.CreateInProgress(
            hive.Players,
            cells,
            new List<HistoricalMove>
            {
                new(new(new(9, 0, Creatures.Beetle), new(4, 3)), new(1, 1))
            }
        );
        var players = hiveUnderTest.Players;

        var queen = players.First(p => p.Id == 1).Tiles.First(t => t.Creature == Creatures.Queen);
        var finishedGame = hiveUnderTest.Move(new(queen, new(0, 0)));

        finishedGame.Should().Be(GameStatus.Player0Win);

        var allTilesWithMoves = hive.Cells.SelectMany(c => c.Tiles)
            .Concat(hive.Players.SelectMany(p => p.Tiles))
            .Where(t => t.Moves.Count > 0);

        allTilesWithMoves.Should().BeEmpty();
    }

    [Fact]
    public void TurnIsSkippedIfTheyHaveNoAvailableMoves()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );
        var player1 = hive.Players[0];
        var playerWithNoMoves = hive.Players[1] with
        {
            Tiles = new HashSet<Tile>(), Name = "test player", Id = 1
        };
        hive.Cells.First().AddTile(new(20, 1, Creatures.Ant));
        hive = new(new List<Player>
            {
                player1, playerWithNoMoves
            },
            hive.Cells);

        hive.Move(new(player1.Tiles.First(), new(0, 0)));

        var allTilesWithMoves = hive.Cells.SelectMany(c => c.Tiles)
            .Concat(hive.Players.SelectMany(p => p.Tiles))
            .Where(t => t.Moves.Count > 0)
            .ToList();

        allTilesWithMoves.Should().NotContain(t => t.PlayerId == playerWithNoMoves.Id);
        allTilesWithMoves.Where(t => t.PlayerId == player1.Id).Should().NotBeEmpty();
    }
}