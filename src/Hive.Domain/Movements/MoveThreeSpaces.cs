using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Movements;
internal class MoveThreeSpaces : IMovement
{
    private const int NumberOfMoves = 3;

    public ISet<Coords> GetMoves(Cell originCell, ISet<Cell> allCells)
    {
        return GetPathsForMoves(new(originCell), allCells)
            .Select(p => p.Last)
            .ToCoords();
    }

    private static IEnumerable<Path> GetPathsForMoves(Path initialPath, ISet<Cell> allCells)
    {
        IEnumerable<Path> paths = new List<Path> { initialPath };
        for (int i = 0; i < NumberOfMoves; i++)
        {
            paths = paths.SelectMany(p => p.Extend(allCells));
        }
        return paths;
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