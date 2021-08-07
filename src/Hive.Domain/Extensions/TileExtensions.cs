using Hive.Domain.Entities;

namespace Hive.Domain.Extensions
{
    internal static class TileExtensions
    {
        internal static bool IsQueen(this Tile tile) =>
            tile.Creature==Creatures.Queen;
        internal static bool IsCreature(this Tile tile,Creature creature) =>
            tile.Creature==creature && tile.Creature.Name==creature.Name;
    }
}
