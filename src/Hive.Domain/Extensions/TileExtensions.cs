using Hive.Domain.Entities;

namespace Hive.Domain.Extensions;

internal static class TileExtensions
{
    extension(Tile tile)
    {
        internal bool IsQueen()
        {
            return tile.Creature == Creatures.Queen;
        }

        internal bool IsCreature(Creature creature)
        {
            var (_, _, creature1) = tile;
            return creature1 == creature && creature1.Name == creature.Name;
        }
    }
}
