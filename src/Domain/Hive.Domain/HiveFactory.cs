using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain
{
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

        public static Hive CreateHive(IEnumerable<string> playerNames) =>
            new Hive(CreatePlayers(playerNames), CreateCells());

        public static Hive CreateHive(IList<Player> players, ISet<Cell> cells, int playerId)
        {
            var hive = new Hive(players, cells);
            var currentPlayer = hive.Players.FindPlayerById(playerId);
            hive.RefreshMoves(currentPlayer);
            return hive;
        }

        private static IList<Player> CreatePlayers(IEnumerable<string> playerNames) =>
            playerNames.Select((name, id) => new Player(id, name) {Tiles = CreateTiles(id)}).ToList();

        private static ISet<Tile> CreateTiles(int playerId)
        {
            var startingMoves =  CreateCells().ToCoords();
            return StartingTiles.Select((creature, i) => (creature, id: playerId * StartingTiles.Length + i))
                .Select(t => new Tile(t.id, playerId, t.creature) with {Moves = startingMoves.ToHashSet()})
                .ToHashSet();
        }

        private static ISet<Cell> CreateCells() =>
            InitialCoords.GetNeighbors().Prepend(InitialCoords).ToCells();
    }
}
