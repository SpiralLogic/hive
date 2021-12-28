using System.Collections.Generic;
using Hive.Domain.Entities;

namespace Hive.DTOs;

public sealed record GameState(IList<Player> Players, ISet<Cell> Cells, string GameId, GameStatus GameStatus);