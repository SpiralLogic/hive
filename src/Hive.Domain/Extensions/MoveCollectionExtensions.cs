using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Extensions
{
    internal static class MoveCollectionExtensions
    {
        internal static void AddMany(this ISet<Coords> coords, IEnumerable<Coords> moves) =>
            coords.UnionWith(moves);

    }
}
