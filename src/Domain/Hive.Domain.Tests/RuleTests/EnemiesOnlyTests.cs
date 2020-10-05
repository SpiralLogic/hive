using Hive.Domain.Rules;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests.RuleTests
{
    public class EnemiesOnlyTests
    {
        [Fact]
        public void ReturnsOnlyCellsWithEnemies()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⏣ ⬡ ";
            initial += "⬡ ★ ⬡";
            initial += " ⬡ ⏣ ";

            var expected = new ExpectedHiveBuilder();

            expected += " ✔ ⬡ ";
            expected += "⬡ ★ ⬡";
            expected += " ⬡ ✔ ";

            var rule = new EnemiesOnly();

            rule.Should().HaveMoves(initial, expected);
        }
    }
}