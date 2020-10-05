using System.Linq;
using System.Collections.Generic;
using Hive.Domain.Rules;
using Hive.Domain.Extensions;

namespace Hive.Domain.Entities
{
    public record Creature(string Name)
    {
        private  IEnumerable<IRule> Rules { get; init;} =  new List<IRule>();
     
        internal Creature(string name, IList<IRule> rules) : this(name)
        {
            Rules = rules;
        }

        public ISet<Coords> GetAvailableMoves(Cell originCell, ISet<Cell> cells)
        {
            return Rules.Aggregate(cells.SelectCoords(), (current, rule)=>current.Intersect(rule.ApplyRule(originCell, cells))).ToHashSet();
            
        }
    }
}