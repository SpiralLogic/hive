using Hive.Domain.Entities;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.CreatureTests
{
    public class SpiderTests
    {
        [Fact]
        public void HasOneHiveRule()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ Q ⬡ ⬡ ";
            initial += "⬡ ⬡ ★ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬢ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedMovementBuilder();

            expected += "⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ Q ⬡ ⬡ ";
            expected += "⬡ ⬡ ★ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬢ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡";

            var spider = Creatures.Spider;

            spider.Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void HasCanSlideRule()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬢ ⬡ ⬢ ⬢ ⬢ ";
            initial += " ⬢ ⬡ ⬡ ⬢ ⬡";
            initial += "⬢ ⬡ ★ Q ⬢ ";
            initial += " ⬢ ⬡ ⬡ ⬡ ⬢";
            initial += "⬡ ⬢ ⬢ ⬡ ⬢ ";
            initial += " ⬡ ⬢ ⬢ ⬢ ⬢";

            var expected = new ExpectedMovementBuilder();

            expected += "⬢ ⬡ ⬢ ⬢ ⬢ ";
            expected += " ⬢ ⬡ ⬡ ⬢ ⬡";
            expected += "⬢ ✔ ★ Q ⬢ ";
            expected += " ⬢ ⬡ ⬡ ✔ ⬢";
            expected += "⬡ ⬢ ⬢ ✔ ⬢ ";
            expected += " ⬡ ⬢ ⬢ ⬢ ⬢";

            var spider = Creatures.Spider;

            spider.Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void HasThreeSpacesRuleRule()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ★ ⬡ ";
            initial += "⬡ ⬡ Q ⬡ ⬡";
            initial += " ⬡ ⬡ ⬢ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedMovementBuilder();

            expected += "⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ★ ⬡ ";
            expected += "⬡ ⬡ Q ⬡ ⬡";
            expected += " ⬡ ✔ ⬢ ⬡ ";
            expected += "⬡ ⬡ ⬡ ✔ ⬡";

            var spider = Creatures.Spider;

            spider.Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void HasNeighborsOccupiedRule()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ Q ★ ⬡ ⬡";
            initial += " ⬡ ⬢ ⬢ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedMovementBuilder();

            expected += "⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ";
            expected += "✔ Q ★ ⬡ ⬡";
            expected += " ⬡ ⬢ ⬢ ⬡ ";
            expected += "⬡ ⬡ ⬡ ✔ ⬡";

            var spider = Creatures.Spider;

            spider.Should().HaveMoves(initial, expected);
        }
    }
}
