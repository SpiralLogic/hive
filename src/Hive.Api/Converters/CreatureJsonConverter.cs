using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Hive.Domain.Entities;

namespace Hive.Api.Converters;

internal class CreatureJsonConverter : JsonConverter<Creature>
{
    private static readonly Dictionary<string, Creature> CreatureMap = typeof(Creatures)
        .GetFields(BindingFlags.Public | BindingFlags.Static)
        .Where(field => field.FieldType == typeof(Creature))
        .Select(field => (Creature?)field.GetValue(null))
        .Where(creature => creature is not null)
        .Cast<Creature>()
        .ToDictionary(creature => creature.Name, creature => creature, StringComparer.Ordinal);

    public override Creature Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(typeToConvert);
        var name = reader.GetString() ?? throw new JsonException(nameof(Creature));

        return CreatureMap.TryGetValue(name, out var creature) ? creature : throw new JsonException(typeToConvert.Name);
    }

    public override void Write(Utf8JsonWriter writer, Creature value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(value);
        writer.WriteStringValue(value.Name);
    }
}
