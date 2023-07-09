using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Hive.Api.Hubs;
using Hive.Domain.Entities;
using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SignalR;
using Moq;
using Xunit;

namespace Hive.Api.Tests.Hubs;

public class GameHubTests
{
    private const string HubConnectionId = "HUB_CONNECTION_ID";
    private const string HubGroupName = "GameId";
    private readonly Mock<IGroupManager> _groupManagerMock = new();
    private Mock<IClientProxy> _clientProxyMock = new();
    private Mock<IFeatureCollection> _featureCollectionMock = new();
    private Mock<IHttpContextFeature> _httpContextFeatureMock = new();

    private GameHub CreateGameHub(string playerId)
    {
        _httpContextFeatureMock = new();
        _featureCollectionMock = new();
        _clientProxyMock = new();

        _groupManagerMock.Setup(m => m.AddToGroupAsync(HubConnectionId, HubConnectionId, It.IsAny<CancellationToken>()));
        _groupManagerMock.Setup(m => m.AddToGroupAsync(HubConnectionId, $"{HubGroupName}-{playerId}", It.IsAny<CancellationToken>()));

        _httpContextFeatureMock.SetupSequence(m => m.HttpContext!.Features.Get<IRoutingFeature>())
          .Returns(
            () =>
            {
              var feature = new RoutingFeature();
              feature.RouteData = new();
              feature.RouteData.Values.Add("id", HubGroupName);
              return feature;
            }
          )
          .Returns(
            () =>
            {
              var feature = new RoutingFeature();
              feature.RouteData = new();
              feature.RouteData.Values.Add("playerId", playerId);
              return feature;
            }
          )
                    .Returns(
            () =>
            {
              var feature = new RoutingFeature();
              feature.RouteData = new();
              feature.RouteData.Values.Add("id", null);
              return feature;
            }
          )
          .Returns(
            () =>
            {
              var feature = new RoutingFeature();
              feature.RouteData = new();
              feature.RouteData.Values.Add("playerId", null);
              return feature;
            }
          )
          ;

        _featureCollectionMock.Setup(m => m.Get<IHttpContextFeature>()).Returns(_httpContextFeatureMock.Object);

        var hubCallerContextMock = new Mock<HubCallerContext>();
        hubCallerContextMock.SetupGet(m => m.ConnectionId).Returns(HubConnectionId);
        hubCallerContextMock.SetupGet(m => m.Features).Returns(_featureCollectionMock.Object);

        _clientProxyMock.Setup(m => m.SendCoreAsync(It.IsAny<string>(), It.IsAny<object[]>(), It.IsAny<CancellationToken>()));

        var hubCallerClientsMock = new Mock<IHubCallerClients>();
        hubCallerClientsMock.Setup(m => m.OthersInGroup(It.IsAny<string>())).Returns(_clientProxyMock.Object);
        hubCallerClientsMock.Setup(m => m.Group(It.IsAny<string>())).Returns(_clientProxyMock.Object);

        var hub = new GameHub();
        hub.Context = hubCallerContextMock.Object;
        hub.Groups = _groupManagerMock.Object;
        hub.Clients = hubCallerClientsMock.Object;
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
            _groupManagerMock.Verify(g => g.AddToGroupAsync(HubConnectionId, HubGroupName, It.IsAny<CancellationToken>()));
        }

        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public async Task NewConnectionsAreAddedToPlayerGroup(string playerId)
        {

            var hub = CreateGameHub(playerId);

            await hub.OnConnectedAsync();
            _groupManagerMock.Verify(g => g.AddToGroupAsync(HubConnectionId, HubGroupName, It.IsAny<CancellationToken>()));
            _groupManagerMock.Verify(g => g.AddToGroupAsync(HubConnectionId, HubGroupName, It.IsAny<CancellationToken>()));
            _clientProxyMock.Verify(
                c => c.SendCoreAsync(
                    "PlayerConnection",
                    new object[]
                    {
                        "connect", int.Parse(playerId, NumberStyles.Integer, CultureInfo.InvariantCulture)
                    },
                    It.IsAny<CancellationToken>()
                )
            );
        }

        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public async Task DisconnectionsAreRemovedFromPlayerGroup(string playerId)
        {
            var hub = CreateGameHub(playerId);
            await hub.OnDisconnectedAsync(null);
            _clientProxyMock.Verify(
                c => c.SendCoreAsync(
                    "PlayerConnection",
                    new object[]
                    {
                        "disconnect", int.Parse(playerId, NumberStyles.Integer, CultureInfo.InvariantCulture)
                    },
                    It.IsAny<CancellationToken>()
                )
            );
        }


        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public async Task SendsPieceSelectionToGroup(string playerId)
        {
            var selectedTile = new Tile(1, 1, Creatures.Grasshopper);
            var hub = CreateGameHub(playerId);
            await hub.SendSelection("select", selectedTile);

            _clientProxyMock.Verify(
                c => c.SendCoreAsync(
                    "OpponentSelection",
                    new object[]
                    {
                        "select", selectedTile
                    },
                    It.IsAny<CancellationToken>()
                )
            );
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

        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public void SendSelectionReturnsTask(string playerId)
        {
            var hub = CreateGameGubWithInvalidContext(playerId);

            var selectedTile = new Tile(1, 1, Creatures.Grasshopper);
            hub.SendSelection("select", selectedTile).IsCompletedSuccessfully.Should().BeTrue();
        }

        private GameHub CreateGameGubWithInvalidContext(string playerId)
        {

            var hub = CreateGameHub(playerId);
            _featureCollectionMock.Reset();
            return hub;
        }

        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public void OnConnectedAsyncReturnsTask(string playerId)
        {
            var hub = CreateGameGubWithInvalidContext(playerId);
            hub.OnConnectedAsync().IsCompletedSuccessfully.Should().BeTrue();
        }

        [Theory]
        [InlineData("0")]
        [InlineData("1")]
        public void OnDisconnectedAsyncReturnsTask(string playerId)
        {
            var hub = CreateGameGubWithInvalidContext(playerId);
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
        public async void OnDisconnectedAsyncWithNullGameId(string playerId)
        {
            var hub = CreateGameHub(playerId);
            await hub.OnDisconnectedAsync(null);
            hub.OnDisconnectedAsync(null).IsCompletedSuccessfully.Should().BeTrue();
        }
    }
}