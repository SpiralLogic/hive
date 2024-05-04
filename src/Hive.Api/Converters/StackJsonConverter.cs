using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Hive.Api.Converters;

public class StackJsonConverter : JsonConverterFactory
{
    public override bool CanConvert(Type typeToConvert)
    {
        ArgumentNullException.ThrowIfNull(typeToConvert);
        return typeToConvert.IsGenericType && typeToConvert.GetGenericTypeDefinition() == typeof(Stack<>);
    }

    public override JsonConverter CreateConverter(Type typeToConvert, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(typeToConvert);
        Debug.Assert(typeToConvert.IsGenericType && typeToConvert.GetGenericTypeDefinition() == typeof(Stack<>));

        var elementType = typeToConvert.GetGenericArguments()[0];

        var converter = (JsonConverter)Activator.CreateInstance(
            typeof(StackJsonConverter<>).MakeGenericType(elementType),
            BindingFlags.Instance | BindingFlags.Public,
            null,
            null,
            null
        )!;

        return converter;
    }
}

public class StackJsonConverter<T> : JsonConverter<Stack<T>>
{
    public override Stack<T> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType != JsonTokenType.StartArray || !reader.Read()) throw new JsonException();

        var elements = new List<T>();

        while (reader.TokenType != JsonTokenType.EndArray)
        {
            elements.Add(JsonSerializer.Deserialize<T>(ref reader, options)!);

            reader.Read();
        }
        elements.Reverse();
        return new(elements);
    }

    public override void Write(Utf8JsonWriter writer, Stack<T> value, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(value);
        writer.WriteStartArray();

        foreach (var item in value) JsonSerializer.Serialize(writer, item, options);

        writer.WriteEndArray();
    }
}
