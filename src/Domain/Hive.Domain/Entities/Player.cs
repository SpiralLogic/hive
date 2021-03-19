using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public sealed record Player(int Id, string Name)
    {
        public ISet<Tile> Tiles { get; init; } = new HashSet<Tile>();

        internal void RemoveTile(Tile tile)
        {
            Tiles.Remove(tile);
        }
    }
}
