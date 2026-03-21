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

internal sealed class GameSessionStore : IGameSessionStore
{
    private readonly IDistributedCache _distributedCache;
    private readonly JsonSerializerOptions _jsonSerializerOptions;

    public GameSessionStore(IDistributedCache distributedCache, JsonSerializerOptions jsonSerializerOptions)
    {
        _distributedCache = distributedCache;
        _jsonSerializerOptions = jsonSerializerOptions;
    }

    public async ValueTask<GameState?> GetGame(string gameId)
    {
        var gameSessionJson = await _distributedCache.GetStringAsync(gameId).ConfigureAwait(false);
        if (string.IsNullOrEmpty(gameSessionJson)) return null;
        return JsonSerializer.Deserialize<GameState>(gameSessionJson, _jsonSerializerOptions);
    }

    public async ValueTask SetGame(string gameId, GameState gameState)
    {
        var gameJson = JsonSerializer.Serialize(gameState, _jsonSerializerOptions);
        await _distributedCache.SetStringAsync(gameId, gameJson).ConfigureAwait(false);
    }

    public async ValueTask<bool> Exists(string gameId)
    {
        var gameSessionJson = await _distributedCache.GetStringAsync(gameId).ConfigureAwait(false);
        return !string.IsNullOrEmpty(gameSessionJson);
    }
}
