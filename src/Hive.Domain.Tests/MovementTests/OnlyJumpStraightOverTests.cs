using Hive.Domain.Movements;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.MovementTests;

public class OnlyJumpStraightOverTests
{
    [Fact]
    public void CalculatesNextEmpty()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬢ ⬢ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬢ ⬢ ★ ⬢ ⬢ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬢ ⬢ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedMovementBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ✔ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ✔ ⬡ ⬢ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬢ ⬢ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ✔ ⬢ ⬢ ★ ⬢ ⬢ ✔ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬢ ⬢ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ✔ ⬡ ⬢ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ✔ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var move = new OnlyJumpStraightOver();

        move.Should().HaveMoves(initial, expected);
    }

    [Fact]
    public void DoesntIncludeAdjacent()
    {
        var initial = new InitialHiveBuilder();

        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬢ ⬡ ★ ⬡ ⬢ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬡ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var expected = new ExpectedMovementBuilder();

        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬢ ⬡ ★ ⬡ ⬢ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬡ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

        var move = new OnlyJumpStraightOver();

        move.Should().HaveMoves(initial, expected);
    }

    [Fact]
    public void CreatesCellIfTheBoardIsNotLargeEnough()
    {
        var initial = new InitialHiveBuilder();

        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        initial += " ⬡ ⬡ ⬡ ★ ⬢ ⬢ ";
        initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

        var expected = new ExpectedMovementBuilder();

        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
        expected += " ⬡ ⬡ ⬡ ★ ⬢ ⬢ ✔ ";
        expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

        var move = new OnlyJumpStraightOver();

        move.Should().HaveMoves(initial, expected);
    }
}
