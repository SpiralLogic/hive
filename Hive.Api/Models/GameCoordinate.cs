using System;

namespace Hive.Models
{
    public class GameCoordinate
    {
        public GameCoordinate()
        {
        }

        protected bool Equals(Domain.Entities.GameCoordinate other)
        {
            return Q == other.Q && R == other.R;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != typeof(GameCoordinate)) return false;
            return Equals((GameCoordinate) obj);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Q, R);
        }

        public static bool operator ==(Domain.Entities.GameCoordinate left, GameCoordinate right)
        {
            return left.Q == right.Q && left.R == right.R;
        }

        public static bool operator !=(Domain.Entities.GameCoordinate left, GameCoordinate right)
        {
            return !(left.Q == right.Q && left.R == right.R);
        }

        public int Q { get; set; }
        public int R { get; set; }
        
        
    }
}