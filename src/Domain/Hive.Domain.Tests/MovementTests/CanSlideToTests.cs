using Hive.Domain.Movements;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.MovementTests
{
    public class CanSlideToTests
    {
        [Fact]
        public void CanMoveBySliding()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬢ ⬢ ⬡ ";
            initial += "⬡ ⬢ ★ ⬢ ⬡";
            initial += " ⬢ ⬡ ⬡ ⬢ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedMovementBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬢ ⬢ ⬡ ";
            expected += "⬡ ⬢ ★ ⬢ ⬡";
            expected += " ⬢ ✔ ✔ ⬢ ";
            expected += "✔ ✔ ✔ ✔ ✔";
            expected += " ✔ ✔ ✔ ✔ ";

            new CanSlideTo().Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void DoesntAllowMovesThroughNarrowGaps()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬢ ⬢ ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬢ ⬡ ⬡ ⬢ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬢ ⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ";
            initial += "⬡ ⬢ ⬡ ⬡ ⬢ ⬡ ⬢ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬢ ★ ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬢ ⬡ ⬡ ⬢ ⬢ ⬢ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬢ ⬢ ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬢ ⬢ ⬢ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedMovementBuilder();

            expected += " ⬡ ⬡ ⬡ ⬢ ⬢ ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬢ ✔ ✔ ⬢ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬢ ✔ ✔ ✔ ✔ ⬢ ⬡ ⬡ ";
            expected += "⬡ ⬢ ✔ ✔ ⬢ ✔ ⬢ ⬡ ⬡ ⬡";
            expected += " ⬡ ✔ ✔ ⬢ ★ ✔ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬢ ✔ ✔ ⬢ ⬢ ⬢ ⬡ ⬡ ⬡";
            expected += " ⬡ ✔ ✔ ✔ ✔ ✔ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬢ ⬢ ✔ ✔ ✔ ⬢ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬢ ⬢ ⬢ ⬡ ⬡ ⬡ ";

            new CanSlideTo().Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void CanSlideAroundEdges()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬢ ⬢ ⬢ ★ ⬢ ⬢ ⬢ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedMovementBuilder();

            expected += "✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔";
            expected += " ✔ ⬢ ⬢ ⬢ ★ ⬢ ⬢ ⬢ ✔ ";
            expected += "✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔";

            new CanSlideTo().Should().HaveMoves(initial, expected);
        }
    }
}
