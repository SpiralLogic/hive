using Hive.Domain.Movements;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.MovementTests
{
    public class EmptyTests
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

            var move = new Empty();

            move.Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void ReturnsAllEmptyCells_WithPlacedTiles()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬢ ⬡ ⬡";
            initial += " ⬡ ⬢ ⬢ ⬢ ";
            initial += "⬡ ⬡ ★ ⬢ ⬢";
            initial += " ⬡ ⬢ ⬢ ⬡ ";
            initial += "⬢ ⬡ ⬢ ⬡ ⬡";

            var expected = new ExpectedHiveBuilder();

            expected += "✔ ✔ ⬢ ✔ ✔";
            expected += " ✔ ⬢ ⬢ ⬢ ";
            expected += "✔ ✔ ★ ⬢ ⬢";
            expected += " ✔ ⬢ ⬢ ✔ ";
            expected += "⬢ ✔ ⬢ ✔ ✔";

            var move = new Empty();

            move.Should().HaveMoves(initial, expected);
        }
    }
}
