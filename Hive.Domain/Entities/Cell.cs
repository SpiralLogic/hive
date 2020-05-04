﻿using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public class Cell
    {
        public Cell(GameCoordinate coordinates, ICollection<Tile> tiles = null)
        {
            Coordinates = coordinates;
            Tiles = tiles ??  new List<Tile>();
        }

        public GameCoordinate Coordinates { get; }
        public ICollection<Tile> Tiles { get; }
    }
}