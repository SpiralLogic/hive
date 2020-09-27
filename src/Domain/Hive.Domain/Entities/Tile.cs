using System.Collections.Generic;

namespace Hive.Domain.Entities
{
    public record Tile
    {
        public int Id { get; init; }
        public int PlayerId { get; init; }
        public ISet<Coords> Moves { get; init; } = new HashSet<Coords>();
        public Creature Creature { get; init; }

        public Tile(int id, int playerId, Creature creature)
        {
            Id = id;
            PlayerId = playerId;
            Creature = creature;
        }
    }
}