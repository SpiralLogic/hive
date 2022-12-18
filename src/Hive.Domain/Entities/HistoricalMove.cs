namespace Hive.Domain.Entities;

public record HistoricalMove(Move Move, Coords? OriginalCoords);
