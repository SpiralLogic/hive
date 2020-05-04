using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public class Player
    {
        public Player(int id, string name, string color, ICollection<Tile> availableTiles = null)
        {
            Id = id;
            Name = name;
            Color = color;
            AvailableTiles = availableTiles ?? new List<Tile>();
        }

        public string Color { get; }

        public int Id { get; }
        public string Name { get; }

        public ICollection<Tile> AvailableTiles { get; }
    }
}