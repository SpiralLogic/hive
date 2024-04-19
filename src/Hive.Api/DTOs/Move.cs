using Hive.Domain.Entities;

namespace Hive.Api.DTOs;

internal sealed record Move(int TileId, Coords Coords);
