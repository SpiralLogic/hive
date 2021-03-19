using System.Collections.Generic;
using Hive.Domain.Entities;
using Hive.Domain.Movements;

namespace Hive.Domain.Tests.TestUtils
{
    internal static class HiveTestExtensions
    {
        public static MovementAssertion Should(this IMovements movements)
        {
            return new(initialHiveBuilder => movements.GetMoves(initialHiveBuilder.OriginCell, initialHiveBuilder.AllCells));
        }

        public static MovementAssertion Should(this Creature creature)
        {
            return new(initialHiveBuilder =>
            {
                var currentCell = initialHiveBuilder.OriginCell;
                currentCell.RemoveTopTile();
                initialHiveBuilder.OriginCell.AddTile(new Tile(0, 1, Creatures.Queen));
                initialHiveBuilder.AllCells.Add(currentCell);
                return creature.GetAvailableMoves(initialHiveBuilder.OriginCell, initialHiveBuilder.AllCells);
            });
        }

        public static AiAssertions Should(this ComputerPlayer computerPlayer)
        {
            return new(initialHiveBuilder =>
            {
                var player1 = new Player(0, "1");
                var player2 = new Player(1, "2");
                var hive = new Hive(new List<Player> {player1,player2}, initialHiveBuilder.AllCells);
                return new ComputerPlayer(player1).GetMove(hive);
            });
        }
    }
}
