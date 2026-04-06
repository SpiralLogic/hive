using System.Collections.Generic;
using System.Collections.Immutable;
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
        History = [..history];
    }

    internal GameStatus Move(Move move, bool isAiMove = false)
    {
        if (IsGameOver())
        {
            ClearAllMoves();
            return DetermineWinner();
        }

        if (!IsValidMove(move)) return GameStatus.MoveInvalid;

        History.Add(new(move, _hive.Cells.FindCellOrDefault(move.Tile)?.Coords, isAiMove));
        PerformMove(move);

        var nextPlayer = GetNextPlayer(move.Tile);

        ClearAllMoves();
        if (IsGameOver()) return DetermineWinner();

        UpdateMoves(nextPlayer);

        if (CountMovesAvailable() != 0) return GameStatus.MoveSuccess;

        UpdateMoves(SkipTurn(nextPlayer));
        return GameStatus.MoveSuccessNextPlayerSkipped;
    }

    internal (HashSet<Cell> Cells, List<Player> Players, int HistoryCount) TakeSnapshot()
    {
        return ([.._hive.Cells], _hive.Players.ToList(), History.Count);
    }

    internal void RestoreSnapshot((HashSet<Cell> Cells, List<Player> Players, int HistoryCount) snapshot)
    {
        _hive.Cells.Clear();
        _hive.Cells.UnionWith(snapshot.Cells);
        for (var i = 0; i < _hive.Players.Count; i++)
            _hive.Players[i] = snapshot.Players[i];
        while (History.Count > snapshot.HistoryCount)
            History.RemoveAt(History.Count - 1);
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

    private GameStatus DetermineWinner()
    {
        var surroundedQueens = _hive.Cells.Where(c => c.HasQueen() && c.SelectNeighbors(_hive.Cells).WhereOccupied().Count() == 6)
            .ToArray();
        if (surroundedQueens.Length == 2) return GameStatus.Draw;
        return surroundedQueens[0].Tiles.First(t => t.IsQueen()).PlayerId == 0 ? GameStatus.Player1Win : GameStatus.Player0Win;
    }

    private Player SkipTurn(Player nextPlayer)
    {
        return _hive.Players.First(p => p.Id != nextPlayer.Id);
    }

    private void PerformMove(Move move)
    {
        RemoveTile(move.Tile);
        var (tile, coords) = move;
        var targetCell = _hive.Cells.FindCell(coords);
        ReplaceCell(targetCell, targetCell.AddTile(tile));
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
            var queen = player.Tiles.First(t => t.IsQueen());
            var updatedQueen = queen with { Moves = queen.Moves.Union(availableMoves) };
            ReplacePlayer(player, player with { Tiles = player.Tiles.Remove(queen).Add(updatedQueen) });
            return;
        }

        var updatedTiles = player.Tiles.Select(t => t with { Moves = t.Moves.Union(availableMoves) }).ToImmutableHashSet();
        ReplacePlayer(player, player with { Tiles = updatedTiles });
    }

    private void UpdatedPlacedTileMoves(Player player)
    {
        foreach (var cell in _hive.Cells.WherePlayerControls(player).ToList())
        {
            var tile = cell.TopTile();
            var moves = tile.Creature.GetAvailableMoves(cell, _hive.Cells);
            var updatedTile = tile with { Moves = tile.Moves.Union(moves) };
            var (_, cellWithoutTop) = cell.RemoveTopTile();
            ReplaceCell(cell, cellWithoutTop.AddTile(updatedTile));
        }
    }

    private void ClearAllMoves()
    {
        for (var i = 0; i < _hive.Players.Count; i++)
        {
            var player = _hive.Players[i];
            if (!player.Tiles.Any(t => !t.Moves.IsEmpty)) continue;
            var cleared = player.Tiles
                .Select(t => t.Moves.IsEmpty ? t : t with { Moves = ImmutableHashSet<Coords>.Empty })
                .ToImmutableHashSet();
            _hive.Players[i] = player with { Tiles = cleared };
        }

        var replacements = new List<(Cell Old, Cell New)>();
        foreach (var cell in _hive.Cells)
        {
            if (cell.IsEmpty() || !cell.Tiles.Any(t => !t.Moves.IsEmpty)) continue;
            var newStack = ImmutableStack<Tile>.Empty;
            foreach (var t in cell.Tiles.Reverse())
                newStack = newStack.Push(t.Moves.IsEmpty ? t : t with { Moves = ImmutableHashSet<Coords>.Empty });
            replacements.Add((cell, cell with { Tiles = newStack }));
        }

        foreach (var (old, @new) in replacements)
            ReplaceCell(old, @new);
    }

    private IEnumerable<Tile> GetAllTiles()
    {
        return _hive.Players.SelectMany(p => p.Tiles).Concat(_hive.Cells.SelectMany(c => c.Tiles));
    }

    private int CountMovesAvailable()
    {
        return GetAllTiles().Sum(t => t.Moves.Count);
    }

    private bool IsValidMove(Move move)
    {
        var (tile, coords) = move;
        return GetAllTiles().SingleOrDefault(t => t == tile)?.Moves.Contains(coords) ?? false;
    }

    private void RemoveTile(Tile tile)
    {
        var player = _hive.Players.FindPlayerById(tile.PlayerId);
        ReplacePlayer(player, player.RemoveTile(tile));

        var cell = _hive.Cells.FindCellOrDefault(tile);
        if (cell != null)
        {
            var (_, updatedCell) = cell.RemoveTopTile();
            ReplaceCell(cell, updatedCell);
        }
    }

    private void ReplaceCell(Cell oldCell, Cell newCell)
    {
        _hive.Cells.Remove(oldCell);
        _hive.Cells.Add(newCell);
    }

    private void ReplacePlayer(Player oldPlayer, Player newPlayer)
    {
        var idx = _hive.Players.IndexOf(oldPlayer);
        if (idx >= 0) _hive.Players[idx] = newPlayer;
    }
}
