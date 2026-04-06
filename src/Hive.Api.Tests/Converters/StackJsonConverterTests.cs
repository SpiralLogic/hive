using System.Buffers;
using System.Collections.Immutable;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Text;
using System.Text.Json;
using AwesomeAssertions;
using Hive.Api.Converters;
using Xunit;

namespace Hive.Api.Tests.Converters;

public class StackJsonConverterTests
{
    private readonly StackJsonConverter<int> _converter = new();
    private readonly ImmutableStack<int> _stack = ImmutableStack<int>.Empty.Push(1).Push(2).Push(3);

    [Fact]
    public void SerializesStackOrderCorrectly()
    {
        var stream = new MemoryStream();
        var writer = new Utf8JsonWriter(stream);
        _converter.Write(writer, _stack, new(JsonSerializerDefaults.Web));
        writer.Flush();
        stream.Seek(0, SeekOrigin.Begin);
        using var sr = new StreamReader(stream, Encoding.UTF8);
        sr.ReadToEnd().Should().Be("[3,2,1]");
    }

    [Fact]
    public void DeserializesStackOrderCorrectly()
    {
        var json = "[3,2,1]"u8.ToArray();
        var reader = new Utf8JsonReader(new ReadOnlySequence<byte>(json));
        reader.Read();
        var result = _converter.Read(ref reader, typeof(int), new(JsonSerializerDefaults.Web));
        result.Should().BeEquivalentTo(_stack);
    }

    [Fact]
    public void ThrowsExceptionWhenNotArray()
    {
        Assert.Throws<JsonException>(() => { DeserializeStringToStack("3,2,1]"); });
    }

    [Fact]
    public void ThrowsExceptionWhenArrayIsNotComplete()
    {
        Assert.Throws<JsonException>(() => { DeserializeStringToStack("[3,2,1,\"sd\"]"); });
    }

    [ExcludeFromCodeCoverage]
    private void DeserializeStringToStack(string s)
    {
        var json = Encoding.UTF8.GetBytes(s);
        var reader = new Utf8JsonReader(new ReadOnlySequence<byte>(json));
        reader.Read();
        _converter.Read(ref reader, typeof(int), new(JsonSerializerDefaults.Web));
    }
}
