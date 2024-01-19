using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Hive.Api.Converters;

internal static class Extensions
{


    internal static void AddAllJsonConverters(this ICollection<JsonConverter> converterCollection)
    {
        ArgumentNullException.ThrowIfNull(converterCollection);
        converterCollection.Add(new CreatureJsonConverter());
        converterCollection.Add(new JsonStringEnumConverter());
    }
}
