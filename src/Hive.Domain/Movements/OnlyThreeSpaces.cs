using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements;

public class OnlyThreeSpaces : IMovement
{
    public ISet<Coords> GetMoves(Cell originCell, ISet<Cell> allCells)
    {
        return new Path(originCell).Extend(allCells)
            .SelectMany(p => p.Extend(allCells))
            .SelectMany(p => p.Extend(allCells))
            .Select(p => p.Last)
            .ToCoords();
    }
}

internal sealed record Path(Cell Last)
{
    private ImmutableHashSet<Cell> Cells { get; init; } = ImmutableHashSet.Create(Last);

    internal IEnumerable<Path> Extend(ISet<Cell> allCells)
    {
        return Last.SelectNeighbors(allCells.WhereEmpty().Except(Cells))
            .Where(c => c.SelectNeighbors(allCells).Except(Cells).Intersect(Last.SelectNeighbors(allCells).WhereOccupied()).Any())
            .Select(cell => this with { Cells = Cells.Add(cell), Last = cell });
    }
}
