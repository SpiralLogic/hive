namespace Hive.Domain
{
    public class GameCoordinate
    {
        public GameCoordinate(int q, int r)
        {
            Q = q;
            R = r;
        }

        public int Q { get; }
        public int R { get; }
    }
}