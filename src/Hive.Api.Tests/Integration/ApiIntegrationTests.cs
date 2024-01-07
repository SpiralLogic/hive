using System;
using System.Linq;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Hive.Domain.Entities;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using Move = Hive.Api.DTOs.Move;

namespace Hive.Api.Tests.Integration;

public class ApiIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly Lazy<Task<string>> _lazyGameId;

    public ApiIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;

        _lazyGameId = new(
            async () =>
            {
                var client = _factory.CreateClient();
                var response = await client.PostAsync("/api/new", null);
                var gameId = response.Headers.Location!.Segments.ElementAt(3);
                return gameId;

            }
        );
    }

    [Fact]
    public async Task Post_NewEndpointReturnsSuccessAndLocation()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsync("/api/new", null);
        response.EnsureSuccessStatusCode(); // Status Code 200-299

        response.Headers.Location?.Segments.ElementAt(3).Should().NotBeNullOrEmpty();
        response.Content.Headers.ContentType?.ToString().Should().Be("application/json; charset=utf-8");
    }

    [Fact]
    public async Task Post_MoveApiEndpoint_MakesMove()
    {
        var client = _factory.CreateClient();
        var gameId = await _lazyGameId.Value;

        var response = await client.PostAsJsonAsync($"/api/move/{gameId}/", new Move(0, new Coords(0, 0)));

        response.EnsureSuccessStatusCode();
        response.Content.Headers.ContentType?.ToString().Should().Be("application/json; charset=utf-8");
    }

    [Fact]
    public async Task Post_AiMoveEndpoint_MakesMove()
    {

        var client = _factory.CreateClient();
        var gameId = await _lazyGameId.Value;

        var response = await client.PostAsync($"/api/ai-move/{gameId}", null);

        response.EnsureSuccessStatusCode();
        response.Content.Headers.ContentType?.ToString().Should().Be("application/json; charset=utf-8");
    }

    [Fact]
    public async Task Post_GameApiEndpoint_ReturnsGame()
    {
        var client = _factory.CreateClient();
        var gameId = await _lazyGameId.Value;

        var response = await client.GetAsync($"/api/game/{gameId}");

        response.EnsureSuccessStatusCode();
        response.Content.Headers.ContentType?.ToString().Should().Be("application/json; charset=utf-8");
    }

    // [Theory]
    // [InlineData("")]
    // [InlineData("/0")]
    // public async Task Post_GameEndpoint_ReturnsGame(string uriSuffix)
    // {
    //     var client = _factory.CreateClient();
    //     var gameId = await _lazyGameId.Value;
    //
    //     var response = await client.GetAsync($"/game/{gameId}{uriSuffix}");
    //
    //     response.EnsureSuccessStatusCode();
    //     response.Content.Headers.ContentType?.ToString().Should().Be("text/html; charset=utf-8");
    // }
}
