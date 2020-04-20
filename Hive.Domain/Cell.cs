using System.Collections.Generic;

namespace Hive.Domain
{
    public class Cell
    {
        public Cell(GameCoordinate position, string color)
        {
            Position = position;
            Color = color;
        }

        public GameCoordinate Position { get; }
        public string Color { get; }
        public ICollection<Tile> Tiles { get; } = new List<Tile>();
    }
}