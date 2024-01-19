using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Hive.Domain.Entities;
using Hive.Domain.Movements;
using Xunit;

namespace Hive.Domain.Tests.MovementTests;

public class HiveHasQueenTests
{
    [Fact]
    public void CantMoveWithNoQueen()
    {
        var cells = new HashSet<Cell>
        {
            new Cell(new(1, 1)).AddTile(new(1, 1, Creatures.Beetle)),
            new Cell(new(1, 2)).AddTile(new(2, 1, Creatures.Beetle)),
            new Cell(new(1, 3)).AddTile(new(3, 1, Creatures.Beetle))
        };

        var move = new HiveHasQueen();

        move.GetMoves(cells.First(), cells).Should().BeEmpty();
    }

    [Fact]
    public void CanMoveWhenQueenIsPlaced()
    {
        var cells = new HashSet<Cell>
        {
            new Cell(new(1, 1)).AddTile(new(1, 1, Creatures.Beetle)),
            new Cell(new(1, 2)).AddTile(new(2, 1, Creatures.Beetle)),
            new Cell(new(1, 3)).AddTile(new(3, 1, Creatures.Beetle)),
            new Cell(new(1, 4)).AddTile(new(4, 1, Creatures.Queen))
        };

        var move = new HiveHasQueen();

        move.GetMoves(cells.First(), cells).Should().NotBeEmpty();
    }
}
