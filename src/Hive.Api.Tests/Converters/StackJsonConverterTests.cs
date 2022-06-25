using System.Buffers;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Text;
using System.Text.Json;
using FluentAssertions;
using Hive.Api.Converters;
using Xunit;

namespace Hive.Api.Tests.Converters;

public class StackJsonConverterTests
{
    private readonly StackJsonConverter<int> _converter;
    private readonly Stack<int> _stack;

    public StackJsonConverterTests()
    {
        _converter = new StackJsonConverter<int>();

        _stack = new Stack<int>();
        _stack.Push(1);
        _stack.Push(2);
        _stack.Push(3);
    }

    [Fact]
    public void SerializesStackOrderCorrectly()
    {
        var stream = new MemoryStream();
        var writer = new Utf8JsonWriter(stream);
        _converter.Write(writer, _stack, new JsonSerializerOptions(JsonSerializerDefaults.Web));
        writer.Flush();
        stream.Seek(0, SeekOrigin.Begin);
        using var sr = new StreamReader(stream, Encoding.UTF8);
        sr.ReadToEnd().Should().Be("[3,2,1]");
    }

    [Fact]
    public void DeserializesStackOrderCorrectly()
    {
        var json = Encoding.UTF8.GetBytes("[3,2,1]");
        var reader = new Utf8JsonReader(new ReadOnlySequence<byte>(json));
        reader.Read();
        var result = _converter.Read(ref reader, typeof(int),
            new JsonSerializerOptions(JsonSerializerDefaults.Web));
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
        _converter.Read(ref reader, typeof(int), new JsonSerializerOptions(JsonSerializerDefaults.Web));
    }
}
