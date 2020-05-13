using System.Collections.Generic;
using System.Linq;

namespace Hive.Domain.Entities
{
    public class Tile
    {
        public Tile(int id, int playerId, string content, IEnumerable<GameCoordinate> availableMoves = null)
        {
            Id = id;
            PlayerId = playerId;
            Content = content;
            AvailableMoves = availableMoves?.ToList() ?? new List<GameCoordinate>();
        }

        public int Id { get; }
        public int PlayerId { get; }
        public string Content { get; }
        public ICollection<GameCoordinate> AvailableMoves { get; }
    }
}