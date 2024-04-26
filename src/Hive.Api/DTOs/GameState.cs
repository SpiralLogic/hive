using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Api.DTOs;

public sealed record GameState(
    string GameId,
    GameStatus GameStatus,
    IList<Player> Players,
    ISet<Cell> Cells,
    ICollection<HistoricalMove>? History = null
)
{
    public ICollection<HistoricalMove> History { get; } = History ?? new List<HistoricalMove>();
}