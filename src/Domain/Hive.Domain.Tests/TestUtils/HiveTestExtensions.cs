using Hive.Domain.Entities;
using Hive.Domain.Movements;

namespace Hive.Domain.Tests.TestUtils
{
    internal static class HiveTestExtensions
    {
        public static MovementAssertion Should(this IMovement movement)
        {
            return new(initialHiveBuilder =>
                movement.GetMoves(initialHiveBuilder.OriginCell, initialHiveBuilder.AllCells));
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
            return new(() => computerPlayer.GetMove(1, 0));
        }
    }
}