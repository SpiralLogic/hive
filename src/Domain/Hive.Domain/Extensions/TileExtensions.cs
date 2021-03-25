using Hive.Domain.Entities;

namespace Hive.Domain.Extensions
{
    internal static class TileExtensions
    {
        internal static bool IsQueen(this Tile tile)
        {
            return tile.Creature.Equals(Creatures.Queen);
        }
    }
}