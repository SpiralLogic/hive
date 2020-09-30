using Hive.Domain.Rules;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.RuleTests.Movements
{
    public class EmptyCellsTests
    {
        [Fact]
        public void ReturnsAllEmptyCells_WithNoPlacedTiles()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ";
            initial += "⬡ ★ ⬡";
            initial += " ⬡ ⬡ ";

            var expected = new ExpectedHiveBuilder();

            expected += " ✔ ✔ ";
            expected += "✔ ★ ✔";
            expected += " ✔ ✔ ";

            var movement = new OnlyEmptyCells();

            movement.Should().CreateMoves(initial, expected);
        }

        [Fact]
        public void ReturnsAllEmptyCells_WithPlacedTiles()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬢ ⬡ ⬡";
            initial += " ⬡ ⏣ ⬢ ⬢ ";
            initial += "⏣ ⬡ ★ ⬡ ⬢";
            initial += " ⬡ ⬢ ⬢ ⬡ ";
            initial += "⬢ ⬡ ⬢ ⬡ ⬡";

            var expected = new ExpectedHiveBuilder();

            expected += "✔ ✔ ⬢ ✔ ✔";
            expected += " ✔ ⏣ ⬢ ⬢ ";
            expected += "⏣ ✔ ★ ✔ ⬢";
            expected += " ✔ ⬢ ⬢ ✔ ";
            expected += "⬢ ✔ ⬢ ✔ ✔";

            var movement = new OnlyEmptyCells();

            movement.Should().CreateMoves(initial, expected);
        }
    }
}