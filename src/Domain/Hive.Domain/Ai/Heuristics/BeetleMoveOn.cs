using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics
{
    internal class BeetleMoveOn : IHeuristic
    {
        public int Get(HeuristicValues values, Move move)
        {

            if (move.Tile.IsCreature(Creatures.Beetle) &&
                values.MoveToLocation.Tiles.Any(t => t.IsQueen() && t.PlayerId != move.Tile.PlayerId)) return 30;

            return 0;
        }
    }
}
