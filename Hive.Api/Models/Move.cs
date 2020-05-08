using Hive.Domain.Entities;

namespace Hive.Models
{
    public class Move
    {
        public int TileId { get; set; }
        public GameCoordinate Coordinates { get; set; }
    }
}