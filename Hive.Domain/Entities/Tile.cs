using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public class Tile
    {
        private static int _count=0;

        public Tile(string playerId, TextContent content, string color)
        {
            Id = (++_count).ToString();
            PlayerId = playerId;
            Content = content;
            Color = color;
        }

        public string Id { get; }
        public string PlayerId { get; }
        public TextContent Content { get; }
        public string Color { get; }
        public ICollection<GameCoordinate> AvailableMoves { get; } = new List<GameCoordinate>();
    }
}