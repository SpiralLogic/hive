using System;

namespace Hive.Models
{
    public class Coords
    {
        public Coords()
        {
        }

        protected bool Equals(Domain.Entities.Coordinates other)
        {
            return Q == other.Q && R == other.R;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != typeof(Coords)) return false;
            return Equals((Coords) obj);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Q, R);
        }

        public static bool operator ==(Domain.Entities.Coordinates left, Coords right)
        {
            return left.Q == right.Q && left.R == right.R;
        }

        public static bool operator !=(Domain.Entities.Coordinates left, Coords right)
        {
            return !(left.Q == right.Q && left.R == right.R);
        }

        public int Q { get; set; }
        public int R { get; set; }


    }
}
