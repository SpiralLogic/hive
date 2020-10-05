using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain.Rules
{
    public class OneHive : IRule
    {
        private readonly ISet<Cell> _inHive = new HashSet<Cell>();
        private readonly ISet<Cell> _allCells = new HashSet<Cell>();

        public ISet<Coords> ApplyRule(Cell currentCell, ISet<Cell> allCells)
        {
            if (!CouldDisconnect(allCells,currentCell) || currentCell.Tiles.Count>1) return allCells.ToCoords();
            
            _allCells.Clear();
            _allCells.UnionWith(allCells.WhereOccupied());
            _allCells.Remove(currentCell);

            _inHive.Clear();
            var processing = new Stack<Cell>();
            processing.Push(_allCells.First());
            Check(processing);

            return _inHive.Count == _allCells.Count ? _inHive.Union(allCells.WhereEmpty()).ToCoords() : new HashSet<Coords>();
        }

        private void Check(Stack<Cell> processing)
        {
            if (!processing.TryPop(out var cell)) return;
            _inHive.Add(cell);

            _allCells.SelectNeighbors(cell).Except(_inHive).ToList().ForEach(processing.Push);
            Check(processing);
        }

        private static bool CouldDisconnect(ISet<Cell> allCells, Cell currentCell)
        {
            return allCells.SelectNeighbors(currentCell).WhereOccupied().Count() < 6;
        }
    }
}
