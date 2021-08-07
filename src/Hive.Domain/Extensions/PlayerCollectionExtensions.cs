using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;

namespace Hive.Domain.Extensions
{
    internal static class PlayerCollectionExtensions
    {
        internal static Player FindPlayerById(this IEnumerable<Player> players, int playerId)
        {
            return players.Single(p => p.Id == playerId);
        }
    }
}