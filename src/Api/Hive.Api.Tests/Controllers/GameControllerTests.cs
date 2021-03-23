using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Hive.Controllers;
using Hive.Converters;
using Hive.Domain.Entities;
using Hive.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace Hive.Api.Tests.Controllers
{
    public class GameControllerTests
    {
        private const string ExistingGameId = "EXISTING_GAME_ID";
        private const string MissingGameId = "MISSING_GAME_ID";
        private readonly GameController _controller;

        public GameControllerTests()
        {
            var game = new Domain.Hive(new[] {"player1", "player2"});
            var gameState = new GameState(game.Players, game.Cells, ExistingGameId, GameStatus.MoveSuccess);

            var jsonOptions = new JsonOptions();
            jsonOptions.JsonSerializerOptions.Converters.Add(new CreatureJsonConverter());
            jsonOptions.JsonSerializerOptions.Converters.Add(new StackJsonConverter());
            jsonOptions.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

            var optionsMock = new Mock<IOptions<JsonOptions>>();
            optionsMock.SetupGet(m => m.Value).Returns(jsonOptions);

            var memoryCacheMock = new Mock<IDistributedCache>();
            memoryCacheMock.Setup(m => m.GetAsync(ExistingGameId, It.IsAny<CancellationToken>()))
                .Returns(() =>
                    Task.FromResult(Encoding.Default.GetBytes(JsonSerializer.Serialize(gameState, jsonOptions.JsonSerializerOptions))));
            memoryCacheMock.Setup(m => m.GetAsync(MissingGameId, It.IsAny<CancellationToken>()))
                .Returns(() => Task.FromResult<byte[]>(null));
            _controller = new GameController(optionsMock.Object, memoryCacheMock.Object);
        }

        [Fact]
        public async Task Get_GameInCache_ReturnsIndexHtml() =>
            (await _controller.Get(ExistingGameId)).Should().BeAssignableTo<VirtualFileResult>().Which.FileName.Should().Be("/index.html");

        [Fact]
        public async Task Get_GameInNotCache_Redirects() =>
            (await _controller.Get(MissingGameId)).Should().BeAssignableTo<RedirectResult>().Which.Url.Should().Be("/");

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
}
