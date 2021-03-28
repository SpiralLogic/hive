using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests
{
    public class ComputerPlayerTests
    {
        [Fact]
        public void MovesToEnemyQueen()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ A ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ b ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ q b b Q A ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedAiBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ★ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ✔ ✔ b ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ✔ q b b Q ★ ⬡ ";
            expected += " ⬡ ✔ ✔ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var hive = new Hive(new[] {new Player(0, "P1"), new Player(1, "P1")}, initial.AllCells, 0);

            new ComputerPlayer(hive).Should().MatchHive(initial, expected);
        }

        [Fact]
        public void MovesToEnemyQueen2()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ q b b Q A A ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedAiBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ✔ ✔ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ✔ q b b Q A ★ ⬡ ⬡ ";
            expected += " ⬡ ✔ ✔ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var hive = new Hive(new[] {new Player(0, "P1"), new Player(1, "P1")}, initial.AllCells, 0);

            new ComputerPlayer(hive).Should().MatchHive(initial, expected);
        }

        [Fact]
        public void QueenMovesAway()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ B ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ s s b Q ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ q s s ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedAiBuilder();
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ b ⬡ ✔ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ s s b ★ ✔ ⬡ ";
            expected += " ⬡ ⬡ ⬡ ⬡ q s s ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var hive = new Hive(new[] {new Player(0, "P1"), new Player(1, "P1")}, initial.AllCells, 0);

            new ComputerPlayer(hive).Should().MatchHive(initial, expected);
        }

        [Fact]
        public void MovesBeetleOnTopOfQueen()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ A ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ b ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ Q b b q B ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedAiBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ A ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ b ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ q b b ✔ ★ ⬡ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var hive = new Hive(new[] {new Player(0, "P1"), new Player(1, "P1")}, initial.AllCells, 0);

            new ComputerPlayer(hive).Should().MatchHive(initial, expected);
        }

        [Fact]
        public void BeetleStaysOnTopOfQueen()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ A ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ s ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ Q s s s B ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var beetleCell = initial.AllCells.First(c => c.Tiles.Any(t => t.Creature.Name == Creatures.Beetle.Name));
            var beetle = beetleCell.RemoveTopTile();
            beetleCell.AddTile(new Tile(11, 1, Creatures.Queen));
            beetleCell.AddTile(beetle);

            var expected = new ExpectedAiBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ★ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ s ⬡ ✔ ✔ ⬡";
            expected += "⬡ ⬡ Q s s s B ✔ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ✔ ✔ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var hive = new Hive(new[] {new Player(0, "P1"), new Player(1, "P1")}, initial.AllCells, 0);

            new ComputerPlayer(hive).Should().MatchHive(initial, expected);
        }
    }
}
