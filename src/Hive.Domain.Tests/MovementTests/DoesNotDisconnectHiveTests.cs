using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Movements;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.MovementTests;

public class WontSplitHiveTests
{
    [Fact]
    public void CantDisconnectHive()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬢ ★ ⬢ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedMovementBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬢ ★ ⬢ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var move = new WontSplitHive();

        move.Should().HaveMoves(initial, expected);
    }

    [Fact]
    public void OnlyTwoOccupiedCanMove()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ★ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedMovementBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ✔ ★ ⬡ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ✔ ✔ ✔ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ✔ ✔ ⬡ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        new WontSplitHive().Should().HaveMoves(initial, expected);
    }

    [Fact]
    public void CantDisconnectHive2()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬢ ★ ⬢ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬢ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedMovementBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬢ ★ ⬢ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬢ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        new WontSplitHive().Should().HaveMoves(initial, expected);
    }

    [Fact]
    public void CanConnectHive2()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬢ ⬢ ⬢ ⬢ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬢ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬢ ★ ⬢ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬢ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedMovementBuilder();

        expected += " ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ";
        expected += "✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔";
        expected += " ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ";
        expected += "✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔";
        expected += " ✔ ✔ ✔ ✔ ★ ✔ ✔ ✔ ✔ ";
        expected += "✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔";
        expected += " ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ";
        expected += "✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔";
        expected += " ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ";

        new WontSplitHive().Should().HaveMoves(initial, expected);
    }

    [Fact]
    public void CanConnectHive3()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬢ ⬢ ⬡ ⬢ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬢ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬢ ★ ⬢ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬢ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedMovementBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬢ ⬢ ⬡ ⬢ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬢ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬢ ★ ⬢ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬢ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        new WontSplitHive().Should().HaveMoves(initial, expected);
    }

    [Fact]
    public void CellWithMultipleTilesWontDisconnect()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ★ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var originCell = initial.OriginCells.First();
        var updatedOriginCell = originCell.AddTile(new(0, 0, Creatures.Beetle));
        initial.AllCells.Remove(originCell);
        initial.AllCells.Add(updatedOriginCell);
        initial.OriginCells.Remove(originCell);
        initial.OriginCells.Add(updatedOriginCell);
        var expected = new ExpectedMovementBuilder();

        expected += " ✔ ✔ ✔ ✔ ✔ ";
        expected += "✔ ✔ ✔ ✔ ✔ ✔";
        expected += " ✔ ✔ ★ ✔ ✔ ";
        expected += "✔ ✔ ✔ ✔ ✔ ✔";
        expected += " ✔ ✔ ✔ ✔ ✔ ";

        new WontSplitHive().Should().HaveMoves(initial, expected);
    }

    [Fact]
    public void SingleCellCanMove()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ★ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedMovementBuilder();

        expected += " ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ";
        expected += "✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔";
        expected += " ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ";
        expected += "✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔";
        expected += " ✔ ✔ ✔ ✔ ★ ✔ ✔ ✔ ✔ ";
        expected += "✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔";
        expected += " ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ";
        expected += "✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔";
        expected += " ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ";

        new WontSplitHive().Should().HaveMoves(initial, expected);
    }
}
