using System.Buffers;
using System.IO;
using System.Text;
using System.Text.Json;
using FluentAssertions;
using Hive.Api.Converters;
using Hive.Domain.Entities;
using Xunit;

namespace Hive.Api.Tests.Converters;

public class CreatureJsonConverterTests
{
    private readonly CreatureJsonConverter _converter = new();

    [Fact]
    public void SerializesCreature()
    {
        var stream = new MemoryStream();
        var writer = new Utf8JsonWriter(stream);
        _converter.Write(writer, Creatures.Ant, new JsonSerializerOptions(JsonSerializerDefaults.Web));
        writer.Flush();
        stream.Seek(0, SeekOrigin.Begin);
        using var sr = new StreamReader(stream, Encoding.UTF8);
        sr.ReadToEnd().Should().Be("\"Ant\"");
    }

    [Fact]
    public void DeserializesCreatureCorrectly()
    {
        var json = Encoding.UTF8.GetBytes("\"Grasshopper\"");
        var reader = new Utf8JsonReader(new ReadOnlySequence<byte>(json));
        reader.Read();
        var result = _converter.Read(ref reader, typeof(Creature),
            new JsonSerializerOptions(JsonSerializerDefaults.Web));
        result.Should().BeEquivalentTo(Creatures.Grasshopper);
    }

    [Fact]
    public void ThrowsExceptionWhenNotString()
    {
        Assert.Throws<JsonException>(() => { DeserializeStringToCreature("null"); });
    }

    [Fact]
    public void ThrowsExceptionWhenCreatureDoesntExist()
    {
        Assert.Throws<JsonException>(() => { DeserializeStringToCreature("\"Turtle\""); });
    }

    private void DeserializeStringToCreature(string s)
    {
        var json = Encoding.UTF8.GetBytes(s);
        var reader = new Utf8JsonReader(new ReadOnlySequence<byte>(json));
        reader.Read();
        _converter.Read(ref reader, typeof(Creatures), new JsonSerializerOptions(JsonSerializerDefaults.Web));
    }
}
