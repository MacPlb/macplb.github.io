using System.Text.RegularExpressions;

namespace SiteGenerator;

public record CollectionItem(string Caption, string SourcePath, string Url);
public record CollectionCategory(string Title, IReadOnlyList<CollectionItem> Items);

public static class Collection
{
    static readonly string[] ImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];

    /// <summary>
    /// Every subfolder of <paramref name="dir"/> is a category ("1-vinyl" becomes "Vinyl"; the number only sets
    /// the order), and every image in it an item captioned by its file name ("Artist - Album.jpg").
    /// </summary>
    // shortcut: photos are published at full size, so resize them (around 1600px) before adding; resize here if that gets tedious
    public static List<CollectionCategory> Load(string dir)
    {
        if (!Directory.Exists(dir))
            return [];

        return Directory.GetDirectories(dir)
            .Order(StringComparer.OrdinalIgnoreCase)
            .Select(folder =>
            {
                var folderName = Path.GetFileName(folder);
                var items = Directory.GetFiles(folder)
                    .Where(file => ImageExtensions.Contains(Path.GetExtension(file).ToLowerInvariant()))
                    .Order(StringComparer.OrdinalIgnoreCase)
                    .Select(file => new CollectionItem(
                        Path.GetFileNameWithoutExtension(file).Replace(" - ", " – "),
                        file,
                        $"collection/{Uri.EscapeDataString(folderName)}/{Uri.EscapeDataString(Path.GetFileName(file))}"))
                    .ToList();
                return new CollectionCategory(Title(folderName), items);
            })
            .Where(category => category.Items.Count > 0)
            .ToList();
    }

    static string Title(string folderName)
    {
        var title = Regex.Replace(folderName, @"^\d+-", "").Replace('-', ' ');
        return title.Length == 0 ? folderName : char.ToUpperInvariant(title[0]) + title[1..];
    }
}
