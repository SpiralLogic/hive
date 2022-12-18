using System;
using System.Collections.Generic;
using System.Collections.Immutable;

namespace Hive.Domain.Entities;

public sealed record Coords(int Q, int R)
{

    private readonly int _hashCode = ShiftAndWrap(Q.GetHashCode(), 2) ^ R.GetHashCode();

    private readonly Lazy<Coords[]> _neighbours = new(
        () =>
        {
            var n = new Coords[6];
            n[(int)Direction.TopLeft] = R % 2 == 0 ? new Coords(Q - 1, R - 1) : new Coords(Q, R - 1);
            n[(int)Direction.BottomLeft] = R % 2 == 0 ? new Coords(Q - 1, R + 1) : new Coords(Q, R + 1);
            n[(int)Direction.TopRight] = R % 2 == 0 ? new Coords(Q, R - 1) : new Coords(Q + 1, R - 1);
            n[(int)Direction.BottomRight] = R % 2 == 0 ? new Coords(Q, R + 1) : new Coords(Q + 1, R + 1);
            n[(int)Direction.Right] = new Coords(Q + 1, R);
            n[(int)Direction.Left] = new Coords(Q - 1, R);
            return n;
        }
    );

    public bool Equals(Coords? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return Q == other.Q && R == other.R;
    }

    internal Coords[] Neighbours()
    {
        return _neighbours.Value;
    }

    public override int GetHashCode()
    {
        return _hashCode;
    }

    private static int ShiftAndWrap(int value, int positions)
    {
        positions &= 0x1F;
        // Save the existing bit pattern, but interpret it as an unsigned integer.
        var number = BitConverter.ToUInt32(BitConverter.GetBytes(value), 0);
        // Preserve the bits to be discarded.
        var wrapped = number >> (32 - positions);
        // Shift and wrap the discarded bits.
        return BitConverter.ToInt32(BitConverter.GetBytes((number << positions) | wrapped), 0);
    }
}
