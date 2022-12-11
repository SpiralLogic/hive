using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading.Tasks;
using Hive.Domain.Ai;
using Hive.Domain.Entities;

namespace Hive.Domain;

public class Hive
{
    private readonly Mover _mover;

    public Hive(IList<Player> players, ISet<Cell> cells, IList<Move>? history = null)
    {
        _mover = new Mover(this, history ?? new List<Move>());
        Cells = cells ?? throw new ArgumentNullException(nameof(cells));
        Players = players ?? throw new ArgumentNullException(nameof(players));
    }

    public ISet<Cell> Cells { get; }
    public IList<Player> Players { get; }

    public IImmutableList<Move> History => _mover.History.ToImmutableList();

    public GameStatus Move(Move move)
    {
        return _mover.Move(move);
    }

    public async ValueTask<(GameStatus status, Move move)> AiMove(Func<string, Tile, ValueTask> broadcastThought)
    {
        var aiMove = await new ComputerPlayer(this, broadcastThought).GetMove();

        return (Move(aiMove), aiMove);
    }

    internal void PerformMove(Move move)
    {
        _mover.PerformMove(move);
    }

    internal void RefreshMoves(Player player)
    {
        _mover.UpdateMoves(player);
    }
}