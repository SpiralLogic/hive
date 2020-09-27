using System.Linq;
using System.Collections.Generic;
using Hive.Domain.Rules;

namespace Hive.Domain.Entities
{
    public record Creature
    {
    internal readonly IList<IMovement> _movements = new List<IMovement>();
    internal readonly IList<IRestriction> _restrictions = new List<IRestriction>();
    public string Name { get; init; }

    private Creature(string name)
    {
        Name=name;
    }

    internal Creature(string name, IList<IMovement> movements, IList<IRestriction> restrictions) : this(name)
    {
        _movements = movements;
        _restrictions = restrictions;
    }

    internal ISet<Coords> GetAvailableMoves(Coords position, ISet<Cell> cells)
    {
        var allMoves = _movements.SelectMany(m => m.GetAvailableMoves(position, cells));
        var restrictions = _restrictions.SelectMany(r => r.Restrict(position, cells));
        return new HashSet<Coords>(allMoves.Except(restrictions));
    }
    }
}