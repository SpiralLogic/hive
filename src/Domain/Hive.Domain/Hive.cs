using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain
{
    public class Hive
    {
        private readonly Creature[] StartingTiles = new[] { Creatures.Queen, Creatures.Queen };

        private readonly Coords InitialCoords = new Coords(0, 0);

        public ISet<Cell> Cells { get; private set; }
        public IList<Player> Players { get; private set; }

        public Hive(IEnumerable<string> playerNames)
        {
            Cells = CreateCells();
            Players = CreatePlayers(playerNames);
        }

        public Hive(IList<Player> players, ISet<Cell> cells)
        {
            Cells = cells;
            Players = players;
        }

        public void Move(int tileId, Coords coords)
        {
            var movedTile = FindAndRemoveTile(tileId);
            var nextPlayer = Players.First(p => p.Id != movedTile.PlayerId);
            Cells.FindCell(coords).AddTile(movedTile);
            ClearAllTileMoves();

            UpdatedPlacedTileMoves(nextPlayer);

            Cells.ExceptWith(Cells.WhereEmpty());
            Cells.UnionWith(Cells.GetEmptyNeighbours());

            UpdatePlayerTileMoves(nextPlayer);
        }

        private void UpdatePlayerTileMoves(Player player)
        {
            var availableCells = (player.Tiles.Count == StartingTiles.Length)
                ? Cells.WhereEmpty()
                : Cells.WherePlayerOccupies(player).GetEmptyNeighbours();

            var availableMoves = availableCells.ToCoords();
            foreach (var tile in player.Tiles)
            {
                tile.Moves.UnionWith(availableMoves);
            }
        }

        private void UpdatedPlacedTileMoves(Player player)
        {
            foreach (var cell in Cells.WherePlayerOccupies(player))
            {
                var tile = cell.TopTile();
                var moves = tile.Creature.GetAvailableMoves(cell, Cells);
                tile.Moves.UnionWith(moves);
            }
        }

        private void ClearAllTileMoves()
        {
            foreach (var tile in Players.SelectMany(p => p.Tiles).Concat(Cells.SelectMany(c => c.Tiles)))
            {
                tile.Moves.Clear();
            }
        }

        public Tile FindAndRemoveTile(int tileId)
        {
            var pTile = Players.SelectMany(p => p.Tiles).FirstOrDefault(t => t.Id == tileId);

            if (pTile != null)
            {
                return Players.FindPlayerById(pTile.PlayerId).RemoveTile(pTile);
            }

            return Cells.WhereOccupied().First(c => c.TopTile().Id == tileId).RemoveTopTile();
        }


        private IList<Player> CreatePlayers(IEnumerable<string> playerNames) =>
            playerNames.Select(CreatePlayer).ToList();

        private Player CreatePlayer(string name, int id) => new Player(id, name) { Tiles = CreateStartingTiles(id) };


        private ISet<Tile> CreateStartingTiles(int playerId) => StartingTiles
            .Select((creature, i) => (creature, id: playerId * StartingTiles.Length + i))
            .Select(t => new Tile(t.id, playerId, t.creature) { Moves = Cells.ToCoords() })
            .ToHashSet();

        private ISet<Cell> CreateCells() => InitialCoords
            .GetNeighbors()
            .Prepend(InitialCoords).ToCells();
    }
}