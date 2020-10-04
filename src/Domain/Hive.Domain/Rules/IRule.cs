using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Rules
{
    public interface IRule
    {
        ISet<Coords> ApplyRule(Cell currentCell, ISet<Cell> alLCells);
    }
}