using Hive.Domain.Rules.Movements;
using Xunit;

namespace Hive.Domain.Tests.RuleTests.Movements
{
    public class AdjacentCellsTests
    {
        [Fact]
        void ReturnsAllAdjacementCells()
        {
            var initial = new HiveBuilder();

            initial += " ⬡ ⬡ ";
            initial += "⬡ ⬢ ⬡";
            initial += " ⬡ ⬡ ";

            var expected = new HiveBuilder();

            expected += " ⬢ ⬡ ";
            expected += "⬢ ⬡ ⬢";
            expected += " ⬢ ⬢ ";

            var movement = new AdjacentCells();

            movement.Should().CreateMoves(initial, expected);
        }

          [Fact]
        void ReturnsOnlyCellsAdjacementToOrigin()
        {
            var initial = new HiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬢ ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new HiveBuilder();

            expected += "⬡ ⬡ ⬡ ⬡ ⬡";
            expected += " ⬡ ⬢ ⬢ ⬡ ";
            expected += "⬡ ⬢ ⬡ ⬢ ⬡";
            expected += " ⬡ ⬢ ⬢ ⬡ ";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡";

            var movement = new AdjacentCells();

            movement.Should().CreateMoves(initial, expected);
        }
    }
}