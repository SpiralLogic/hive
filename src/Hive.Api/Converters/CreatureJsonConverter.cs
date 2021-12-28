using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using Hive.Domain.Entities;

namespace Hive.Converters;

public class CreatureJsonConverter : JsonConverter<Creature>
{
    private readonly Type _creaturesType;

    public CreatureJsonConverter()
    {
        _creaturesType = typeof(Creatures);
    }

    public override Creature Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        string name = reader.GetString() ?? throw new JsonException(nameof(Creature));

        return _creaturesType.GetField(name)?.GetValue(null) as Creature ??
               throw new JsonException(typeToConvert.Name);
    }

    public override void Write(Utf8JsonWriter writer, Creature value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.Name);
    }
}