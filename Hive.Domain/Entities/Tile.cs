using System.Collections.Generic;
using System.Linq;

namespace Hive.Domain.Entities
{
    public class Tile
    {
        public Tile(int id, int playerId, string content, IEnumerable<Coordinates> moves = null)
        {
            Id = id;
            PlayerId = playerId;
            Content = content;
            Moves = moves?.ToList() ?? new List<Coordinates>();
        }

        public int Id { get; }
        public int PlayerId { get; }
        public string Content { get; }
        public ICollection<Coordinates> Moves { get; }
    }
}
