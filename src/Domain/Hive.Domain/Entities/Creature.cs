using System.Linq;
using System.Collections.Generic;
using Hive.Domain.Rules;
using Hive.Domain.Extensions;

namespace Hive.Domain.Entities
{
    public record Creature(string Name)
    {
        internal readonly IEnumerable<IRule> _rules = new List<IRule>();
     
        internal Creature(string name, IList<IRule> rules) : this(name)
        {
            _rules = rules;
        }

        internal ISet<Coords> GetAvailableMoves(Cell originCell, ISet<Cell> cells)
        {
            return _rules.Aggregate(cells.SelectCoords(), (current, rule)=>current.Intersect(rule.ApplyRule(originCell, cells))).ToHashSet();
            
        }
    }
}