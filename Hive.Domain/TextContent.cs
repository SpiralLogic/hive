namespace Hive.Domain
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