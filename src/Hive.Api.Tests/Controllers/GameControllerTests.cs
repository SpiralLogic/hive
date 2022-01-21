using System.Threading.Tasks;
using FluentAssertions;
using Hive.Controllers;
using Hive.Domain;
using Hive.Domain.Entities;
using Hive.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Xunit;

namespace Hive.Api.Tests.Controllers;

public class GameControllerTests
{
    private const string ExistingGameId = "EXISTING_GAME_ID";
    private const string MissingGameId = "MISSING_GAME_ID";
    private readonly GameController _controller;

    public GameControllerTests()
    {
        var game = HiveFactory.Create(new[] { "player1", "player2" });
        var gameState = new GameState(game.Players, game.Cells, ExistingGameId, GameStatus.MoveSuccess);

        var jsonOptions = TestHelpers.CreateJsonOptions();
        var memoryCache = TestHelpers.CreateTestMemoryCache();
        memoryCache.Set(TestHelpers.ExistingGameId, TestHelpers.GetSerializedBytes(gameState, jsonOptions));

        _controller = new GameController(Options.Create(jsonOptions), memoryCache);
    }

    [Fact]
    public async Task Get_GameInCache_ReturnsIndexHtml()
    {
        (await _controller.Get(ExistingGameId)).Should().BeAssignableTo<VirtualFileResult>().Which.FileName.Should().Be("/index.html");
    }

    [Fact]
    public async Task Get_GameInNotCache_Redirects()
    {
        (await _controller.Get(MissingGameId)).Should().BeAssignableTo<RedirectResult>().Which.Url.Should().Be("/");
    }

    [Fact]
    public async Task GetGame_GameInCache_ReturnsGame()
    {
        var actionResult = (await _controller.GetGame(ExistingGameId)).Result.Should().BeOfType<OkObjectResult>().Subject;
        actionResult.Value.Should().BeAssignableTo<GameState>();
    }

    [Fact]
    public async Task GetGame_GameNotInCache_ReturnsNotFound()
    {
        var res = await _controller.GetGame(MissingGameId);
        res.Result.Should().BeOfType<NotFoundResult>();
    }
}
