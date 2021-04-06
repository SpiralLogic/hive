using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Ai.Heuristics
{
    internal class BeetleMoveOff:IHeuristic
    {
        public int Get(HeuristicValues values, Move move)
        {
            if (values.MoveFromLocation == null) return 0;
            if (move.Tile.IsCreature(Creatures.Beetle) &&
                values.MoveFromLocation.Tiles.Any(t => t.IsQueen() && t.PlayerId != move.Tile.PlayerId)) return -20;
            return 0;
        }        
    }
}
