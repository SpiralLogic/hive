using Hive.Domain.Entities;

namespace Hive.Domain.Ai;

internal record InProgressMove(int TileId, int PlayerId, Coords? Coords);