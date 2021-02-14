using System.Threading;
using System.Threading.Tasks;
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
        private readonly GameHub _hub;
        private readonly Mock<IGroupManager> _groupManagerMock;

        public GameHubTests()
        {

            _groupManagerMock = new Mock<IGroupManager>();
            _groupManagerMock.Setup(m => m.AddToGroupAsync(HubConnectionId, HubGroupName, It.IsAny<CancellationToken>()));
            _groupManagerMock.Setup(m => m.RemoveFromGroupAsync(HubConnectionId, HubGroupName, It.IsAny<CancellationToken>()));

            var httpContextFeatureMock = new Mock<IHttpContextFeature>();
            httpContextFeatureMock.Setup(m => m.HttpContext.Features.Get<IRoutingFeature>()).Returns(() => new RoutingFeature {RouteData = new RouteData {Values = {{"id", HubConnectionId}}}});

            var featureCollectionMock = new Mock<IFeatureCollection>();
            featureCollectionMock.Setup(m => m.Get<IHttpContextFeature>()).Returns(httpContextFeatureMock.Object);

            var hubCallerContextMock = new Mock<HubCallerContext>();
            hubCallerContextMock.SetupGet(m => m.ConnectionId).Returns(HubConnectionId);
            hubCallerContextMock.SetupGet(m => m.Features).Returns(featureCollectionMock.Object);

            _hub = new GameHub {Context = hubCallerContextMock.Object, Groups = _groupManagerMock.Object};
        }

        [Fact]
        public async Task NewConnectionsAreAddedToGroup()
        {
            await _hub.OnConnectedAsync();
            _groupManagerMock.Verify(g => g.AddToGroupAsync(HubConnectionId, HubConnectionId, It.IsAny<CancellationToken>()));
        }

        [Fact]
        public async Task DisconnectionsRemoveFromGroup()
        {
            await _hub.OnDisconnectedAsync(null);
            _groupManagerMock.Verify(g => g.RemoveFromGroupAsync(HubConnectionId, HubConnectionId, It.IsAny<CancellationToken>()));
        }
    }
}
