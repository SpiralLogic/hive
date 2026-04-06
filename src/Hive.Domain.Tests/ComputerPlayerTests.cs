using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AwesomeAssertions;
using Hive.Domain.Ai;
using Hive.Domain.Entities;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests;

public class ComputerPlayerTests
{
    private static readonly string[] PlayerNames =
    [
        "player1", " player2"
    ];

    [Fact]
    public async Task MovesToEnemyQueen()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ A ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ g ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ q g g Q A ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedAiBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ★ ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ✔ ✔ g ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ✔ q g g Q ★ ⬡ ";
        expected += " ⬡ ✔ ✔ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var hive = HiveFactory.CreateInProgress(
            [
                new Player(0, "P1"), new Player(1, "P1")
            ],
            initial.AllCells
        );

        var player = new ComputerPlayer(hive);
        (await player.GetMove()).Should().MatchHive(initial, expected);
    }

    [Fact]
    public async Task MovesToEnemyQueen2()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ q s s Q A A ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedAiBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ✔ ✔ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ✔ q s s Q A ★ ⬡ ⬡ ";
        expected += " ⬡ ✔ ✔ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var hive = HiveFactory.CreateInProgress(
            [
                new Player(0, "P1"), new Player(1, "P1")
            ],
            initial.AllCells
        );

        var player = new ComputerPlayer(hive);
        (await player.GetMove()).Should().MatchHive(initial, expected);
    }

    [Fact]
    public async Task QueenMovesAway()
    {
        var initial = new InitialHiveBuilder();

        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ S ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ s s s Q ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ s s ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ q ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

        var expected = new ExpectedAiBuilder();
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ S ⬡ ✔ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ s s s ★ ✔ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ s s ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ q ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

        var hive = HiveFactory.CreateInProgress(
            [
                new Player(0, "P1"), new Player(1, "P1")
            ],
            initial.AllCells
        );

        var player = new ComputerPlayer(hive);
        (await player.GetMove()).Should().MatchHive(initial, expected);
    }

    [Fact]
    public async Task MovesBeetleOnTopOfQueen()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ A ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ b ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ g Q b b q B ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedAiBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ A ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ b ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ g Q b b ✔ ★ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var hive = HiveFactory.CreateInProgress(
            [
                new Player(0, "P1"), new Player(1, "P1")
            ],
            initial.AllCells
        );

        var player = new ComputerPlayer(hive);
        (await player.GetMove()).Should().MatchHive(initial, expected);
    }

    [Fact]
    public async Task MovesBeetleOnTopOfQueen2()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ A ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ b ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ g Q b b q B ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedAiBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ A ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ b ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ g Q b b ✔ ★ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var hive = HiveFactory.CreateInProgress(
            [
                new Player(0, "P1"), new Player(1, "P1")
            ],
            initial.AllCells
        );

        var player = new ComputerPlayer(hive);
        (await player.GetMove()).Should().BeetleOnToQueen(initial, expected);
    }

    [Fact]
    public async Task BeetleStaysOnTopOfQueen()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ A ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ s ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ g Q s s s B ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var beetleCell = initial.AllCells.First(c => c.Tiles.Any(t => t.Creature.Name == Creatures.Beetle.Name));
        var (beetle, cellWithoutBeetle) = beetleCell.RemoveTopTile();
        var rebuiltCell = cellWithoutBeetle.AddTile(new(11, 1, Creatures.Queen)).AddTile(beetle);
        initial.AllCells.Remove(beetleCell);
        initial.AllCells.Add(rebuiltCell);

        var expected = new ExpectedAiBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ★ ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ s ⬡ ✔ ✔ ⬡";
        expected += "⬡ g Q s s s B ✔ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ✔ ✔ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var hive = HiveFactory.CreateInProgress(
            [
                new Player(0, "P1"), new Player(1, "P1")
            ],
            initial.AllCells
        );

        var player = new ComputerPlayer(hive);
        (await player.GetMove()).Should().BeetleOnQueen(initial, expected);
    }

    [Fact]
    public async Task MovesToQueenWithPlayerTiles()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ A g ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ s ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ q s s Q G ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedAiBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ A g ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ s ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ✔ q s s Q ★ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var player1 = new Player(0, "P1")
        {
            Tiles = new Tile[]
            {
                new(50, 0, Creatures.Grasshopper)
            }.ToImmutableHashSet()
        };
        var player2 = new Player(1, "P2")
        {
            Tiles = new Tile[]
            {
                new(51, 1, Creatures.Grasshopper)
            }.ToImmutableHashSet()
        };
        var hive = HiveFactory.CreateInProgress(
            [
                player1, player2
            ],
            initial.AllCells
        );
        var player = new ComputerPlayer(hive);
        (await player.GetMove()).Should().MatchHive(initial, expected);
    }

    [Fact]
    public async Task NoMoves()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ A A ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ A a A ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ A A ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

        var hive = HiveFactory.CreateInProgress(
            [
                new Player(0, "P1"), new Player(1, "P1")
            ],
            initial.AllCells
        );
        var player = new ComputerPlayer(hive);
        await Assert.ThrowsAsync<InvalidDataException>(async () => await player.GetMove());
    }

    [Fact]
    public async Task OpponentNoMoves()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ A q A ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

        var expected = new ExpectedAiBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ✔ ⬡ ⬡ ✔ ⬡ ⬡ ";
        expected += " ⬡ ✔ A q A ✔ ⬡ ⬡";
        expected += "⬡ ⬡ ✔ ⬡ ⬡ ✔ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

        var tile = new Tile(50, 0, Creatures.Ant);

        var player1 = new Player(0, "P1")
        {
            Tiles = new[] { tile }.ToImmutableHashSet()
        };
        var hive = HiveFactory.CreateInProgress(
            [
                player1, new Player(1, "P1")
            ],
            initial.AllCells
        );

        foreach (var tileMove in hive.Players.First().Tiles)
        {
            foreach (var coords in tileMove.Moves)
            {
                initial.AddPlayerTrayOriginMove(coords);
                expected.PlayerTrayMoves.Add((coords, tileMove));
            }
        }

        var player = new ComputerPlayer(hive);

        (await player.GetMove()).Should().MatchHive(initial, expected);
    }

    [Fact]
    public async Task NoQueenOrAntFirst()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );

        var player = new ComputerPlayer(hive);
        var move = await player.GetMove();
        Assert.NotEqual(move.Tile.Creature, Creatures.Queen);
    }

    [Fact]
    public async Task AntsArePreferredFromSecondMove()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );

        var p1Queen = hive.Players.First().Tiles.First(t => t.Creature == Creatures.Beetle);
        var p2Queen = hive.Players.Skip(1).First().Tiles.First(t => t.Creature == Creatures.Beetle);

        hive.Move(new(p1Queen, new(0, 0)));
        hive.Move(new(p2Queen, new(0, -1)));

        var player = new ComputerPlayer(hive);
        var move = await player.GetMove();
        Assert.Equal(move.Tile.Creature, Creatures.Ant);
    }

    [Fact]
    public async Task AntsAreScoredHighlyOncePlaced()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ A B a ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ B ⬡ Q ⬡ ⬡";
        initial += "⬡ ⬡ q B B a ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedAiBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ★ B a ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ✔ B ⬡ Q ⬡ ⬡";
        expected += "⬡ ✔ q B B a ⬡ ⬡ ";
        expected += " ⬡ ✔ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var hive = HiveFactory.CreateInProgress(
            [
                new Player(0, "P1"), new Player(1, "P1")
            ],
            initial.AllCells
        );
        var player = new ComputerPlayer(hive);
        (await player.GetMove()).Should().MatchHive(initial, expected);
    }

    [Fact]
    public async Task BeetleStaysOnTopOfQueenPlayer2()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ a ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ S ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ G q S S S b ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var beetleCell = initial.AllCells.First(c => c.Tiles.Any(t => t.Creature.Name == Creatures.Beetle.Name));
        var (beetle, cellWithoutBeetle) = beetleCell.RemoveTopTile();
        var rebuiltCell = cellWithoutBeetle.AddTile(new(11, 0, Creatures.Queen)).AddTile(beetle);
        initial.AllCells.Remove(beetleCell);
        initial.AllCells.Add(rebuiltCell);

        var expected = new ExpectedAiBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ★ ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ S ⬡ ✔ ✔ ⬡";
        expected += "⬡ G q S S S b ✔ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ✔ ✔ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var hive = HiveFactory.CreateInProgress(
            [
                new Player(0, "P1"), new Player(1, "P1")
            ],
            initial.AllCells
        );

        var player = new ComputerPlayer(hive);
        (await player.GetMove()).Should().BeetleOnQueen(initial, expected);
    }

    [Fact]
    public async Task PiecesMoveTowardQueenUnderBeetle()
    {
        var initial = new InitialHiveBuilder();

        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ A g ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ Q s s B ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ G ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var beetleCell = initial.AllCells.First(c => c.Tiles.Any(t => t.Creature.Name == Creatures.Beetle.Name));
        var (beetle, cellWithoutBeetle) = beetleCell.RemoveTopTile();
        var rebuiltCell = cellWithoutBeetle.AddTile(new(13, 1, Creatures.Queen)).AddTile(beetle);
        initial.AllCells.Remove(beetleCell);
        initial.AllCells.Add(rebuiltCell);

        var expected = new ExpectedAiBuilder();

        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ★ g ✔ ⬡ ⬡";
        expected += "⬡ ⬡ Q s s B ✔ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ✔ G ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var hive = HiveFactory.CreateInProgress(
            [
                new Player(0, "P1"), new Player(1, "P1")
            ],
            initial.AllCells
        );
        var player = new ComputerPlayer(hive);
        (await player.GetMove()).Should().MatchHive(initial, expected);
    }

    [Fact]
    public async Task Player0Wins()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ b b g ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ g ⬡ S Q ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ g q S S S b ⬡ ⬡ ";
        initial += " ⬡ ⬡ g g G G ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedAiBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ b b g ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ g ✔ S Q ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ g q S S S b ⬡ ⬡ ";
        expected += " ⬡ ⬡ g g ★ G ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var hive = HiveFactory.CreateInProgress(
            [
                new Player(0, "P1"), new Player(1, "P1")
            ],
            initial.AllCells
        );

        var player = new ComputerPlayer(hive);
        (await player.GetMove()).Should().MatchHive(initial, expected);
    }

    [Fact]
    public async Task DoesntRepeatSameMove()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ b b ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ b q b ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ b Q s s ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ B ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedAiBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ b b ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ b q b ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ b Q s s ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ★ ✔ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var history = new List<HistoricalMove>
        {
            new(new(new(9, 0, Creatures.Beetle), new(4, 3)), new(5, 4)),
            new(new(new(9, 0, Creatures.Beetle), new(5, 3)), new(5, 4)),
            new(new(new(9, 0, Creatures.Beetle), new(4, 4)), new(5, 4)),
            new(new(new(19, 1, Creatures.Beetle), new(1, 4)), new(1, 1)),
        };

        var hive = HiveFactory.CreateInProgress(
            [
                new Player(0, "P1"), new Player(1, "P1")
            ],
            initial.AllCells,
            history
        );

        var player = new ComputerPlayer(hive);
        (await player.GetMove()).Should().MatchHive(initial, expected);
    }

    [Fact]
    public async Task DoesntRepeatLastThreeMovesOnly()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ b b ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ b q b ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ b Q s s ⬡ ⬡ ⬡ ⬡ ";
        initial += " ⬡ ⬡ ⬡ ⬡ B ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedAiBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ b b ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ b q b ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ b Q ✔ s ⬡ ⬡ ⬡ ⬡ ";
        expected += " ⬡ ⬡ ⬡ ⬡ ★ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var history = new List<HistoricalMove>
        {
            new(new(new(9, 1, Creatures.Beetle), new(4, 3)), new(5, 4)),
            new(new(new(9, 1, Creatures.Beetle), new(5, 3)), new(5, 4)),
            new(new(new(9, 1, Creatures.Beetle), new(4, 4)), new(5, 4)),
            new(new(new(9, 1, Creatures.Beetle), new(6, 4)), new(4, 4)),
            new(new(new(19, 1, Creatures.Beetle), new(1, 4)), new(1, 1)),
        };

        var hive = HiveFactory.CreateInProgress(
            [
                new Player(0, "P1"), new Player(1, "P1")
            ],
            initial.AllCells,
            history
        );

        var player = new ComputerPlayer(hive);
        (await player.GetMove()).Should().MatchHive(initial, expected);
    }

    [Fact]
    public async Task TilesUnderConsideration_AreBroadcastWhenSelected()
    {
        var tileBroadcasts = new List<(string type, Tile tile)>();

        var hive = HiveFactory.Create(
            PlayerNames
        );

        var player = new ComputerPlayer(
            hive,
            new(),
            (Func<string, Tile, ValueTask>)((broadcastType, tile) =>
            {
                tileBroadcasts.Add((broadcastType, tile));
                return ValueTask.CompletedTask;
            })
        );

        await player.GetMove();

        foreach (var broadcast in tileBroadcasts.Where(t => t.type == "select"))
        {
            var (_, tile) = broadcast;
            tile.Should().NotBeNull();
        }
    }

    [Fact]
    public async Task TilesUnderConsideration_AreBroadcastWhenDeselected()
    {
        var tileBroadcasts = new List<(string type, Tile tile)>();

        var hive = HiveFactory.Create(
            PlayerNames
        );
        var player = new ComputerPlayer(
            hive,
            new(),
            (Func<string, Tile, ValueTask>)((broadcastType, tile) =>
            {
                tileBroadcasts.Add((broadcastType, tile));
                return ValueTask.CompletedTask;
            })
        );

        await player.GetMove();
        var selectedTile = tileBroadcasts.First(t => t.type == "select").tile;

        tileBroadcasts.Should().Contain(("deselect", selectedTile));
    }

    [Fact]
    public async Task MaxSearchTimeGlobal()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );


        var stopwatch = new Stopwatch();

            DifficultyOptions options = new(150, 10, 10);
            var player = new ComputerPlayer(hive, options);
            stopwatch.Start();
           await player.GetMove();
            stopwatch.Stop();

        stopwatch.ElapsedMilliseconds.Should().BeGreaterThan(40, "The global max search time was reached");
        stopwatch.ElapsedMilliseconds.Should().BeLessThan(1000, "but didn't take ages to return");
    }

    [Fact]
    public async Task MaxSearchTimeLocal()
    {
        var hive = HiveFactory.Create(
            PlayerNames
        );

        DifficultyOptions options = new(1000, 1,100);
        var player = new ComputerPlayer(hive, options);

        var stopwatch = new Stopwatch();
        stopwatch.Start();

        await player.GetMove();
        stopwatch.Stop();

        stopwatch.ElapsedMilliseconds.Should().BeLessThan(1000, "The global max search time wasn't exceeded");
    }

}