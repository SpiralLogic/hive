using System;
using System.Collections.Generic;
using System.Drawing;

namespace Hive.Domain
{
    public class Player
    {
        private static int _count = 0;
        
        public Player(string name, string color, string tileListColor)
        {
            Id = (++_count).ToString();
            Name = name;
            Color = color;
            TileListColor = tileListColor;
        }

        public string Id { get; }
        public string Name { get; }
        public string Color { get; }
        public string TileListColor { get; }
        
        public ICollection<Tile> AvailableTiles { get; } = new List<Tile>();
    }
}