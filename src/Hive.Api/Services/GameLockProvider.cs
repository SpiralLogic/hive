using System.Collections.Concurrent;
using System.Threading;

namespace Hive.Api.Services;

public interface IGameLockProvider
{
    SemaphoreSlim GetGameLock(string gameId);
}

internal sealed class GameLockProvider : IGameLockProvider
{
    private readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();

    public SemaphoreSlim GetGameLock(string gameId)
    {
        return _locks.GetOrAdd(gameId, _ => new SemaphoreSlim(1, 1));
    }
}
