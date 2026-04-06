using AwesomeAssertions;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Xunit;

namespace Hive.Api.Tests.Integration;

public class ProdConfigIntegrationTests(ProdWebApplicationFactory<Program> factory) : IClassFixture<ProdWebApplicationFactory<Program>>
{
    [Fact]
    public void CanCreateClientWithRedisConfig()
    {
        var client = factory.CreateClient();

        client.GetAsync("/");
        var cache = factory.Services.GetService(typeof(IDistributedCache));
        cache.Should().BeAssignableTo<RedisCache>();
    }
}
