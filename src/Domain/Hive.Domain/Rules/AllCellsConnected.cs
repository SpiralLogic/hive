using System;
using System.Collections;
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
        private ISet<Cell> inHive = new HashSet<Cell>();
        private ISet<Cell> _allCells = new HashSet<Cell>();

        public ISet<Coords> ApplyRule(Cell currentCell, ISet<Cell> allCells)
        {
            if (!CouldDisconnect(allCells,currentCell) || currentCell.Tiles.Count>1) return allCells.ToCoords();
            
            _allCells.Clear();
            _allCells.UnionWith(allCells.WhereOccupied());
            _allCells.Remove(currentCell);

            inHive.Clear();
            var processing = new Stack<Cell>();
            processing.Push(_allCells.First());
            Check(processing);

            return inHive.Count == _allCells.Count ? inHive.Union(allCells.WhereEmpty()).ToCoords() : new HashSet<Coords>();
        }

        private void Check(Stack<Cell> processing)
        {
            if (!processing.TryPop(out var cell)) return;
            inHive.Add(cell);

            _allCells.SelectNeighbors(cell).Except(inHive).ToList().ForEach(c=>processing.Push(c));
            Check(processing);
        }

        private bool CouldDisconnect(ISet<Cell> allCells, Cell currentCell)
        {
            return allCells.SelectNeighbors(currentCell).WhereOccupied().Count() < 6;
        }
    }
}
