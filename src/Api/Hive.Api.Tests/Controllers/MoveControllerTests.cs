using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Hive.Controllers;
using Hive.Converters;
using Hive.Domain.Entities;
using Hive.DTOs;
using Hive.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;
using Move = Hive.Domain.Entities.Move;

namespace Hive.Api.Tests.Controllers
{
    public class MoveControllerTests
    {
        private readonly MoveController _controller;
        private readonly Mock<IHubContext<GameHub>> _hubMock;

        public MoveControllerTests()
        {
            var game = new Domain.Hive(new[] {"player1", "player2"});
            game.Move(new Move(game.Players[0].Tiles.First(), new Coords(1, 0)));
            game.Move(new Move(game.Players[1].Tiles.First(), new Coords(2, 0)));
            var gameState = new GameState(game.Players, game.Cells, TestHelpers.ExistingGameId, GameStatus.NewGame);

            var jsonOptions = TestHelpers.CreateJsonOptions();
            var memoryCache = TestHelpers.CreateTestMemoryCache();
            memoryCache.Set(TestHelpers.ExistingGameId, TestHelpers.GetSerializedBytes(gameState, jsonOptions));

            _hubMock = new Mock<IHubContext<GameHub>>();
            _hubMock.Setup(m =>
                    m.Clients
                        .Group(It.IsAny<string>())
                        .SendCoreAsync(It.IsAny<string>(), It.IsAny<object[]>(), It.IsAny<CancellationToken>()))
                .Returns(() => Task.CompletedTask);
            
            _controller = new MoveController(_hubMock.Object, Options.Create(jsonOptions), memoryCache);
        }

        [Fact]
        public async Task Post_IdMissing_ReturnsBadRequest()
        {
            DTOs.Move move = new(1, new Coords(0, 0));
            (await _controller.Post(null!, move)).Should().BeOfType<BadRequestResult>();
        }

        [Fact]
        public async Task Post_MoveMissing_ReturnsBadRequest() =>
            (await _controller.Post(TestHelpers.ExistingGameId, null!)).Should().BeOfType<BadRequestResult>();

        [Fact]
        public async Task Post_GameNotInCache_ReturnsNotFound()
        {
            DTOs.Move move = new(1, new Coords(0, 0));

            (await _controller.Post(TestHelpers.MissingGameId, move)).Should().BeOfType<NotFoundResult>();
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
        public async Task Post_GameInCache_PerformsMove()
        {
            DTOs.Move move = new(1, new Coords(0, 0));

            var result = (await _controller.Post(TestHelpers.ExistingGameId, move)).Should().BeOfType<AcceptedResult>().Subject;
            var newGameState = result.Value.Should().BeAssignableTo<GameState>().Subject;

            newGameState.Cells.Single(c => c.Coords == move.Coords).Tiles.Should().Contain(t => t.Id == move.TileId);
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
                    .SendCoreAsync("ReceiveGameState",
                        It.Is<object[]>(a => a.OfType<GameState>().Single() == newGameState),
                        It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task Post_GameInCache_InvalidMoveForbidden()
        {
            DTOs.Move move = new(4, new Coords(4, 4));

            var result = (await _controller.Post(TestHelpers.ExistingGameId, move)).Should().BeOfType<ForbidResult>().Subject;
        }
    }
}