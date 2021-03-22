using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests
{
    public class ComputerPlayerTests
    {
        [Fact]
        public void HasCanSlideRule()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ A ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ b ⬡ ⬡ ⬡";
            initial += "⬡ q b b Q ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedAiBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ★ ⬡ ⬡ ⬡ ";
            expected += " ✔ ✔ b ⬡ ⬡ ⬡";
            expected += "✔ q b b Q ⬡ ";
            expected += " ✔ ✔ ⬡ ⬡ ⬡ ⬡";

            var hive = new Hive(new[] {new Player(0, "P1"), new Player(1, "P1")}, initial.AllCells,1 );

            new ComputerPlayer(hive).Should().MatchHive(initial, expected);
        }

        [Fact]
        public void QueenMovesAway()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ S ⬡ ⬡ ⬡ ";
            initial += " s s b Q ⬡ ⬡";
            initial += " ⬡ q s s ⬡ ⬡";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedAiBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ S ✔ ⬡ ⬡ ";
            expected += " s s b ★ ✔ ⬡";
            expected += " ⬡ q s s ✔ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

            var hive = new Hive(new[] {new Player(0, "P1"), new Player(1, "P1")}, initial.AllCells, 1);

            new ComputerPlayer(hive).Should().MatchHive(initial, expected);
        }
    }
}
