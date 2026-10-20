namespace SiteGenerator.Tests;

public class CollectionTests
{
    [Fact]
    public void Load_GroupsImagesByFolderInOrder()
    {
        var dir = Directory.CreateTempSubdirectory().FullName;
        try
        {
            Directory.CreateDirectory(Path.Combine(dir, "2-watches"));
            Directory.CreateDirectory(Path.Combine(dir, "1-vinyl"));
            Directory.CreateDirectory(Path.Combine(dir, "3-empty"));
            File.WriteAllText(Path.Combine(dir, "2-watches", "seiko.jpg"), "");
            File.WriteAllText(Path.Combine(dir, "1-vinyl", "Pink Floyd - The Wall.JPG"), "");
            File.WriteAllText(Path.Combine(dir, "1-vinyl", "notes.txt"), "");

            var categories = Collection.Load(dir);

            Assert.Equal(["Vinyl", "Watches"], categories.Select(c => c.Title));
            var record = Assert.Single(categories[0].Items);
            Assert.Equal("Pink Floyd – The Wall", record.Caption);
            Assert.Equal("collection/1-vinyl/Pink%20Floyd%20-%20The%20Wall.JPG", record.Url);
        }
        finally
        {
            Directory.Delete(dir, recursive: true);
        }
    }
}
