using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain;

internal class Mover 
{
    private readonly Hive _hive;

    internal Mover(Hive hive)
    {
        _hive = hive;
    }

    internal GameStatus Move(Move move)
    {
        if (IsGameOver()) return DetermineWinner();
        if (!IsValidMove(move)) return GameStatus.MoveInvalid;

        PerformMove(move);

        var nextPlayer = GetNextPlayer(move.Tile);
        if (IsGameOver()) return DetermineWinner();

        UpdateMoves(nextPlayer);

        if (CountMovesAvailable() != 0) return GameStatus.MoveSuccess;

        UpdateMoves(SkipTurn(nextPlayer));
        return GameStatus.MoveSuccessNextPlayerSkipped;
    }

    private GameStatus DetermineWinner()
    {
        var surroundedQueens = _hive.Cells.Where(c => c.HasQueen() && c.SelectNeighbors(_hive.Cells).WhereOccupied().Count() == 6)
            .ToArray();
        if (surroundedQueens.Length == 2) return GameStatus.Draw;
        return surroundedQueens.First().Tiles.First(t => t.IsQueen()).PlayerId == 0 ? GameStatus.Player1Win : GameStatus.Player0Win;
    }

    private Player SkipTurn(Player nextPlayer) =>
        _hive.Players.First(p => p.Id != nextPlayer.Id);

    internal void UpdateMoves(Player nextPlayer)
    {
        ClearAllMoves();
        if (_hive.Players.Any(p => p.Tiles.Count != HiveFactory.StartingTiles.Length))
        {
            _hive.Cells.ExceptWith(_hive.Cells.WhereEmpty());
            _hive.Cells.UnionWith(_hive.Cells.CreateAllEmptyNeighbours());

            UpdatedPlacedTileMoves(nextPlayer);
        }

        UpdatePlayerTileMoves(nextPlayer);
    }

    internal void PerformMove(Move move)
    {
        RemoveTile(move.Tile);
        var (tile, coords) = move;
        _hive.Cells.First(c => c.Coords == coords).AddTile(tile);
    }

    private Player GetNextPlayer(Tile movedTile)
    {
        return _hive.Players.First(p => p.Id != movedTile.PlayerId);
    }

    private bool IsGameOver()
    {
        var loser = _hive.Cells.WhereOccupied()
            .Where(c => c.HasQueen())
            .FirstOrDefault(q => q.SelectNeighbors(_hive.Cells).All(n => !n.IsEmpty()));
        return loser != null;
    }

    private void UpdatePlayerTileMoves(Player player)
    {
        var availableCells = player.Tiles.Count == HiveFactory.StartingTiles.Length
            ? _hive.Cells.WhereEmpty()
            : _hive.Cells.WhereEmpty().Where(n => _hive.Cells.SelectOccupiedNeighbors(n).All(c => c.PlayerControls(player)));

        var availableMoves = availableCells.ToCoords();

        if (player.Tiles.Count == HiveFactory.StartingTiles.Length - 3 && player.Tiles.Any(t => t.IsQueen()))
        {
            player.Tiles.First(t => t.IsQueen()).Moves.AddMany(availableMoves);
            return;
        }

        foreach (var tile in player.Tiles) tile.Moves.AddMany(availableMoves);
    }

    private void UpdatedPlacedTileMoves(Player player)
    {
        foreach (var cell in _hive.Cells.WherePlayerControls(player))
        {
            var tile = cell.TopTile();
            var moves = tile.Creature.GetAvailableMoves(cell, _hive.Cells);
            tile.Moves.AddMany(moves);
        }
    }

    private void ClearAllMoves()
    {
        foreach (var tile in GetAllTiles())
            tile.Moves.Clear();
    }

    private IEnumerable<Tile> GetAllTiles()
    {
        return _hive.Players.SelectMany(p => p.Tiles).Concat(_hive.Cells.SelectMany(c => c.Tiles));
    }

    private int CountMovesAvailable()
    {
        return GetAllTiles().SelectMany(t => t.Moves).Count();
    }

    private bool IsValidMove(Move move)
    {
        var (tile, coords) = move;
        return GetAllTiles().SingleOrDefault(t => t == tile)?.Moves.Contains(coords) ?? false;
    }

    private void RemoveTile(Tile tile)
    {
        _hive.Players.FindPlayerById(tile.PlayerId).RemoveTile(tile);
        _hive.Cells.FindCellOrDefault(tile)?.RemoveTopTile();
    }
}
