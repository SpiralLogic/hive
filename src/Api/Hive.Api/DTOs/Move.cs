using Hive.Domain.Entities;

namespace Hive.DTOs
{
    public record Move(int TileId, Coords Coords, bool UseAi=false)
    {
    }
}
