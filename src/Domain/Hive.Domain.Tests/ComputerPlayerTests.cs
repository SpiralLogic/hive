using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Hive.Domain.Entities;
using Hive.Domain.Tests.TestUtils;
using Xunit;

namespace Hive.Domain.Tests
{
    public class ComputerPlayerTests
    {
        [Fact]
        public async Task MovesToEnemyQueen()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ A ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ g ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ q g g Q A ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedAiBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ★ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ✔ ✔ g ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ✔ q g g Q ★ ⬡ ";
            expected += " ⬡ ✔ ✔ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var hive = HiveFactory.CreateHive(new[] {new Player(0, "P1"), new Player(1, "P1")}, initial.AllCells, 0);

            var player = new ComputerPlayer(hive, null);
            (await player.GetMove(1)).Should().MatchHive(initial, expected);
        }

        [Fact]
        public async Task MovesToEnemyQueen2()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ q s s Q A A ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedAiBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ✔ ✔ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ✔ q s s Q A ★ ⬡ ⬡ ";
            expected += " ⬡ ✔ ✔ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var hive = HiveFactory.CreateHive(new[] {new Player(0, "P1"), new Player(1, "P1")}, initial.AllCells, 0);

            var player = new ComputerPlayer(hive, null);
            (await player.GetMove(1)).Should().MatchHive(initial, expected);
        }

        [Fact]
        public async Task QueenMovesAway()
        {
            var initial = new InitialHiveBuilder();

            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ S ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ s s s Q ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ s s ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ q ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedAiBuilder();
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ S ⬡ ✔ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ s s s ★ ✔ ⬡ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ s s ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ q ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

            var hive = HiveFactory.CreateHive(new[] {new Player(0, "P1"), new Player(1, "P1")}, initial.AllCells, 0);

            var player = new ComputerPlayer(hive, null);
            (await player.GetMove(1)).Should().MatchHive(initial, expected);
        }

        [Fact]
        public async Task MovesBeetleOnTopOfQueen()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ A ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ b ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ g Q b b q B ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedAiBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ A ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ b ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ g Q b b ✔ ★ ⬡ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var hive = HiveFactory.CreateHive(new[] {new Player(0, "P1"), new Player(1, "P1")}, initial.AllCells, 0);

            var player = new ComputerPlayer(hive, null);
            (await player.GetMove(1)).Should().MatchHive(initial, expected);
        }

        [Fact]
        public async Task BeetleStaysOnTopOfQueen()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ A ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ s ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ g Q s s s B ⬡ ";
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
            expected += "⬡ g Q s s s B ✔ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ✔ ✔ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var hive = HiveFactory.CreateHive(new[] {new Player(0, "P1"), new Player(1, "P1")}, initial.AllCells, 0);

            var player = new ComputerPlayer(hive, null);
            (await player.GetMove(1)).Should().BeetleOnQueen(initial, expected);
        }

        [Fact]
        public async Task MovesToQueenWithPlayerTiles()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ A g ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ s ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ q s s Q G ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var expected = new ExpectedAiBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ A g ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ s ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ✔ q s s Q ★ ⬡ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var player1 = new Player(0, "P1") with {Tiles = new HashSet<Tile> {new Tile(50, 0, Creatures.Grasshopper)}};
            var player2 = new Player(1, "P2") with {Tiles = new HashSet<Tile> {new Tile(51, 1, Creatures.Grasshopper)}};
            var hive = HiveFactory.CreateHive(new[] {player1,player2}, initial.AllCells, 0);
            var player = new ComputerPlayer(hive, null);
            (await player.GetMove(1)).Should().MatchHive(initial, expected);
        }

        [Fact]
        public async Task BeetleStaysOnTopOfQueenPlayer2()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ a ⬡ ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ ⬡ S ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ G q S S S b ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var beetleCell = initial.AllCells.First(c => c.Tiles.Any(t => t.Creature.Name == Creatures.Beetle.Name));
            var beetle = beetleCell.RemoveTopTile();
            beetleCell.AddTile(new Tile(11, 0, Creatures.Queen));
            beetleCell.AddTile(beetle);

            var expected = new ExpectedAiBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ ⬡ ★ ⬡ ⬡ ⬡ ⬡ ";
            expected += " ⬡ ⬡ ⬡ S ⬡ ✔ ✔ ⬡";
            expected += "⬡ G q S S S b ✔ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ✔ ✔ ⬡";
            expected += "⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ";

            var hive = HiveFactory.CreateHive(new[] {new Player(0, "P1"), new Player(1, "P1")}, initial.AllCells, 1);

            var player = new ComputerPlayer(hive, null);
            (await player.GetMove(1)).Should().BeetleOnQueen(initial, expected);
        }
    }
}
