using Hive.Domain.Entities;

namespace Hive.Domain.Ai;

internal sealed record ScoredMove(Move? Move, int Score);
