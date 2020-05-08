using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public class Player
    {
        public Player(int id, string name, ICollection<Tile> availableTiles = null)
        {
            Id = id;
            Name = name;
            AvailableTiles = availableTiles ?? new List<Tile>();
        }

        public int Id { get; }
        public string Name { get; }

        public ICollection<Tile> AvailableTiles { get; }
    }
}