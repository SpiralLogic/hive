using Hive.Domain.Entities;

namespace Hive.Api.DTOs;

public sealed record Move(int TileId, Coords Coords);
