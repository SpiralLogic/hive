using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Rules
{
    public class AllCellsConnected : IRule
    {
        private HashSet<Cell> checkd = new HashSet<Cell>();

        public ISet<Coords> ApplyRule(Cell currentCell, ISet<Cell> allCells)
        {
            checkd.Clear();
            return allCells.WhereEmpty().ToCoords();
        }
    }
}
