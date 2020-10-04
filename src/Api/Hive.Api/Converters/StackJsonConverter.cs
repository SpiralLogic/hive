using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

 namespace Hive
{
    public class StackJsonConverter : JsonConverterFactory
    {
        public override bool CanConvert(Type typeToConvert)
        {
            return typeToConvert.IsGenericType &&
                typeToConvert.GetGenericTypeDefinition() == typeof(Stack<>);
        }

        public override JsonConverter CreateConverter(
            Type typeToConvert, JsonSerializerOptions options)
        {
            Debug.Assert(typeToConvert.IsGenericType &&
                typeToConvert.GetGenericTypeDefinition() == typeof(Stack<>));

            Type elementType = typeToConvert.GetGenericArguments()[0];

            JsonConverter converter = (JsonConverter)Activator.CreateInstance(
                typeof(StackJsonConverter<>)
                    .MakeGenericType(new Type[] { elementType }),
                BindingFlags.Instance | BindingFlags.Public,
                binder: null,
                args: null,
                culture: null)!;

            return converter;
        }
    }

    public class StackJsonConverter<T> : JsonConverter<Stack<T>>
    {
        public override Stack<T> Read(
            ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType != JsonTokenType.StartArray || !reader.Read())
            {
                throw new JsonException();
            }

            var elements = new Stack<T>();

            while (reader.TokenType != JsonTokenType.EndArray)
            {
                elements.Push(JsonSerializer.Deserialize<T>(ref reader, options)!);

                if (!reader.Read())
                {
                    throw new JsonException();
                }
            }

            return new Stack<T>(elements);
        }

        public override void Write(
            Utf8JsonWriter writer, Stack<T> value, JsonSerializerOptions options)
        {
            writer.WriteStartArray();

            var reversed = value;

            foreach (T item in reversed)
            {
                JsonSerializer.Serialize(writer, item, options);
            }

            writer.WriteEndArray();
        }
    }
}