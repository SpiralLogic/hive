using Hive.Domain.Movements;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.MovementTests
{
    public class HasAnyNeighbourTests
    {
        [Fact]
        public void HasAtLeastOneNeighbour()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬢ ★ ⬢ ⬢ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedMovementBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += "⬡ ⬡ ⬡ ✔ ✔ ✔ ✔ ✔ ⬡ ⬡";
            expected += " ⬡ ⬡ ✔ ⬢ ★ ✔ ✔ ✔ ⬡ ";
            expected += "⬡ ⬡ ⬡ ✔ ✔ ✔ ✔ ✔ ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var move = new HasAnyNeighbour();

            move.Should().HaveMoves(initial, expected);
        }
    }
}
