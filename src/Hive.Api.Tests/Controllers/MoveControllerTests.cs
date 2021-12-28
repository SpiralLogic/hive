using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Hive.Controllers;
using Hive.Domain;
using Hive.Domain.Entities;
using Hive.DTOs;
using Hive.Hubs;
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
        var game = HiveFactory.CreateHive(new[] {"player1", "player2"});
        game.Move(new Move(game.Players[0].Tiles.First(), new Coords(1, 0)));
        game.Move(new Move(game.Players[1].Tiles.First(), new Coords(2, 0)));

        var gameState = new GameState(game.Players, game.Cells, TestHelpers.ExistingGameId, GameStatus.NewGame);

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

        var actionResult = await _controller.AiMove(TestHelpers.ExistingGameId, 1);
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
        var result = (await _controller.AiMove(TestHelpers.ExistingGameId, 1)).Should().BeOfType<AcceptedResult>().Subject;
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

        var result = (await _controller.AiMove(TestHelpers.ExistingGameId, 1)).Should().BeOfType<AcceptedResult>().Subject;
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

        (await _controller.Post(TestHelpers.ExistingGameId, move)).Should().BeOfType<ForbidResult>();
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
        (await _controller.AiMove(null!, 1)).Should().BeOfType<BadRequestResult>();
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
        (await _controller.AiMove(TestHelpers.MissingGameId, 1)).Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task PostAiMove_PreventRepeatedMoves()
    {
        var game = HiveFactory.CreateHive(new[] {"player1", "player2"});
        var moves = new Move[8];
        for (var i = 0; i < 8; i++)
        {
            moves[i] = new Move(game.Players[(i + 1) % 2].Tiles.First(), new Coords(i, 0));
            game.Move(moves[i]);
        }

        await _memoryCache.SetAsync(
            TestHelpers.ExistingGameId,
            TestHelpers.GetSerializedBytes(
                new GameState(game.Players, game.Cells, TestHelpers.ExistingGameId, GameStatus.MoveSuccess),
                TestHelpers.CreateJsonOptions()
            )
        );

        await _memoryCache.SetAsync(
            TestHelpers.ExistingGameId + "-moves",
            TestHelpers.GetSerializedBytes(moves, TestHelpers.CreateJsonOptions())
        );

        var actionResult = await _controller.AiMove(TestHelpers.ExistingGameId, 1);
        actionResult.Should().BeOfType<AcceptedResult>();
    }

    [Fact]
    public async Task PostAiMove_PreventRepeated_Fallback()
    {
        var game = HiveFactory.CreateHive(new[] {"player1", "player2"});
        var moves = new Move[8];
        for (var i = 0; i < 4; i++)
        {
            var playerId = (i + 1) % 2;
            moves[playerId + i / 2] = new Move(game.Players[playerId].Tiles.First(), new Coords(i, 0));
            game.Move(moves[playerId + i / 2]);
        }

        await _memoryCache.SetAsync(
            TestHelpers.ExistingGameId,
            TestHelpers.GetSerializedBytes(
                new GameState(game.Players, game.Cells, TestHelpers.ExistingGameId, GameStatus.MoveSuccess),
                TestHelpers.CreateJsonOptions()
            )
        );
        await _memoryCache.SetAsync(
            TestHelpers.ExistingGameId + "-moves",
            TestHelpers.GetSerializedBytes(moves, TestHelpers.CreateJsonOptions())
        );
        var actionResult = await _controller.AiMove(TestHelpers.ExistingGameId, 1);
        actionResult.Should().BeOfType<AcceptedResult>();
    }

    [Fact] public async Task PostAiMove_PreventRepeated_DeserializeFallback()
    {
        var game = HiveFactory.CreateHive(new[] {"player1", "player2"});
        var moves = new Move[8];
        for (var i = 0; i < 4; i++)
        {
            var playerId = (i + 1) % 2;
            moves[playerId + i / 2] = new Move(game.Players[playerId].Tiles.First(), new Coords(i, 0));
            game.Move(moves[playerId + i / 2]);
        }

        await _memoryCache.SetAsync(
            TestHelpers.ExistingGameId,
            TestHelpers.GetSerializedBytes(
                new GameState(game.Players, game.Cells, TestHelpers.ExistingGameId, GameStatus.MoveSuccess),
                TestHelpers.CreateJsonOptions()
            )
        );

        await _memoryCache.SetAsync(
            TestHelpers.ExistingGameId + "-moves",
            TestHelpers.GetSerializedBytes(null, TestHelpers.CreateJsonOptions())
        );

        var actionResult = await _controller.AiMove(TestHelpers.ExistingGameId, 1);
        actionResult.Should().BeOfType<AcceptedResult>();
    }

    [Fact]
    public async Task PostAiMove_PreventRepeatedMoves_MissingFallback()
    {
        var game = HiveFactory.CreateHive(new[] {"player1", "player2"});
        var gameState = new GameState(game.Players, game.Cells, TestHelpers.ExistingGameId, GameStatus.MoveSuccess);
        await _memoryCache.SetAsync(
            TestHelpers.ExistingGameId,
            TestHelpers.GetSerializedBytes(gameState, TestHelpers.CreateJsonOptions())
        );

        var actionResult = await _controller.AiMove(TestHelpers.ExistingGameId, 1);
        actionResult.Should().BeOfType<AcceptedResult>();
    }

    [Fact]
    public async Task PostAiMove_PreventMove_AfterGameOver()
    {
        var game = HiveFactory.CreateHive(new[] {"player1", "player2"});
        var gameState = new GameState(game.Players, game.Cells, TestHelpers.ExistingGameId, GameStatus.GameOver);
        await _memoryCache.SetAsync(
            TestHelpers.ExistingGameId,
            TestHelpers.GetSerializedBytes(gameState, TestHelpers.CreateJsonOptions())
        );

        var actionResult = await _controller.AiMove(TestHelpers.ExistingGameId, 1);
        actionResult.Should().BeOfType<ConflictObjectResult>();
    }
}
