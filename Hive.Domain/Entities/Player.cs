using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public record Player(int Id, string Name)
    {
        public ISet<Tile> Tiles { get; init; } = new HashSet<Tile>();
    }
}
