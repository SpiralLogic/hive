using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public record Tile
    {
    public int Id { get; init; }
    public int PlayerId { get; init; }
    public string Content { get; init; }
    public ISet<Coords> Moves { get; init; } = new HashSet<Coords>();

    public Tile(int id, int playerId, string content)
    {
        Id = id;
        PlayerId = playerId;
        Content = content;
    }
    }
}