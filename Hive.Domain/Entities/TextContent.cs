namespace Hive.Domain.Entities
{
    public class TextContent
    {
        public TextContent(string text, string type = "text")
        {
            Type = type;
            Text = text;
        }

        public string Type { get; }
        public string Text { get; }
    }
}