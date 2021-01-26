using Hive.Domain.Movements;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.MovementTests
{
    public class AdjacentTests
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
            expected += "✔ ★ ✔";
            expected += " ✔ ✔ ";

            var move = new Adjacent();

            move.Should().HaveMoves(initial, expected);
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
            expected += "⬡ ✔ ★ ✔ ⬡";
            expected += " ⬡ ✔ ✔ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡";

            var move = new Adjacent();

            move.Should().HaveMoves(initial, expected);
        }
    }
}
