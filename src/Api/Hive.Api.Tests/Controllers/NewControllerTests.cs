using FluentAssertions;
using Hive.Controllers;
using Hive.Converters;
using Hive.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace Hive.Api.Tests.Controllers
{
    public class NewControllerTests
    {
        private const string NewGameId = "NEW_GAME_ID";
        private readonly NewController _controller;
        private readonly Mock<IDistributedCache> _memoryCacheMock;

        public NewControllerTests()
        {
            var jsonOptions = new JsonOptions();
            jsonOptions.JsonSerializerOptions.Converters.Add(new CreatureJsonConverter());
            jsonOptions.JsonSerializerOptions.Converters.Add(new StackJsonConverter());

            var optionsMock = new Mock<IOptions<JsonOptions>>();
            optionsMock.SetupGet(m => m.Value)
                .Returns(jsonOptions);

            _memoryCacheMock = new Mock<IDistributedCache>();
            _memoryCacheMock.Setup(m => m.Set(It.IsAny<string>(), It.IsAny<byte[]>(), It.IsAny<DistributedCacheEntryOptions>()));

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.SetupGet(m => m.TraceIdentifier)
                .Returns(NewGameId);
            _controller = new NewController(optionsMock.Object, _memoryCacheMock.Object) {ControllerContext = {HttpContext = httpContextMock.Object}};
        }

        [Fact]
        public void Post_CreatesNewGame()
        {
            _controller.Post()
                .Should()
                .BeAssignableTo<CreatedResult>()
                .Which.Value.Should()
                .BeAssignableTo<GameState>()
                .Which.GameId.Should()
                .BeAssignableTo<string>();
        }

        [Fact]
        public void Post_StoresNewGameInCache()
        {
            var result = _controller.Post();
            var gameId = result.Value.Should()
                .BeAssignableTo<GameState>()
                .Subject.GameId;
            _memoryCacheMock.Verify(m => m.Set(gameId, It.IsAny<byte[]>(), It.IsAny<DistributedCacheEntryOptions>()));
        }
    }
}
