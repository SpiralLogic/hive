using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Hive.Converters;

public static class Extensions
{
    public static void AddAllJsonConverters(this ICollection<JsonConverter> converterCollection)
    {
        converterCollection.Add(new CreatureJsonConverter());
        converterCollection.Add(new StackJsonConverter());
        converterCollection.Add(new JsonStringEnumConverter());
    }
}
