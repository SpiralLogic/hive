using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain
{
    public class Hive
    {
        private readonly ImmutableArray<Creature> _startingTiles = ImmutableArray.Create(
            Creatures.Queen,
             Creatures.Beetle,
             Creatures.Grasshopper,
             Creatures.Ant,
             Creatures.Ant,
             Creatures.Ant,
             Creatures.Spider
             );

        private readonly Coords _initialCoords = new Coords(0, 0);

        public ISet<Cell> Cells { get; }
        public IList<Player> Players { get; }

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
            var loser = IsGameOver();
            if (loser.Any())
            {
                Cells.ExceptWith(Cells.WherePlayerOccupies(loser.First().TopTile().PlayerId));
                return;
            }

            ClearAllTileMoves();
            Cells.ExceptWith(Cells.WhereEmpty());
            Cells.UnionWith(Cells.CreateAllEmptyNeighbours());
            Cells.UnionWith(Cells.CreateAllEmptyNeighbours());
            Cells.UnionWith(Cells.CreateAllEmptyNeighbours());
            Cells.UnionWith(Cells.CreateAllEmptyNeighbours());
            

            UpdatedPlacedTileMoves(nextPlayer);
            UpdatePlayerTileMoves(nextPlayer);
        }

        private IEnumerable<Cell> IsGameOver()
        {
            var queens = Cells.WhereOccupied().Where(c => c.IsQueen());
            return queens.Where(q =>
                Cells.SelectNeighbors(q).All(n => !n.IsEmpty() && n.TopTile().PlayerId != q.TopTile().PlayerId));
        }

        private void UpdatePlayerTileMoves(Player player)
        {
            var availableCells = (player.Tiles.Count == _startingTiles.Length)
                ? Cells.WhereEmpty()
                : Cells.WherePlayerOccupies(player.Id).SelectMany(c => Cells.SelectEmptyNeighbors(c));

            var availableMoves = availableCells.ToCoords();

            if (player.Tiles.Count == _startingTiles.Length - 3 && player.Tiles.Any(t => t.IsQueen()))
            {
                player.Tiles.First(t => t.IsQueen()).Moves.UnionWith(availableMoves);
                return;
            }

            foreach (var tile in player.Tiles)
            {
                tile.Moves.UnionWith(availableMoves);
            }
        }

        private void UpdatedPlacedTileMoves(Player player)
        {
            foreach (var cell in Cells.WherePlayerOccupies(player.Id))
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

        private Tile FindAndRemoveTile(int tileId)
        {
            var pTile = Players.SelectMany(p => p.Tiles).FirstOrDefault(t => t.Id == tileId);

            return (pTile != null)
                ? Players.FindPlayerById(pTile.PlayerId).RemoveTile(pTile)
                : Cells
                    .WhereOccupied()
                    .First(c => c.TopTile().Id == tileId)
                    .RemoveTopTile();
        }


        private IList<Player> CreatePlayers(IEnumerable<string> playerNames) =>
            playerNames.Select(CreatePlayer).ToList();

        private Player CreatePlayer(string name, int id) => new Player(id, name) { Tiles = CreateStartingTiles(id) };


        private ISet<Tile> CreateStartingTiles(int playerId) =>
            _startingTiles
            .Select((creature, i) => (creature, id: playerId * _startingTiles.Length + i))
            .Select(t => new Tile(t.id, playerId, t.creature) { Moves = Cells.ToCoords() })
            .ToHashSet();

        private ISet<Cell> CreateCells() =>
            _initialCoords
            .GetNeighbors()
            .Prepend(_initialCoords).ToCells();
    }
}