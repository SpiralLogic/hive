using System.Collections.Generic;
using System.Linq;

namespace Hive.Domain.Entities
{
    public class Player
    {
        public Player(int id, string name, IEnumerable<Tile> tiles = null)
        {
            Id = id;
            Name = name;
            Tiles = tiles?.ToList() ?? new List<Tile>();
        }

        public int Id { get; }
        public string Name { get; }

        public ICollection<Tile> Tiles { get; }
    }
}
