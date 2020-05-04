using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public class Tile
    {
        public Tile(int id, int playerId, TextContent content, ICollection<GameCoordinate> availableMoves = null)
        {
            Id = id;
            PlayerId = playerId;
            Content = content;
            AvailableMoves = availableMoves ?? new List<GameCoordinate>();
        }

        public int Id { get; }
        public int PlayerId { get; }
        public TextContent Content { get; }
        public ICollection<GameCoordinate> AvailableMoves { get; }
    }
}