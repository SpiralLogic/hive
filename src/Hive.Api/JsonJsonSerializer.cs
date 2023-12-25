using System.IO;
using System.Text.Json;
using Unleash.Serialization;

namespace Hive.Api;

public class JsonJsonSerializer : IJsonSerializer
{
    public T Deserialize<T>(Stream stream)
    {

        var result = JsonSerializer.Deserialize<T>(stream) ?? throw new InvalidDataException();

        return result;
    }

    public void Serialize<T>(Stream stream, T instance)
    {
        JsonSerializer.Serialize<T>(stream, instance);
    }
}