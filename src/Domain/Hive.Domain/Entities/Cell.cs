using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public class Cell
    {
        public Cell(Coords coords)
        {
            Coords = coords;
        }

        public Coords Coords { get; init; }
        public ISet<Tile> Tiles { get; init; } = new HashSet<Tile>();
    }
}