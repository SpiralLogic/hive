using System.Linq;
using System.Collections.Generic;
using Hive.Domain.Rules;

namespace Hive.Domain.Entities
{
    public record Creature
    {
        internal readonly IList<IRule> _movements = new List<IRule>();
        internal readonly IList<IRule> _restrictions = new List<IRule>();
        public string Name { get; init; }

        private Creature(string name)
        {
            Name = name;
        }

        internal Creature(string name, IList<IRule> movements, IList<IRule> restrictions) : this(name)
        {
            _movements = movements;
            _restrictions = restrictions;
        }

        internal ISet<Coords> GetAvailableMoves(Cell originCell, ISet<Cell> cells)
        {
            var allMoves = _movements.SelectMany(m => m.ApplyRule(originCell, cells));
            var restrictions = _restrictions.SelectMany(r => r.ApplyRule(originCell, cells));

            return allMoves.Except(restrictions).ToHashSet();
        }
    }
}