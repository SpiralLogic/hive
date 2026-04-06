using System.Threading.Tasks;
using AwesomeAssertions;
using Hive.Api.Controllers;
using Hive.Api.DTOs;
using Hive.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Xunit;

namespace Hive.Api.Tests.Controllers;

public class NewControllerTests
{
    private const string NewGameId = "NEW_GAME_ID";
    private readonly NewController _controller;
    private readonly MemoryDistributedCache _memoryCache;

    public NewControllerTests()
    {
        var jsonOptions = TestHelpers.CreateJsonOptions();
        _memoryCache = TestHelpers.CreateTestMemoryCache();
        IGameSessionStore gameSessionStore = TestHelpers.CreateSessionStore(_memoryCache, jsonOptions);
        var httpContext = new DefaultHttpContext { TraceIdentifier = NewGameId };
        _controller = new(gameSessionStore) { ControllerContext = { HttpContext = httpContext } };
    }

    [Fact]
    public async Task Post_CreatesNewGame()
    {
        (await _controller.Post()).Should()
            .BeAssignableTo<CreatedAtRouteResult>()
            .Which.Value.Should()
            .BeAssignableTo<GameState>()
            .Which.GameId.Should()
            .BeAssignableTo<string>();
    }

    [Fact]
    public async Task Post_StoresNewGameInCache()
    {
        var result = await _controller.Post();
        var gameId = result.Value.Should().BeAssignableTo<GameState>().Subject.GameId;
        (await _memoryCache.GetStringAsync(gameId)).Should().NotBeNullOrEmpty();
    }
}
