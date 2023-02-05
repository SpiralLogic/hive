using System.Collections.Generic;
using System.Linq;
using Hive.Domain.Entities;
using Hive.Domain.Extensions;

namespace Hive.Domain;

internal class Mover
{
    private readonly Hive _hive;
    internal readonly List<HistoricalMove> History;

    internal Mover(Hive hive, IEnumerable<HistoricalMove> history)
    {
        _hive = hive;
        History = new List<HistoricalMove>(history);
    }

    internal GameStatus Move(Move move, bool isAiMove = false)
    {
        History.Add(new HistoricalMove(move, _hive.Cells.FindCellOrDefault(move.Tile)?.Coords, isAiMove));
        if (IsGameOver())
        {
            ClearAllMoves();
            return DetermineWinner();
        }

        if (!IsValidMove(move)) return GameStatus.MoveInvalid;

        PerformMove(move);

        var nextPlayer = GetNextPlayer(move.Tile);

        ClearAllMoves();
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

    private Player SkipTurn(Player nextPlayer)
    {
        return _hive.Players.First(p => p.Id != nextPlayer.Id);
    }

    internal void UpdateMoves(Player nextPlayer)
    {
        if (_hive.Players.Any(p => p.Tiles.Count != HiveFactory.StartingTiles.Length))
        {
            _hive.Cells.ExceptWith(_hive.Cells.WhereEmpty());
            _hive.Cells.UnionWith(_hive.Cells.CreateAllEmptyNeighbours());

            UpdatedPlacedTileMoves(nextPlayer);
        }

        UpdatePlayerTileMoves(nextPlayer);
    }

    private void PerformMove(Move move)
    {
        RemoveTile(move.Tile);
        var (tile, coords) = move;
        _hive.Cells.First(c => c.Coords == coords).AddTile(tile);
    }

    private void RefreshMoves(Player player)
    {
        UpdateMoves(player);
    }

    internal void RevertMove()
    {
        var (move, coords, _) = this.History.Last();
        this.History.RemoveAt(this.History.Count - 1);

        var currentCell = _hive.Cells.FindTile(move.Tile.Id);
        var player = _hive.Players.FindPlayerById(move.Tile.PlayerId);

        if (coords == null) RevertMoveOnBoard(currentCell, player);
        else RevertMoveFromPlayerTiles(currentCell, coords);

        this.RefreshMoves(player);
    }

    private static void RevertMoveOnBoard(Cell currentCell, Player player)
    {
        player.Tiles.Add(currentCell.RemoveTopTile());
    }

    private void RevertMoveFromPlayerTiles(Cell currentCell, Coords coords)
    {
        var tile = currentCell.TopTile();
        var moves = tile.Creature.GetAvailableMoves(currentCell, _hive.Cells);
        tile.Moves.AddMany(moves);
        this.PerformMove(new Move(currentCell.TopTile(), coords));
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