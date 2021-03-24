using System.Text;
using System.Text.Json;
using Hive.Converters;
using Hive.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace Hive.Api.Tests.Controllers
{
    internal static class TestHelpers
    {
        internal const string ExistingGameId = "EXISTING_GAME_ID";
        internal const string MissingGameId = "MISSING_GAME_ID";

        internal static JsonOptions CreateJsonOptions()
        {
            var jsonOptions = new JsonOptions();
            jsonOptions.JsonSerializerOptions.Converters.Add(new CreatureJsonConverter());
            jsonOptions.JsonSerializerOptions.Converters.Add(new StackJsonConverter());
            return jsonOptions;
        }

        internal static byte[] GetSerializedBytes(GameState gameState, JsonOptions jsonOptions)
        {
            return Encoding.Default.GetBytes(JsonSerializer.Serialize(gameState, jsonOptions.JsonSerializerOptions));
        }

        internal static MemoryDistributedCache CreateTestMemoryCache()
        {
            return new (
                new OptionsWrapper<MemoryDistributedCacheOptions>(new MemoryDistributedCacheOptions()));
        }
    }
}