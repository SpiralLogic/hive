namespace Hive.Domain.Ai;

public record DifficultyOptions(int GlobalMaxSearchTime = 25000, int LocalMaxSearchTime = 3000, int MaxDepth = 3);