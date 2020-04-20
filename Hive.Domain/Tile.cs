using System.Collections.Generic;

namespace Hive.Domain
{
    public class Tile
    {
        private int _count=0;

        public Tile(string owner, TextContent content, string color)
        {
            Id = (++_count).ToString();
            Owner = owner;
            Content = content;
            Color = color;
        }

        public string Id { get; }
        public string Owner { get; }
        public TextContent Content { get; }
        public string Color { get; }
        public ICollection<GameCoordinate> AvailableMoves { get; } = new List<GameCoordinate>();
    }
}