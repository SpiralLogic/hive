using Hive.Domain.Entities;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.CreatureTests
{
    public class AntTests
    {
        [Fact]
        public void HasOneHiveRule()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬢ ⬡ ⬡ ";
            initial += "⬡ ⬡ ★ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬢ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedHiveBuilder();

            expected += "⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ★ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡";

            Creatures.Ant.Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void HasCanSlideRule()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬢ ⬡ ⬢ ⬢ ⬢";
            initial += " ⬢ ⬡ ⬡ ⬢ ⬡";
            initial += "⬢ ⬡ ★ ⬢ ⬢";
            initial += " ⬢ ⬡ ⬡ ⬡ ⬢";
            initial += "⬡ ⬢ ⬢ ⬡ ⬢";
            initial += " ⬡ ⬢ ⬢ ⬢ ⬢";

            var expected = new ExpectedHiveBuilder();

            expected += "⬢ ⬡ ⬢ ⬢ ⬢";
            expected += " ⬢ ✔ ✔ ⬢ ⬡";
            expected += "⬢ ✔ ★ ⬢ ⬢";
            expected += " ⬢ ✔ ✔ ✔ ⬢";
            expected += "⬡ ⬢ ⬢ ✔ ⬢";
            expected += " ⬡ ⬢ ⬢ ⬢ ⬢";

            Creatures.Ant.Should().HaveMoves(initial, expected);
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
            expected += " ✔ ✔ ⬡ ⬡ ";
            expected += "✔ ⬢ ★ ✔ ⬡";
            expected += " ✔ ⬢ ⬢ ✔ ";
            expected += "⬡ ✔ ✔ ✔ ⬡";

            Creatures.Ant.Should().HaveMoves(initial, expected);
        }
    }
}