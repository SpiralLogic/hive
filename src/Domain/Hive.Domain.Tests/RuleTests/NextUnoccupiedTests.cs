using Hive.Domain.Rules;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.RuleTests
{
    public class NextUnoccupiedTests
    {
        [Fact]
        public void CalculatesNextEmpty()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⏣ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⏣ ⏣ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⏣ ⏣ ★ ⏣ ⏣ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⏣ ⏣ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⏣ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedHiveBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ✔ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ✔ ⬡ ⏣ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⏣ ⏣ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ✔ ⏣ ⏣ ★ ⏣ ⏣ ✔ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⏣ ⏣ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ✔ ⬡ ⏣ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ✔ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var rule = new NextUnoccupied();

            rule.Should().HaveMoves(initial, expected);
        }

            [Fact]
        public void DoesntIncludeAdjacent()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⏣ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⏣ ⬡ ★ ⬡ ⏣ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⏣ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedHiveBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⏣ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⏣ ⬡ ★ ⬡ ⏣ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⏣ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var rule = new NextUnoccupied();

            rule.Should().HaveMoves(initial, expected);
        }
    }
}