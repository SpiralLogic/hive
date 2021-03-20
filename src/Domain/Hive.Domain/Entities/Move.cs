namespace Hive.Domain.Entities
{
    public sealed record Move(Tile Tile, Coords Coords, bool UseAi=false)
    {
    }
}
