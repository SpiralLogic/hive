using Hive.Domain.Entities;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.CreatureTests
{
    public class QueenTests
    {
        [Fact]
        public void CanMoveToEmptyAdjacent()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬢ ⬡ ⬡";
            initial += " ⬡ ⬢ ⬢ ⬢ ";
            initial += "⬡ ⬡ ★ ⬢ ⬢";
            initial += " ⬡ ⬡ ⬢ ⬡ ";
            initial += "⬢ ⬢ ⬢ ⬡ ⬡";

            var expected = new ExpectedMovementBuilder();

            expected += "⬡ ⬡ ⬢ ⬡ ⬡";
            expected += " ⬡ ⬢ ⬢ ⬢ ";
            expected += "⬡ ✔ ★ ⬢ ⬢";
            expected += " ⬡ ✔ ⬢ ⬡ ";
            expected += "⬢ ⬢ ⬢ ⬡ ⬡";

            var queen = Creatures.Queen;

            queen.Should().HaveMoves(initial, expected);
        }
    }
}
