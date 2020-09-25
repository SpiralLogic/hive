using System;
using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain
{
    public class Hive
    {
        private readonly string[] StartingTiles =
            {"Q", "S", "S", "B", "B", "GH", "GH", "A", "A", "A"};

        private readonly Coords InitialCoords = new Coords(0, 0);

        public ISet<Cell> Cells { get; private set; }
        public ISet<Player> Players { get; private set; }

        public Hive(IEnumerable<string> playerNames)
        {
            Players = CreatePlayers(playerNames);
            Cells = CreateCells();
            UpdateAllTileMoves();
        }


        public Hive(ISet<Player> players, ISet<Cell> cells)
        {
            Players = players;
            Cells = cells;
        }

        public void Move(Move move)
        {
            var movedTile = Players.FindTileById(move.TileId);
            Players.RemoveUnplacedTile(movedTile);
            Cells.FindCell(move.Coords).AddTile(movedTile);
            Cells.UnionWith(Cells.CreateNewEmptyNeighbors());

            UpdateAllTileMoves();
        }

        private void UpdateAllTileMoves() => Players
            .SelectMany(p => p.Tiles)
            .Concat(Cells.SelectMany(c => c.Tiles))
            .Select(t => t.Moves)
            .ToList()
            .ForEach(m => m.UnionWith(CreateRandomMoves()));

        private ISet<Coords> CreateRandomMoves() =>
            Cells
                .Select(cell => cell.Coords)
                .OrderBy(_ => Guid.NewGuid())
                .Take(Cells.Count / 2)
                .ToHashSet();

        private ISet<Tile> CreateStartingTiles(int playerId) =>
            StartingTiles
                .Select((name, i) => (name, id: playerId * StartingTiles.Length + i))
                .Select(t => new Tile(t.id, playerId, t.name))
                .ToHashSet();

        private ISet<Player> CreatePlayers(IEnumerable<string> playerNames) =>
            playerNames.Select(CreatePlayer).ToHashSet();

        private Player CreatePlayer(string name, int id) =>
            new Player(id, name) {Tiles = CreateStartingTiles(id)};


        private ISet<Cell> CreateCells() => InitialCoords
            .GetNeighbors()
            .Prepend(InitialCoords)
            .Select(c => new Cell(c))
            .ToHashSet();
    }
}