using Hive.Domain.Entities;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.CreatureTests
{
    public class GrasshopperTests
    {
        [Fact]
        public void HasOneHiveRule()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⏣ ⬡ ⬡ ";
            initial += "⬡ ⬡ ★ ⬡ ⬡";
            initial += " ⬡ ⬡ ⏣ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedHiveBuilder();

            expected += "⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ★ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡  ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡";

            var grasshopper = Creatures.Grasshopper;

            grasshopper.Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void HasNextUnoccupiedRule()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ★ ⏣ ⏣ ⬡";
            initial += " ⏣ ⏣ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedHiveBuilder();

            expected += "⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ★ ⏣ ⏣ ✔";
            expected += " ⏣ ⏣ ⬡ ⬡ ";
            expected += "✔ ⬡ ✔ ⬡ ⬡";

            var grasshopper = Creatures.Grasshopper;

            grasshopper.Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void HasNeighborsOccupiedRule()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⏣ ★ ⬡ ⬡";
            initial += " ⬡ ⏣ ⏣ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedHiveBuilder();

            expected += "⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ";
            expected += "✔ ⏣ ★ ⬡ ⬡";
            expected += " ⬡ ⏣ ⏣ ⬡ ";
            expected += "⬡ ✔ ⬡ ✔ ⬡";

            var grasshopper = Creatures.Grasshopper;

            grasshopper.Should().HaveMoves(initial, expected);
        }
    }
}
