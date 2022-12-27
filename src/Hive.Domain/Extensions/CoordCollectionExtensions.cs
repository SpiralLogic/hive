using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Extensions;

internal static class CoordCollectionExtensions
{
    internal static ISet<Cell> ToCells(this IEnumerable<Coords> coords)
    {
        return coords.Select(c => new Cell(c)).ToHashSet();
    }
}