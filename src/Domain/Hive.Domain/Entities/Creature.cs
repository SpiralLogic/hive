using System.Linq;
using System.Collections.Generic;
using Hive.Domain.Rules;

namespace Hive.Domain.Entities
{
    public record Creature
    {
    internal readonly IList<IMovementRule> _movements = new List<IMovementRule>();
    internal readonly IList<IRuleRestriction> _restrictions = new List<IRuleRestriction>();
    public string Name { get; init; }

    private Creature(string name)
    {
        Name=name;
    }

    internal Creature(string name, IList<IMovementRule> movements, IList<IRuleRestriction> restrictions) : this(name)
    {
        _movements = movements;
        _restrictions = restrictions;
    }

    internal ISet<Coords> GetAvailableMoves(Cell originCell, ISet<Cell> cells)
    {
        var allMoves = _movements.SelectMany(m => m.GetAvailableMoves(originCell, cells));
        var restrictions = _restrictions.SelectMany(r => r.ApplyRestriction(originCell, cells));

        return allMoves.Except(restrictions).ToHashSet();
    }
    }
}