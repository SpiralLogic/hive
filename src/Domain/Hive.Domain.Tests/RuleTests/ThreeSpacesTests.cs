using Hive.Domain.Rules;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.RuleTests
{
    public class ThreeSpacesTests
    {
        [Fact]
        public void Moves3PlacesWithoutBacktracking()
        {

            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⏣ ⏣ ⬡ ";
            initial += "⬡ ⏣ ★ ⬢ ⬡";
            initial += " ⬡ ⏣ ⬡ ⏣ ";
            initial += "⬡ ⏣ ⬡ ⏣ ⬡";
            initial += " ⬡ ⏣ ⬡ ⏣";

            var expected = new ExpectedHiveBuilder();

            expected += " ⬡ ⏣ ⏣ ⬡ ";
            expected += "⬡ ⏣ ★ ⬢ ⬡";
            expected += " ⬡ ⏣ ⬡ ⏣ ";
            expected += "⬡ ⏣ ⬡ ⏣ ⬡";
            expected += " ⬡ ⏣ ✔ ⏣";

            var rule = new ThreeSpaces();

            rule.Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void Moves3Places()
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

            var expected = new ExpectedHiveBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ✔ ✔ ✔ ✔ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ✔ ✔ ✔ ✔ ✔ ⬡ ⬡ ";
            expected += "⬡ ⬡ ✔ ✔ ✔ ✔ ✔ ✔ ⬡ ⬡";
            expected += " ⬡ ✔ ✔ ✔ ★ ✔ ✔ ✔ ⬡ ";
            expected += "⬡ ⬡ ✔ ✔ ✔ ✔ ✔ ✔ ⬡ ⬡";
            expected += " ⬡ ⬡ ✔ ✔ ✔ ✔ ✔ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ✔ ✔ ✔ ✔ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var rule = new ThreeSpaces();

            rule.Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void Moves3EmptyPlaces()
        {

            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⏣ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⏣ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⏣ ⬡ ★ ⏣ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⏣ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⏣ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⏣ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedHiveBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ✔ ✔ ✔ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ✔ ✔ ✔ ✔ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ✔ ⬡ ⬡ ⬡ ✔ ✔ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ★ ⬡ ✔ ⬡ ⬡ ";
            expected += "⬡ ⬡ ✔ ⬡ ⬡ ⬡ ✔ ✔ ⬡ ⬡";
            expected += " ⬡ ⬡ ✔ ✔ ✔ ✔ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ✔ ✔ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var rule = new ThreeSpaces();

            rule.Should().HaveMoves(initial, expected);
        }
    }
}