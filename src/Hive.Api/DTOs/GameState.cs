using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.Api.DTOs;

public sealed record GameState(
    string GameId,
    GameStatus GameStatus,
    IList<Player> Players,
    ISet<Cell> Cells,
    IList<Domain.Entities.Move>? History = null
)
{
    public IList<Domain.Entities.Move> History { get; } = History ?? new List<Domain.Entities.Move>();
}