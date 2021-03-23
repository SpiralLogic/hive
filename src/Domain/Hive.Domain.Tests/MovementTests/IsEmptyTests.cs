using Hive.Domain.Movements;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.MovementTests
{
    public class IsEmptyTests
    {
        [Fact]
        public void AllowsAllEmptyCells_WithNoPlacedTiles()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ";
            initial += "⬡ ★ ⬡";
            initial += " ⬡ ⬡ ";

            var expected = new ExpectedMovementBuilder();

            expected += " ✔ ✔ ";
            expected += "✔ ★ ✔";
            expected += " ✔ ✔ ";

            var move = new IsEmpty();

            move.Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void AllowsAllEmptyCells_WithPlacedTiles()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬢ ⬡ ⬡";
            initial += " ⬡ ⬢ ⬢ ⬢ ";
            initial += "⬡ ⬡ ★ ⬢ ⬢";
            initial += " ⬡ ⬢ ⬢ ⬡ ";
            initial += "⬢ ⬡ ⬢ ⬡ ⬡";

            var expected = new ExpectedMovementBuilder();

            expected += "✔ ✔ ⬢ ✔ ✔";
            expected += " ✔ ⬢ ⬢ ⬢ ";
            expected += "✔ ✔ ★ ⬢ ⬢";
            expected += " ✔ ⬢ ⬢ ✔ ";
            expected += "⬢ ✔ ⬢ ✔ ✔";

            var move = new IsEmpty();

            move.Should().HaveMoves(initial, expected);
        }
    }
}
