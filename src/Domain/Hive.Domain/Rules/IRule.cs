using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public interface IRule
    {
        ISet<Coords> ApplyRule(Cell currentCell, ISet<Cell> alLCells);
    }
}