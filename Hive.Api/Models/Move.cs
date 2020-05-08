namespace Hive.Models
{
    public class Move
    {
        public Move()
        {
        }

        public int TileId { get; set; }
        public GameCoordinate Coordinates { get; set; }
    }
}