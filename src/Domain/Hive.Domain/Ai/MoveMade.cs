using Hive.Domain.Entities;

namespace Hive.Domain.Ai
{
    internal record MoveMade(int TileId, int PlayerId, Coords? Coords);
}
