using System;
using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Domain.Rules
{
    public class MustSlide : IRule
    {
        public ISet<Coords> ApplyRule(Cell originCell, ISet<Cell> allCells)
        {
            throw new NotImplementedException();
        }
    }
}
