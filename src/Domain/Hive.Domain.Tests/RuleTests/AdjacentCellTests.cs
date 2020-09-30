using Hive.Domain.Rules;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.RuleTests
{
    public class AdjacentCellTests
    {
        [Fact]
        public void ReturnsAllAdjacentCells()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ";
            initial += "⬡ ★ ⬡";
            initial += " ⬡ ⬡ ";

            var expected = new ExpectedHiveBuilder();

            expected += " ✔ ✔ ";
            expected += "✔ ⬡ ✔";
            expected += " ✔ ✔ ";

            var movement = new AdjacentCells();

            movement.Should().CreateMoves(initial, expected);
        }

        [Fact]
        public void ReturnsOnlyCellsAdjacentToOrigin()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ★ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedHiveBuilder();

            expected += "⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ✔ ✔ ⬡ ";
            expected += "⬡ ✔ ★ ⬡ ⬡";
            expected += " ⬡ ✔ ✔ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡";

            var movement = new AdjacentCells();

            movement.Should().CreateMoves(initial, expected);
        }
    }
}