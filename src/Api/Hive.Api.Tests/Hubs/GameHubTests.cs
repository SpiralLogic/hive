using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Hive.Domain.Entities;
using Hive.Hubs;
using Microsoft.AspNetCore.Http.Connections.Features;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SignalR;
using Moq;
using Xunit;

namespace Hive.Api.Tests.Hubs
{
    public class GameHubTests
    {
        private const string HubConnectionId = "HUB_CONNECTION_ID";
        private const string HubGroupName = "HUB_GROUP_NAME";
        private readonly Mock<IClientProxy> _clientProxyMock;
        private readonly Mock<IGroupManager> _groupManagerMock;
        private readonly GameHub _hub;

        public GameHubTests()
        {
            _groupManagerMock = new Mock<IGroupManager>();
            _groupManagerMock.Setup(m => m.AddToGroupAsync(HubConnectionId, HubGroupName, It.IsAny<CancellationToken>()));
            _groupManagerMock.Setup(m => m.RemoveFromGroupAsync(HubConnectionId, HubGroupName, It.IsAny<CancellationToken>()));
   _groupManagerMock.Setup(m => m.AddToGroupAsync(HubConnectionId, HubGroupName+"-0", It.IsAny<CancellationToken>()));
            _groupManagerMock.Setup(m => m.RemoveFromGroupAsync(HubConnectionId, HubGroupName+"-0", It.IsAny<CancellationToken>()));

            var httpContextFeatureMock = new Mock<IHttpContextFeature>();
            httpContextFeatureMock.SetupSequence(m => m.HttpContext.Features.Get<IRoutingFeature>())
                .Returns(() => new RoutingFeature {RouteData = new RouteData {Values = {{"id", HubConnectionId}}}})
                .Returns(() => new RoutingFeature {RouteData = new RouteData {Values = {{"playerId", "0"}}}})
                .Returns(() => new RoutingFeature {RouteData = new RouteData {Values = {{"id", null}}}})
                .Returns(() => new RoutingFeature {RouteData = new RouteData {Values = {{"playerId", null}}}});

            var featureCollectionMock = new Mock<IFeatureCollection>();
            featureCollectionMock.Setup(m => m.Get<IHttpContextFeature>()).Returns(httpContextFeatureMock.Object);

            var hubCallerContextMock = new Mock<HubCallerContext>();
            hubCallerContextMock.SetupGet(m => m.ConnectionId).Returns(HubConnectionId);
            hubCallerContextMock.SetupGet(m => m.Features).Returns(featureCollectionMock.Object);

            _clientProxyMock = new Mock<IClientProxy>();
            _clientProxyMock.Setup(m => m.SendCoreAsync(It.IsAny<string>(), It.IsAny<object[]>(), It.IsAny<CancellationToken>()));

            var hubCallerClientsMock = new Mock<IHubCallerClients>();
            hubCallerClientsMock.Setup(m => m.OthersInGroup(It.IsAny<string>())).Returns(_clientProxyMock.Object);
            hubCallerClientsMock
                .Setup(m => m.Group(It.IsAny<string>())).Returns(_clientProxyMock.Object);
            _hub = new GameHub
            {
                Context = hubCallerContextMock.Object, Groups = _groupManagerMock.Object,
                Clients = hubCallerClientsMock.Object
            };
        }

        [Fact]
        public async Task NewConnectionsAreAddedToGroup()
        {
            await _hub.OnConnectedAsync();
            _groupManagerMock.Verify(g => g.AddToGroupAsync(HubConnectionId, HubConnectionId, It.IsAny<CancellationToken>()));
        }

        [Fact]
        public async Task NewConnectionsAreAddedToPlayerGroup()
        {
            await _hub.OnConnectedAsync();
            _groupManagerMock.Verify(g => g.AddToGroupAsync(HubConnectionId, HubConnectionId + "-0", It.IsAny<CancellationToken>()));
            _clientProxyMock.Verify(c => c.SendCoreAsync("PlayerConnection", new object[] {"connect"}, It.IsAny<CancellationToken>()));
        }

        [Fact]
        public async Task DisconnectionsAreRemovedFromPlayerGroup()
        {
            await _hub.OnDisconnectedAsync(null);
            _groupManagerMock.Verify(g => g.RemoveFromGroupAsync(HubConnectionId, HubConnectionId + "-0", It.IsAny<CancellationToken>()));
            _clientProxyMock.Verify(c => c.SendCoreAsync("PlayerConnection", new object[] {"disconnect"}, It.IsAny<CancellationToken>()));
        }

        [Fact]
        public async Task DisconnectionsRemoveFromGroup()
        {
            await _hub.OnDisconnectedAsync(null);
            _groupManagerMock.Verify(g => g.RemoveFromGroupAsync(HubConnectionId, HubConnectionId, It.IsAny<CancellationToken>()));
        }

        [Fact]
        public async Task SendsPieceSelectionToGroup()
        {
            var selectedTile = new Tile(1, 1, Creatures.Grasshopper);
            await _hub.SendSelection("select", selectedTile);
            _clientProxyMock.Verify(
                c => c.SendCoreAsync("OpponentSelection", new object[] {"select", selectedTile}, It.IsAny<CancellationToken>())
            );
        }

        [Fact]
        public async Task InvalidGroupReturnsTask()
        {
            var selectedTile = new Tile(1, 1, Creatures.Grasshopper);
            await _hub.SendSelection("select", selectedTile);
            _hub.SendSelection("select", selectedTile).IsCompletedSuccessfully.Should().BeTrue();
        }
    }
}
