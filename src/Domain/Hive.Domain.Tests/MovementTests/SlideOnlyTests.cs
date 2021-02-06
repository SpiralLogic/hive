using Hive.Domain.Movements;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.MovementTests
{
    public class SlideOnlyTests
    {
        [Fact]
        public void Moves3PlacesWithoutBacktracking()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬢ ⬢ ⬡ ";
            initial += "⬡ ⬢ ★ ⬢ ⬡";
            initial += " ⬢ ⬡ ⬡ ⬢ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedHiveBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬢ ⬢ ⬡ ";
            expected += "⬡ ⬢ ★ ⬢ ⬡";
            expected += " ⬢ ✔ ✔ ⬢ ";
            expected += "✔ ✔ ✔ ✔ ✔";
            expected += " ✔ ✔ ✔ ✔ ";

            new SlideOnly().Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void Moves3Places()
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

            var expected = new ExpectedHiveBuilder();

            expected += " ⬡ ⬡ ⬡ ⬢ ⬢ ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬢ ✔ ✔ ⬢ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬢ ✔ ✔ ✔ ✔ ⬢ ⬡ ⬡ ";
            expected += "⬡ ⬢ ✔ ✔ ⬢ ✔ ⬢ ⬡ ⬡ ⬡";
            expected += " ⬡ ✔ ✔ ⬢ ★ ✔ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬢ ✔ ✔ ⬢ ⬢ ⬢ ⬡ ⬡ ⬡";
            expected += " ⬡ ✔ ✔ ✔ ✔ ✔ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬢ ⬢ ✔ ✔ ✔ ⬢ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬢ ⬢ ⬢ ⬡ ⬡ ⬡ ";

            new SlideOnly().Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void CanSlideAroundEdges()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬢ ⬢ ⬢ ★ ⬢ ⬢ ⬢ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedHiveBuilder();

            expected += "✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔";
            expected += " ✔ ⬢ ⬢ ⬢ ★ ⬢ ⬢ ⬢ ✔ ";
            expected += "✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔ ✔";
            
            new SlideOnly().Should().HaveMoves(initial, expected);
        }
    }
}