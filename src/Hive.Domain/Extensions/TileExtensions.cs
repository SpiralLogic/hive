using Hive.Domain.Entities;

namespace Hive.Domain.Extensions;

internal static class TileExtensions
{
    internal static bool IsQueen(this Tile tile)
    {
        return tile.Creature == Creatures.Queen;
    }

    internal static bool IsCreature(this Tile tile, Creature creature)
    {
        var (_, _, creature1) = tile;
        return creature1 == creature && creature1.Name == creature.Name;
    }
}
