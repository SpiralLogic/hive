using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hive.Domain.Ai;
using Hive.Domain.Entities;

namespace Hive.Domain;

public class Hive
{
    private readonly Mover _mover;

    public Hive(IList<Player> players, ISet<Cell> cells, IEnumerable<HistoricalMove>? history = null)
    {
        _mover = new Mover(this, history ?? new List<HistoricalMove>());
        Cells = cells ?? throw new ArgumentNullException(nameof(cells));
        Players = players ?? throw new ArgumentNullException(nameof(players));
        var lastMove = history?.LastOrDefault();
        var player = lastMove == null ? players.First() : players.First(p => p.Id != lastMove.Move.Tile.PlayerId);

        _mover.UpdateMoves(player);
    }

    public ISet<Cell> Cells { get; }
    public IList<Player> Players { get; }

    public ICollection<HistoricalMove> History => _mover.History;

    public GameStatus Move(Move move)
    {
        return _mover.Move(move);
    }

    public async ValueTask<GameStatus> AiMove(Func<string, Tile, ValueTask> broadcastThought)
    {
        var aiMove = await new ComputerPlayer(this, new(), broadcastThought).GetMove();
        return _mover.Move(aiMove, true);
    }

    internal void RevertMove()
    {
        _mover.RevertMove();
    }

}