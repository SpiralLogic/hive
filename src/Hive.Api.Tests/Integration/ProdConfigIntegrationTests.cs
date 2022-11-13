using FluentAssertions;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Xunit;

namespace Hive.Api.Tests.Integration;

public class ProdConfigIntegrationTests
    : IClassFixture<ProdWebApplicationFactory<Program>>
{
    private readonly ProdWebApplicationFactory<Program> _factory;

    public ProdConfigIntegrationTests(ProdWebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public void CanCreateClientWithRedisConfig()
    {
        var client = _factory.CreateClient();

        client.GetAsync("/");
        var cache = _factory.Services.GetService(typeof(IDistributedCache));
        cache.Should().BeAssignableTo<RedisCache>();
    }
}
