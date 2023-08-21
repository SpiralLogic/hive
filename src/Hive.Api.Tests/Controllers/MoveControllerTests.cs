using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FakeItEasy;
using FluentAssertions;
using Hive.Api.Controllers;
using Hive.Api.DTOs;
using Hive.Api.Hubs;
using Hive.Domain;
using Hive.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Xunit;
using Move = Hive.Domain.Entities.Move;

namespace Hive.Api.Tests.Controllers;

public class MoveControllerTests
{
    private readonly MoveController _controller;
    private readonly IHubContext<GameHub> _hubMock;
    private readonly MemoryDistributedCache _memoryCache;
    private static readonly string[] PlayerNames =
    {
        "player1", "player2"
    };

    public MoveControllerTests()
    {
        var game = HiveFactory.Create(
            PlayerNames
        );
        game.Move(new(game.Players[0].Tiles.First(), new(1, 0)));
        game.Move(new(game.Players[1].Tiles.First(), new(2, 0)));

        var gameState = new GameState(TestHelpers.ExistingGameId, GameStatus.NewGame, game.Players, game.Cells, new List<HistoricalMove>());

        var jsonOptions = TestHelpers.CreateJsonOptions();
        _memoryCache = TestHelpers.CreateTestMemoryCache();
        _memoryCache.Set(TestHelpers.ExistingGameId, TestHelpers.GetSerializedBytes(gameState, jsonOptions));

        var clients = A.Fake<IClientProxy>();
        A.CallTo(() =>  clients.SendCoreAsync(A<string>._, A<object[]>._, A<CancellationToken>._))
            .Returns(Task.CompletedTask);

        _hubMock = A.Fake<IHubContext<GameHub>>();

        A.CallTo(() => _hubMock.Clients.Group(A<string>._)).Returns(clients);


        _controller = new(_hubMock, Options.Create(jsonOptions), _memoryCache);
    }

    [Fact]
    public async Task Post_GameInCache_ReturnsAccepted()
    {
        DTOs.Move move = new(1, new(0, 0));

        var actionResult = await _controller.Post(TestHelpers.ExistingGameId, move);
        var result = actionResult.Should().BeOfType<AcceptedAtRouteResult>().Subject;
        result.RouteName.Should().Be("GameEndpointApi");
        result.Value.Should().BeAssignableTo<GameState>();
    }

    [Fact]
    public async Task PostAiMove_GameInCache_ReturnsAccepted()
    {

        var actionResult = await _controller.AiMove(TestHelpers.ExistingGameId);
        var result = actionResult.Should().BeOfType<AcceptedAtRouteResult>().Subject;
        result.RouteName.Should().Be("GameEndpointApi");
        result.RouteValues.Should().ContainValue(TestHelpers.ExistingGameId);
        result.Value.Should().BeAssignableTo<GameState>();
    }

    [Fact]
    public async Task Post_GameInCache_PerformsMove()
    {
        DTOs.Move move = new(1, new(0, 0));

        var result = (await _controller.Post(TestHelpers.ExistingGameId, move)).Should().BeOfType<AcceptedAtRouteResult>().Subject;
        var newGameState = result.Value.Should().BeAssignableTo<GameState>().Subject;

        newGameState.Cells.Single(c => c.Coords == move.Coords).Tiles.Should().Contain(t => t.Id == move.TileId);
    }

    [Fact]
    public async Task PostAiMove_GameInCache_PerformsMove()
    {
        var result = (await _controller.AiMove(TestHelpers.ExistingGameId)).Should().BeOfType<AcceptedAtRouteResult>().Subject;
        result.Value.Should().BeAssignableTo<GameState>();
    }

    [Fact]
    public async Task Post_GameInCache_SendsNewGameState()
    {
        DTOs.Move move = new(3, new(0, 0));

        var result = (await _controller.Post(TestHelpers.ExistingGameId, move)).Should().BeOfType<AcceptedAtRouteResult>().Subject;
        var newGameState = result.Value.Should().BeAssignableTo<GameState>().Subject;

        A.CallTo(() => _hubMock.Clients.Group(TestHelpers.ExistingGameId)).MustHaveHappenedOnceExactly();
        A.CallTo(() => _hubMock.Clients.Group(TestHelpers.ExistingGameId)
            .SendCoreAsync(
                "ReceiveGameState",
                A<object[]>.That.Matches(a => (GameState)a[0] == newGameState),
                A<CancellationToken>._)).MustHaveHappenedOnceExactly();
    }

    [Fact]
    public async Task PostAiMove_GameInCache_SendsNewGameState()
    {

        var result = (await _controller.AiMove(TestHelpers.ExistingGameId)).Should().BeOfType<AcceptedAtRouteResult>().Subject;
        var newGameState = result.Value.Should().BeAssignableTo<GameState>().Subject;

        A.CallTo(() => _hubMock.Clients.Group(TestHelpers.ExistingGameId)).MustHaveHappenedOnceOrMore();
        A.CallTo(() => _hubMock.Clients.Group(TestHelpers.ExistingGameId)
            .SendCoreAsync(
                "ReceiveGameState",
                A<object[]>.That.Matches(a => (GameState)a[0] == newGameState),
                A<CancellationToken>._)).MustHaveHappenedOnceExactly();
    }

    [Fact]
    public async Task Post_GameInCache_InvalidMoveForbidden()
    {
        DTOs.Move move = new(4, new(4, 4));

        (await _controller.Post(TestHelpers.ExistingGameId, move)).Should().BeAssignableTo<BadRequestObjectResult>();
    }

    [Fact]
    public async Task Post_GameInCache_InvalidTileForbidden()
    {
        DTOs.Move move = new(40, new(4, 4));

        (await _controller.Post(TestHelpers.ExistingGameId, move)).Should().BeOfType<ForbidResult>();
    }

    [Fact]
    public async Task Post_IdMissing_ReturnsBadRequest()
    {
        DTOs.Move move = new(1, new(0, 0));
        (await _controller.Post(null!, move)).Should().BeOfType<BadRequestResult>();
    }

    [Fact]
    public async Task PostAiMove_IdMissing_ReturnsBadRequest()
    {
        (await _controller.AiMove(null!)).Should().BeOfType<BadRequestResult>();
    }

    [Fact]
    public async Task Post_GameNotInCache_ReturnsNotFound()
    {
        DTOs.Move move = new(1, new(0, 0));

        (await _controller.Post(TestHelpers.MissingGameId, move)).Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task PostAiMove_GameNotInCache_ReturnsNotFound()
    {
        (await _controller.AiMove(TestHelpers.MissingGameId)).Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task PostAiMove_PreventMove_AfterGameOver()
    {
        var game = HiveFactory.Create(PlayerNames);
        var gameState = new GameState(TestHelpers.ExistingGameId,
            GameStatus.GameOver,
            game.Players,
            game.Cells,
            new List<HistoricalMove>());
        await _memoryCache.SetAsync(TestHelpers.ExistingGameId, TestHelpers.GetSerializedBytes(gameState, TestHelpers.CreateJsonOptions()));

        var actionResult = await _controller.AiMove(TestHelpers.ExistingGameId);
        actionResult.Should().BeOfType<ConflictObjectResult>();
    }
}