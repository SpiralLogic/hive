using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain;

public static class HiveFactory
{
    private static readonly Coords InitialCoords = new(0, 0);

    internal static readonly ImmutableArray<Creature> StartingTiles = ImmutableArray.Create(
        Creatures.Queen,
        Creatures.Spider,
        Creatures.Spider,
        Creatures.Beetle,
        Creatures.Beetle,
        Creatures.Grasshopper,
        Creatures.Grasshopper,
        Creatures.Grasshopper,
        Creatures.Ant,
        Creatures.Ant,
        Creatures.Ant
    );

    public static Hive Create(IEnumerable<string> playerNames)
    {
        return new(CreatePlayers(playerNames), CreateCells());
    }

    public static Hive CreateInProgress(IList<Player> players, ISet<Cell> cells, IEnumerable<HistoricalMove>? history = null)
    {
        var hive = new Hive(players, cells, history);
        return hive;
    }

    private static IList<Player> CreatePlayers(IEnumerable<string> playerNames)
    {
        return playerNames.Select((name, id) => new Player(id, name) { Tiles = CreateTiles(id, id == 0) }).ToList();
    }

    private static ISet<Tile> CreateTiles(int playerId, bool withMoves = false)
    {
        var startingMoves = CreateCells().ToCoords();
        return StartingTiles.Select((creature, i) => (creature, id: (playerId * StartingTiles.Length) + i))
            .Select(t => new Tile(t.id, playerId, t.creature))
            .Select(t => withMoves ? t with { Moves = startingMoves.ToHashSet() } : t)
            .ToHashSet();
    }

    private static ISet<Cell> CreateCells()
    {
        return InitialCoords.Neighbours().Prepend(InitialCoords).ToCells();
    }
}
