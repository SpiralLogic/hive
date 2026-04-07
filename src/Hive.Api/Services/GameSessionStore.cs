using System.Text.Json;
using System.Threading.Tasks;
using Hive.Api.DTOs;
using Microsoft.Extensions.Caching.Distributed;

namespace Hive.Api.Services;

public interface IGameSessionStore
{
    ValueTask<GameState?> GetGame(string gameId);
    ValueTask SetGame(string gameId, GameState gameState);
    ValueTask<bool> Exists(string gameId);
}

internal sealed class GameSessionStore(IDistributedCache distributedCache, JsonSerializerOptions jsonSerializerOptions)
    : IGameSessionStore
{
    public async ValueTask<GameState?> GetGame(string gameId)
    {
        var gameSessionJson = await distributedCache.GetStringAsync(gameId).ConfigureAwait(false);
        return string.IsNullOrEmpty(gameSessionJson) ? null : JsonSerializer.Deserialize<GameState>(gameSessionJson, jsonSerializerOptions);
    }

    public async ValueTask SetGame(string gameId, GameState gameState)
    {
        var gameJson = JsonSerializer.Serialize(gameState, jsonSerializerOptions);
        await distributedCache.SetStringAsync(gameId, gameJson).ConfigureAwait(false);
    }

    public async ValueTask<bool> Exists(string gameId)
    {
        var data = await distributedCache.GetAsync(gameId).ConfigureAwait(false);
        return data is { Length: > 0 };
    }
}
