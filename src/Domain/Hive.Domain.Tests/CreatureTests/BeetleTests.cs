using Hive.Domain.Entities;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.CreatureTests
{
    public class BeetleTests
    {
        [Fact]
        public void HasOneHiveRule()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬢ ⬡ ⬡ ";
            initial += "⬡ ⬡ ★ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬢ ⬡ ";
            initial += "⏣ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedHiveBuilder();

            expected += "⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ★ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡";

            var beetle = Creatures.Beetle;

            beetle.Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void HasOneSpaceRule()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬢ ⬢ ⬢ ⬡";
            initial += " ⬢ ⬡ ⬡ ⬢ ";
            initial += "⬢ ⬡ ★ ⬡ ⬢";
            initial += " ⬢ ⬢ ⬡ ⬢ ";
            initial += "⬡ ⬢ ⬢ ⬢ ⬡";

            var expected = new ExpectedHiveBuilder();

            expected += "⬡ ⬢ ⬢ ⬢ ⬡";
            expected += " ⬢ ✔ ✔ ⬢ ";
            expected += "⬢ ✔ ★ ✔ ⬢";
            expected += " ⬢ ✔ ✔ ⬢ ";
            expected += "⬡ ⬢ ⬢ ⬢ ⬡";

            var beetle = Creatures.Beetle;

            beetle.Should().HaveMoves(initial, expected);
        }
        [Fact]
        public void HasNeighborsOccupiedRule()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬢ ★ ⬡ ⬡";
            initial += " ⬡ ⬢ ⬢ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedHiveBuilder();

            expected += "⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ✔ ⬡ ⬡ ";
            expected += "⬡ ✔ ★ ✔ ⬡";
            expected += " ⬡ ✔ ✔ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡";

            var beetle = Creatures.Beetle;

            beetle.Should().HaveMoves(initial, expected);
        }
    }
}
