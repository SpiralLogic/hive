using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Extensions;

internal static class CoordCollectionExtensions
{
    internal static ISet<Cell> ToCells(this IEnumerable<Coords> coords)
    {
        var set = new HashSet<Cell>(coords.Count());

        foreach (var coord in coords)
        {
            set.Add(new Cell(coord));
        }

        return set;
    }
}