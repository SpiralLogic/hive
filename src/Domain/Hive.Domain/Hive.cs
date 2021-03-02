using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain
{
    public class Hive
    {
        private readonly ImmutableArray<Creature> _startingTiles = ImmutableArray.Create(Creatures.Queen, Creatures.Spider, Creatures.Spider, Creatures.Beetle, Creatures.Beetle, Creatures.Grasshopper, Creatures.Grasshopper,
            Creatures.Grasshopper, Creatures.Ant, Creatures.Ant, Creatures.Ant);

        private readonly Coords _initialCoords = new(0, 0);
        public ISet<Cell> Cells { get; }
        public IList<Player> Players { get; }

        public Hive(IEnumerable<string> playerNames)
        {
            Cells = CreateCells();
            Players = CreatePlayers(playerNames);
        }

        public Hive(IList<Player> players, ISet<Cell> cells)
        {
            Cells = cells ?? throw new ArgumentNullException(nameof(cells));
            Players = players ?? throw new ArgumentNullException(nameof(players));
        }

        public bool Move(int tileId, Coords coords)
        {
            if (!IsValidMove(tileId, coords)) return false;

            var tileToMove = FindAndRemoveTile(tileId);
            PerformMove(coords, tileToMove);

            var nextPlayer = GetNextPlayer(tileToMove);
            if (IsGameOver()) return true;

            UpdateMoves(nextPlayer);
            if (CountMovesAvailable() == 0)
            {
                UpdateMoves(SkipTurn(nextPlayer));
            }

            return true;
        }

        private Player SkipTurn(Player nextPlayer)
        {
            nextPlayer = Players.First(p => p.Id != nextPlayer.Id);
            return nextPlayer;
        }

        private void UpdateMoves(Player nextPlayer)
        {
            Cells.ExceptWith(Cells.WhereEmpty());
            Cells.UnionWith(Cells.CreateAllEmptyNeighbours());

            UpdatedPlacedTileMoves(nextPlayer);
            UpdatePlayerTileMoves(nextPlayer);
        }

        private void PerformMove(Coords coords, Tile movedTile)
        {
            Cells.FindCell(coords).AddTile(movedTile);
            ClearAllTileMoves();
        }

        private Player GetNextPlayer(Tile movedTile)
        {
            var nextPlayer = Players.First(p => p.Id != movedTile.PlayerId);
            return nextPlayer;
        }

        private bool IsGameOver()
        {
            var loser = Cells.WhereOccupied().Where(c => c.HasQueen()).FirstOrDefault(q => q.SelectNeighbors(Cells).All(n => !n.IsEmpty()));

            if (loser == null) return false;
            foreach (var c in Cells.WherePlayerOccupies(loser.TopTile().PlayerId).Where(c => !c.HasQueen()))
            {
                c.Tiles.Push(c.TopTile() with {PlayerId = Players.First(p => p.Id != loser.Tiles.First().PlayerId).Id});
            }


            return true;
        }

        private void UpdatePlayerTileMoves(Player player)
        {
            var availableCells = player.Tiles.Count == _startingTiles.Length ? Cells.WhereEmpty() : Cells.WherePlayerOccupies(player.Id).SelectMany(c => Cells.SelectEmptyNeighbors(c));

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
            foreach (var cell in Cells.WherePlayerControls(player.Id))
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

        private int CountMovesAvailable()
        {
            return Players.SelectMany(p => p.Tiles).Concat(Cells.SelectMany(c => c.Tiles)).SelectMany(t => t.Moves).Count();
        }

        private bool IsValidMove(int tileId, Coords coords)
        {
            return Players.SelectMany(p => p.Tiles).Union(Cells.SelectMany(p => p.Tiles)).Single(t => t.Id == tileId).Moves.Contains(coords);
        }

        private Tile FindAndRemoveTile(int tileId)
        {
            var pTile = Players.SelectMany(p => p.Tiles).FirstOrDefault(t => t.Id == tileId);

            return (pTile != null) ? Players.FindPlayerById(pTile.PlayerId).RemoveTile(pTile) : Cells.WhereOccupied().First(c => c.TopTile().Id == tileId).RemoveTopTile();
        }

        private IList<Player> CreatePlayers(IEnumerable<string> playerNames) => playerNames.Select((name, id) => new Player(id, name) {Tiles = CreateStartingTiles(id)}).ToList();

        private ISet<Tile> CreateStartingTiles(int playerId) => _startingTiles
            .Select((creature, i) => (creature, id: playerId * _startingTiles.Length + i))
            .Select(t => new Tile(t.id, playerId, t.creature) {Moves = Cells.ToCoords()})
            .ToHashSet();

        private ISet<Cell> CreateCells() => _initialCoords.GetNeighbors().Prepend(_initialCoords).ToCells();
    }
}
