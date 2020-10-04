using System;
using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Rules
{
    class NextUnoccupied : IRule
    {
        public ISet<Coords> ApplyRule(Cell currentCell, ISet<Cell> alLCells)
        {
            throw new NotImplementedException();
        }
    }
}
