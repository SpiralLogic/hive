using Hive.Domain.Movements;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.MovementTests
{
    public class ThreeSpacesTests
    {
        [Fact]
        public void Moves3PlacesWithoutBacktracking()
        {

            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬢ ⬢ ⬡ ";
            initial += "⬡ ⬢ ★ ⬢ ⬡";
            initial += " ⬡ ⬢ ⬡ ⬢ ";
            initial += "⬡ ⬢ ⬡ ⬢ ⬡";
            initial += " ⬡ ⬢ ⬡ ⬢";

            var expected = new ExpectedHiveBuilder();

            expected += " ⬡ ⬢ ⬢ ⬡ ";
            expected += "⬡ ⬢ ★ ⬢ ⬡";
            expected += " ⬡ ⬢ ⬡ ⬢ ";
            expected += "⬡ ⬢ ⬡ ⬢ ⬡";
            expected += " ⬡ ⬢ ✔ ⬢";

            var move = new OnlyThreeSpaces();

            move.Should().HaveMoves(initial, expected);
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
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ★ ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var move = new OnlyThreeSpaces();

            move.Should().HaveMoves(initial, expected);
        }

        [Fact]
        public void Moves3EmptyPlaces()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬢ ⬢ ⬢ ⬢ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬡ ⬢ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬢ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬢ ⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬡";
            initial += " ⬡ ⬢ ⬡ ⬡ ★ ⬢ ⬢ ⬢ ⬡ ";
            initial += "⬡ ⬡ ⬢ ⬢ ⬢ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬢ ⬢ ⬡ ⬡ ⬢ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬢ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬢ ⬢ ⬢ ⬡ ⬡ ";

            var expected = new ExpectedHiveBuilder();

            expected += " ⬡ ⬡ ⬡ ⬢ ⬢ ⬢ ⬢ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬢ ⬡ ⬡ ⬡ ⬢ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬢ ⬡ ✔ ⬢ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬢ ✔ ⬡ ⬡ ⬡ ⬢ ⬡ ⬡";
            expected += " ⬡ ⬢ ⬡ ⬡ ★ ⬢ ⬢ ⬢ ⬡ ";
            expected += "⬡ ⬡ ⬢ ⬢ ⬢ ⬡ ⬡ ✔ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬢ ⬡ ✔ ⬢ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬢ ✔ ⬡ ⬢ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬢ ⬢ ⬢ ⬡ ⬡ ";

            var move = new OnlyThreeSpaces();

            move.Should().HaveMoves(initial, expected);
        }
    }
}
