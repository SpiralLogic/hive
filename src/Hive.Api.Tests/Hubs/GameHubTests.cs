using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using FakeItEasy;
using FluentAssertions;
using Hive.Api.Hubs;
using Hive.Domain.Entities;
using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SignalR;
using Xunit;

namespace Hive.Api.Tests.Hubs;

public class GameHubTests
{
    private const string HubConnectionId = "HUB_CONNECTION_ID";
    private const string HubGroupName = "GameId";
    private readonly IGroupManager _groupManagerMock = A.Fake<IGroupManager>();
    private readonly IClientProxy _clientProxyMock = A.Fake<IClientProxy>();

    private readonly IFeatureCollection _featureCollectionMock = A.Fake<IFeatureCollection>();

    private GameHub CreateGameHub(string playerId)
    {
        var httpContextFeatureMock = A.Fake<IHttpContextFeature>();

        var feature1 = new RoutingFeature();
        feature1.RouteData = new();
        feature1.RouteData.Values.Add("id", HubGroupName);
        var feature2 = new RoutingFeature();
        feature2.RouteData = new();
        feature2.RouteData.Values.Add("playerId", playerId);
        var feature3 = new RoutingFeature();
        feature3.RouteData = new();
        feature3.RouteData.Values.Add("id", null);
        var feature4 = new RoutingFeature();
        feature4.RouteData = new();
        feature4.RouteData.Values.Add("playerId", null);
        A.CallTo(() => httpContextFeatureMock.HttpContext!.Features.Get<IRoutingFeature>())
            .ReturnsNextFromSequence(feature1, feature2, feature3, feature4);

        A.CallTo(() => _featureCollectionMock.Get<IHttpContextFeature>()).Returns(httpContextFeatureMock);

        var hubCallerContextMock = A.Fake<HubCallerContext>();
        A.CallTo(() => hubCallerContextMock.ConnectionId).Returns(HubConnectionId);
        A.CallTo(() => hubCallerContextMock.Features).Returns(_featureCollectionMock);

        var hubCallerClientsMock = A.Fake<IHubCallerClients>();
        A.CallTo(() => hubCallerClientsMock.OthersInGroup(A<string>.Ignored)).Returns(_clientProxyMock);
        A.CallTo(() => hubCallerClientsMock.Group(A<string>.Ignored)).Returns(_clientProxyMock);

        var hub = new GameHub();
        hub.Context = hubCallerContextMock;
        hub.Groups = _groupManagerMock;
        hub.Clients = hubCallerClientsMock;
        return hub;
    }

    public class ValidGameHubTests : GameHubTests
    {
        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public async Task NewConnectionsAreAddedToGroup(string playerId)
        {

            var hub = CreateGameHub(playerId);
            await hub.OnConnectedAsync();
            A.CallTo(() => _groupManagerMock.AddToGroupAsync(HubConnectionId, HubGroupName, A<CancellationToken>.Ignored))
                .MustHaveHappened();
        }

        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public async Task NewConnectionsAreAddedToPlayerGroup(string playerId)
        {

            var hub = CreateGameHub(playerId);

            await hub.OnConnectedAsync();
            var a = Fake.GetCalls(_clientProxyMock);
            A.CallTo(() => _groupManagerMock.AddToGroupAsync(HubConnectionId, HubGroupName, A<CancellationToken>.Ignored))
                .MustHaveHappened();
            A.CallTo(() => _groupManagerMock.AddToGroupAsync(HubConnectionId, HubGroupName, A<CancellationToken>.Ignored))
                .MustHaveHappened();
            A.CallTo(() => _clientProxyMock.SendCoreAsync(
                "PlayerConnection",
                A<object[]>.That.Matches(s =>
                    s[0] as string == "connect" && (int)s[1] == int.Parse(playerId, NumberStyles.Integer, CultureInfo.InvariantCulture)),
                A<CancellationToken>.Ignored
            )).MustHaveHappened();
        }

        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public async Task DisconnectionsAreRemovedFromPlayerGroup(string playerId)
        {
            var playerIdString = int.Parse(playerId, NumberStyles.Integer, CultureInfo.InvariantCulture);
            var hub = CreateGameHub(playerId);
            var a = Fake.GetCalls(_clientProxyMock);
            await hub.OnDisconnectedAsync(null);
            A.CallTo(() => _clientProxyMock.SendCoreAsync(
                "PlayerConnection",
                A<object[]>.That.Matches(s => s[0] as string == "disconnect" && (int)s[1] == playerIdString),
                A<CancellationToken>._
            )).MustHaveHappened();
        }


        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public async Task SendsPieceSelectionToGroup(string playerId)
        {
            var selectedTile = new Tile(1, 1, Creatures.Grasshopper);
            var hub = CreateGameHub(playerId);
            await hub.SendSelection("select", selectedTile);
            A.CallTo(() => _clientProxyMock.SendCoreAsync(
                "OpponentSelection",
                A<object[]>.That.Matches(s => s[0] as string == "select" && (Tile)s[1] == selectedTile),
                A<CancellationToken>.Ignored
            )).MustHaveHappened();
        }

        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public async Task InvalidGroupReturnsTask(string playerId)
        {
            var selectedTile = new Tile(1, 1, Creatures.Grasshopper);
            var hub = CreateGameHub(playerId);
            await hub.SendSelection("select", selectedTile);
            hub.SendSelection("select", selectedTile).IsCompletedSuccessfully.Should().BeTrue();
        }
    }

    public class InvalidContextTests : GameHubTests
    {

        private GameHub CreateGameHubWithInvalidContext(string playerId)
        {

            var hub = CreateGameHub(playerId);
            return hub;
        }
        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public void SendSelectionReturnsTask(string playerId)
        {
            var hub = CreateGameHubWithInvalidContext(playerId);

            var selectedTile = new Tile(1, 1, Creatures.Grasshopper);
            hub.SendSelection("select", selectedTile).IsCompletedSuccessfully.Should().BeTrue();
        }


        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public void OnConnectedAsyncReturnsTask(string playerId)
        {
            var hub = CreateGameHubWithInvalidContext(playerId);
            hub.OnConnectedAsync().IsCompletedSuccessfully.Should().BeTrue();
        }

        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public void OnDisconnectedAsyncReturnsTask(string playerId)
        {
            var hub = CreateGameHubWithInvalidContext(playerId);
            hub.OnDisconnectedAsync(null).IsCompletedSuccessfully.Should().BeTrue();
        }

        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public void OnDisconnectedAsyncWithException(string playerId)
        {
            var hub = CreateGameHub(playerId);
            hub.OnDisconnectedAsync(new()).IsCompletedSuccessfully.Should().BeTrue();
        }

        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public async Task OnDisconnectedAsyncWithNullGameId(string playerId)
        {
            var hub = CreateGameHub(playerId);
            await hub.OnDisconnectedAsync(null);
            hub.OnDisconnectedAsync(null).IsCompletedSuccessfully.Should().BeTrue();
        }
    }

    public class InvalidHttpContextTests : GameHubTests
    {

        private GameHub CreateGameHubWithInvalidHttpContext()
        {
            A.CallTo(() => _featureCollectionMock.Get<IHttpContextFeature>()).Returns(null);

            var hubCallerContextMock = A.Fake<HubCallerContext>();
            A.CallTo(() => hubCallerContextMock.ConnectionId).Returns(HubConnectionId);
            A.CallTo(() => hubCallerContextMock.Features).Returns(_featureCollectionMock);

            var hubCallerClientsMock = A.Fake<IHubCallerClients>();
            A.CallTo(() => hubCallerClientsMock.OthersInGroup(A<string>.Ignored)).Returns(_clientProxyMock);
            A.CallTo(() => hubCallerClientsMock.Group(A<string>.Ignored)).Returns(_clientProxyMock);

            var hub = new GameHub();
            hub.Context = hubCallerContextMock;
            hub.Groups = _groupManagerMock;
            hub.Clients = hubCallerClientsMock;
            return hub;
        }

        [Fact]
        public void SendSelectionReturnsTask()
        {
            var hub = CreateGameHubWithInvalidHttpContext();

            var selectedTile = new Tile(1, 1, Creatures.Grasshopper);
            hub.SendSelection("select", selectedTile).IsCompletedSuccessfully.Should().BeTrue();
        }

        [Fact]
        public void OnConnectedAsyncReturnsTask()
        {
            var hub = CreateGameHubWithInvalidHttpContext();
            hub.OnConnectedAsync().IsCompletedSuccessfully.Should().BeTrue();
        }
    }
}