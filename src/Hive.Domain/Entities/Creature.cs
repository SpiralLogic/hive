using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Extensions;
using Hive.Domain.Movements;

namespace Hive.Domain.Entities;

public sealed record Creature(string Name)
{
    internal IEnumerable<IMovement> Movements { get; init; } = new List<IMovement>();

    public bool Equals(Creature? other)
    {
        if (ReferenceEquals(null, other)) return false;
        return ReferenceEquals(this, other) || Name.SequenceEqual(other.Name);
    }

    public override int GetHashCode()
    {
        return Name.GetHashCode();
    }

    public ISet<Coords> GetAvailableMoves(Cell originCell, ISet<Cell> cells)
    {
        var moves = cells.ToCoords();
        foreach (var move in Movements) moves.IntersectWith(move.GetMoves(originCell, cells));

        return moves;
    }
}
