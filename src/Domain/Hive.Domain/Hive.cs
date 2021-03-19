using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text.Json;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain
{
    public class Hive
    {
        private readonly Coords _initialCoords = new(0, 0);

        private readonly ImmutableArray<Creature> _startingTiles = ImmutableArray.Create(Creatures.Spider, Creatures.Spider, Creatures.Beetle, Creatures.Beetle, Creatures.Grasshopper, Creatures.Grasshopper,
            Creatures.Grasshopper, Creatures.Queen,  Creatures.Ant, Creatures.Ant, Creatures.Ant);

        public Hive(IEnumerable<string> playerNames)
        {
            Cells = CreateCells();
            Players = CreatePlayers(playerNames);
        }

        public Hive(IList<Player> players, ISet<Cell> cells)
        {
            Cells = cells ?? throw new ArgumentNullException(nameof(cells));
            Players = players ?? throw new ArgumentNullException(nameof(players));
            /*var moves = GetMoves();
            if (!moves.Any())
            {
                var currentPlayer = Players.FindPlayerById(0);
                UpdateMoves(currentPlayer);
            }*/
        }

        public ISet<Cell> Cells { get; }
        public IList<Player> Players { get; }

        public MoveResult Move(Move move)
        {
            if (!IsValidMove(move)) return MoveResult.Invalid;

            PerformMove(move);

            var nextPlayer = GetNextPlayer(move.Tile);
            if (IsGameOver()) return MoveResult.GameOver;

            UpdateMoves(nextPlayer);
            /*if (nextPlayer.Id == 1)
            {
                var newHive = new Hive(JsonSerializer.Deserialize<IList<Player>>(JsonSerializer.Serialize(Players))!, JsonSerializer.Deserialize<ISet<Cell>>(JsonSerializer.Serialize(Cells))!);
                var aiMove = new ComputerPlayer(nextPlayer).GetMove(newHive);
                Move(aiMove);

                return MoveResult.Success;
            }*/
            if (CountMovesAvailable() != 0) return MoveResult.Success;

            UpdateMoves(SkipTurn(nextPlayer));
            return MoveResult.SuccessNextPlayerSkipped;
        }

        private Player SkipTurn(Player nextPlayer)
        {
            return Players.First(p => p.Id != nextPlayer.Id);
        }

        private void UpdateMoves(Player nextPlayer)
        {
            Cells.ExceptWith(Cells.WhereEmpty());
            Cells.UnionWith(Cells.CreateAllEmptyNeighbours());

            UpdatedPlacedTileMoves(nextPlayer);
            UpdatePlayerTileMoves(nextPlayer);
        }

        /*private ISet<Move> GetMoves()
        {

            return Players.SelectMany(p => p.Tiles)
                .Concat(Cells.SelectMany(c => c.Tiles))
                .SelectMany(t => t.Moves.Select(m => new Move(t, m)))
                .ToHashSet();
        }*/

        private void PerformMove(Move move)
        {
            RemoveTile(move.Tile);
            var (tile, coords) = move;
            Cells.First(c => c.Coords == coords)
                .AddTile(tile);
            ClearAllTileMoves();
        }

        private Player GetNextPlayer(Tile movedTile)
        {
            var nextPlayer = Players.First(p => p.Id != movedTile.PlayerId);
            return nextPlayer;
        }

        private bool IsGameOver()
        {
            var loser = Cells.WhereOccupied()
                .Where(c => c.HasQueen())
                .FirstOrDefault(q => q.SelectNeighbors(Cells)
                    .All(n => !n.IsEmpty()));

            if (loser == null) return false;
            foreach (var cell in Cells.WherePlayerOccupies(loser.TopTile()
                    .PlayerId)
                .Where(c => !c.HasQueen())) cell.Tiles.Clear();

            return true;
        }

        private void UpdatePlayerTileMoves(Player player)
        {
            var availableCells = player.Tiles.Count == _startingTiles.Length
                ? Cells.WhereEmpty()
                : Cells.WherePlayerOccupies(player.Id)
                    .SelectMany(c => Cells.SelectEmptyNeighbors(c))
                    .Where(c => Cells.SelectNeighbors(c)
                        .WhereOccupied()
                        .All(c2 => c2.TopTile()
                            .PlayerId == player.Id));

            var availableMoves = availableCells.ToCoords();

            if (player.Tiles.Count == _startingTiles.Length - 3 && player.Tiles.Any(t => t.IsQueen()))
            {
                player.Tiles.First(t => t.IsQueen())
                    .Moves.UnionWith(availableMoves);
                return;
            }

            foreach (var tile in player.Tiles) tile.Moves.UnionWith(availableMoves);
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
            foreach (var tile in Players.SelectMany(p => p.Tiles)
                .Concat(Cells.SelectMany(c => c.Tiles))) tile.Moves.Clear();
        }

        private int CountMovesAvailable()
        {
            return Players.SelectMany(p => p.Tiles)
                .Concat(Cells.SelectMany(c => c.Tiles))
                .SelectMany(t => t.Moves)
                .Count();
        }

        private bool IsValidMove(Move move)
        {
            var (tile, coords) = move;
            return Players.SelectMany(p => p.Tiles)
                .Union(Cells.SelectMany(p => p.Tiles))
                .SingleOrDefault(t => t == tile)
                ?.Moves?.Contains(coords) ?? false;
        }

        private void RemoveTile(Tile tile)
        {
            Players.FindPlayerById(tile.PlayerId)
                .RemoveTile(tile);

            Cells.WhereOccupied()
                .FirstOrDefault(c => c.TopTile() == tile)
                ?.RemoveTopTile();
        }

        private IList<Player> CreatePlayers(IEnumerable<string> playerNames)
        {
            return playerNames.Select((name, id) => new Player(id, name) {Tiles = CreateStartingTiles(id)})
                .ToList();
        }

        private ISet<Tile> CreateStartingTiles(int playerId)
        {
            return _startingTiles.Select((creature, i) => (creature, id: playerId * _startingTiles.Length + i))
                .Select(t => new Tile(t.id, playerId, t.creature) {Moves = Cells.ToCoords()})
                .ToHashSet();
        }

        private ISet<Cell> CreateCells()
        {
            return _initialCoords.GetNeighbors()
                .Prepend(_initialCoords)
                .ToCells();
        }
    }
}
