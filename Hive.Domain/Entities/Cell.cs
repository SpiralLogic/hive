﻿using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public class Cell
    {
        public Cell(GameCoordinate coordinates, string color)
        {
            Coordinates = coordinates;
            Color = color;
        }

        public GameCoordinate Coordinates { get; }
        public string Color { get; }
        public ICollection<Tile> Tiles { get; } = new List<Tile>();
    }
}