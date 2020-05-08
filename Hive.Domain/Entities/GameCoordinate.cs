namespace Hive.Domain.Entities
{
    public class GameCoordinate
    {
        public GameCoordinate(int q, int r)
        {
            Q = q;
            R = r;
        }

        protected bool Equals(GameCoordinate other)
        {
            return Q == other.Q && R == other.R;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((GameCoordinate) obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return (Q * 397) ^ R;
            }
        }

        public static bool operator ==(GameCoordinate left, GameCoordinate right)
        {
            return Equals(left, right);
        }

        public static bool operator !=(GameCoordinate left, GameCoordinate right)
        {
            return !Equals(left, right);
        }

        public int Q { get; }
        public int R { get; }
    }
}