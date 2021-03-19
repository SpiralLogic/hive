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
            expected += " ✔ ⬡ b ⬡ ⬡ ⬡";
            expected += "⬡ q b b Q ⬡ ";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
     
            new ComputerPlayer(new Player(1,"P1")).Should().MakeMove(initial, expected);  
        } 
        
        [Fact]
        public void QueenMovesAway()
        {
            var initial = new InitialHiveBuilder();

            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            initial += "⬡ ⬡ A ⬡ ⬡ ⬡ ";
            initial += " ⬡ ⬡ b Q ⬡ ⬡";
            initial += "⬡ q b b b ⬡ ";
            initial += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";

            var expected = new ExpectedAiBuilder();

            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
            expected += "⬡ ⬡ A ✔ ⬡ ⬡ ";
            expected += " ⬡ ⬡ b ★ ⬡ ⬡";
            expected += "⬡ q b b b ⬡ ⬡";
            expected += " ⬡ ⬡ ⬡ ⬡ ⬡ ⬡";
     
            new ComputerPlayer(new Player(1,"P2")).Should().MakeMove(initial, expected);  
        }
    }
}
