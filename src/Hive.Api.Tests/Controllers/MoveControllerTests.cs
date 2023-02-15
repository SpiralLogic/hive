using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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
using Moq;
using Xunit;
using Move = Hive.Domain.Entities.Move;

namespace Hive.Api.Tests.Controllers;

public class MoveControllerTests
{
    private readonly MoveController _controller;
    private readonly Mock<IHubContext<GameHub>> _hubMock;
    private readonly MemoryDistributedCache _memoryCache;

    public MoveControllerTests()
    {
        var game = HiveFactory.Create(
            new[]
            {
                "player1",
                "player2"
            }
        );
        game.Move(new Move(game.Players[0].Tiles.First(), new Coords(1, 0)));
        game.Move(new Move(game.Players[1].Tiles.First(), new Coords(2, 0)));

        var gameState = new GameState(TestHelpers.ExistingGameId, GameStatus.NewGame, game.Players, game.Cells, new List<HistoricalMove>());

        var jsonOptions = TestHelpers.CreateJsonOptions();
        _memoryCache = TestHelpers.CreateTestMemoryCache();
        _memoryCache.Set(TestHelpers.ExistingGameId, TestHelpers.GetSerializedBytes(gameState, jsonOptions));

        _hubMock = new Mock<IHubContext<GameHub>>();
        _hubMock.Setup(
                m => m.Clients.Group(It.IsAny<string>())
                    .SendCoreAsync(It.IsAny<string>(), It.IsAny<object[]>(), It.IsAny<CancellationToken>())
            )
            .Returns(() => Task.CompletedTask);

        _controller = new MoveController(_hubMock.Object, Options.Create(jsonOptions), _memoryCache);
    }

    [Fact]
    public async Task Post_GameInCache_ReturnsAccepted()
    {
        DTOs.Move move = new(1, new Coords(0, 0));

        var actionResult = await _controller.Post(TestHelpers.ExistingGameId, move);
        var result = actionResult.Should().BeOfType<AcceptedResult>().Subject;
        result.Location.Should().Be($"/game/{TestHelpers.ExistingGameId}");
        result.Value.Should().BeAssignableTo<GameState>();
    }

    [Fact]
    public async Task PostAiMove_GameInCache_ReturnsAccepted()
    {

        var actionResult = await _controller.AiMove(TestHelpers.ExistingGameId);
        var result = actionResult.Should().BeOfType<AcceptedResult>().Subject;
        result.Location.Should().Be($"/game/{TestHelpers.ExistingGameId}");
        result.Value.Should().BeAssignableTo<GameState>();
    }

    [Fact]
    public async Task Post_GameInCache_PerformsMove()
    {
        DTOs.Move move = new(1, new Coords(0, 0));

        var result = (await _controller.Post(TestHelpers.ExistingGameId, move)).Should().BeOfType<AcceptedResult>().Subject;
        var newGameState = result.Value.Should().BeAssignableTo<GameState>().Subject;

        newGameState.Cells.Single(c => c.Coords == move.Coords).Tiles.Should().Contain(t => t.Id == move.TileId);
    }

    [Fact]
    public async Task PostAiMove_GameInCache_PerformsMove()
    {
        var result = (await _controller.AiMove(TestHelpers.ExistingGameId)).Should().BeOfType<AcceptedResult>().Subject;
        result.Value.Should().BeAssignableTo<GameState>();
    }

    [Fact]
    public async Task Post_GameInCache_SendsNewGameState()
    {
        DTOs.Move move = new(3, new Coords(0, 0));

        var result = (await _controller.Post(TestHelpers.ExistingGameId, move)).Should().BeOfType<AcceptedResult>().Subject;
        var newGameState = result.Value.Should().BeAssignableTo<GameState>().Subject;

        _hubMock.Verify(m => m.Clients.Group(TestHelpers.ExistingGameId), Times.Once);
        _hubMock.Verify(
            m => m.Clients.Group(TestHelpers.ExistingGameId)
                .SendCoreAsync(
                    "ReceiveGameState",
                    It.Is<object[]>(a => a.OfType<GameState>().Single() == newGameState),
                    It.IsAny<CancellationToken>()
                ),
            Times.Once
        );
    }

    [Fact]
    public async Task PostAiMove_GameInCache_SendsNewGameState()
    {

        var result = (await _controller.AiMove(TestHelpers.ExistingGameId)).Should().BeOfType<AcceptedResult>().Subject;
        var newGameState = result.Value.Should().BeAssignableTo<GameState>().Subject;

        _hubMock.Verify(m => m.Clients.Group(TestHelpers.ExistingGameId), Times.AtLeastOnce);
        _hubMock.Verify(
            m => m.Clients.Group(TestHelpers.ExistingGameId)
                .SendCoreAsync(
                    "ReceiveGameState",
                    It.Is<object[]>(a => a.OfType<GameState>().Single() == newGameState),
                    It.IsAny<CancellationToken>()
                ),
            Times.Once
        );
    }

    [Fact]
    public async Task Post_GameInCache_InvalidMoveForbidden()
    {
        DTOs.Move move = new(4, new Coords(4, 4));

        (await _controller.Post(TestHelpers.ExistingGameId, move)).Should().BeAssignableTo<BadRequestObjectResult>();
    }

    [Fact]
    public async Task Post_GameInCache_InvalidTileForbidden()
    {
        DTOs.Move move = new(40, new Coords(4, 4));

        (await _controller.Post(TestHelpers.ExistingGameId, move)).Should().BeOfType<ForbidResult>();
    }

    [Fact]
    public async Task Post_IdMissing_ReturnsBadRequest()
    {
        DTOs.Move move = new(1, new Coords(0, 0));
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
        DTOs.Move move = new(1, new Coords(0, 0));

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
        var game = HiveFactory.Create(
            new[]
            {
                "player1",
                "player2"
            }
        );
        var gameState = new GameState(TestHelpers.ExistingGameId, GameStatus.GameOver, game.Players, game.Cells, new List<HistoricalMove>());
        await _memoryCache.SetAsync(TestHelpers.ExistingGameId, TestHelpers.GetSerializedBytes(gameState, TestHelpers.CreateJsonOptions()));

        var actionResult = await _controller.AiMove(TestHelpers.ExistingGameId);
        actionResult.Should().BeOfType<ConflictObjectResult>();
    }
}