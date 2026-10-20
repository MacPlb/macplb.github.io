using System.Globalization;
using System.Text.RegularExpressions;
using Markdig;

namespace SiteGenerator;

public record Post(string Slug, string Title, DateOnly Date, string Summary, IReadOnlyList<string> Tags, string Html)
{
    static readonly MarkdownPipeline Pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();

    public string DisplayDate => Date.ToString("d MMMM yyyy", CultureInfo.InvariantCulture);
    public string IsoDate => Date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

    /// <summary>
    /// Parses a post: a front matter block of "key: value" lines between "---" lines
    /// (title and date required, summary and comma-separated tags optional), then Markdown.
    /// </summary>
    public static Post Parse(string slug, string text)
    {
        if (!Regex.IsMatch(slug, "^[a-z0-9-]+$"))
            throw new FormatException($"{slug}.md: file names may only use a-z, 0-9 and '-', because they become the URL.");

        var lines = text.ReplaceLineEndings("\n").Split('\n');
        var end = lines[0] == "---" ? Array.IndexOf(lines, "---", 1) : -1;
        if (end < 0)
            throw new FormatException($"{slug}.md: must start with a front matter block between two '---' lines.");

        var meta = new Dictionary<string, string>();
        foreach (var line in lines[1..end].Where(line => line.Contains(':')))
        {
            var colon = line.IndexOf(':');
            meta[line[..colon].Trim().ToLowerInvariant()] = line[(colon + 1)..].Trim().Trim('"');
        }

        string Required(string key) => meta.GetValueOrDefault(key) is { Length: > 0 } value
            ? value
            : throw new FormatException($"{slug}.md: front matter is missing '{key}'.");

        if (!DateOnly.TryParseExact(Required("date"), "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
            throw new FormatException($"{slug}.md: date must be written as yyyy-MM-dd, for example 2026-10-20.");

        var tags = meta.GetValueOrDefault("tags", "").Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
        var html = Markdown.ToHtml(string.Join('\n', lines[(end + 1)..]), Pipeline);

        return new Post(slug, Required("title"), date, meta.GetValueOrDefault("summary", ""), tags, html);
    }
}
