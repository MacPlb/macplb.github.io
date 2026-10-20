namespace SiteGenerator.Tests;

public class PostTests
{
    [Fact]
    public void Parse_ReadsFrontMatterAndRendersMarkdown()
    {
        var post = Post.Parse("hello-world", """
            ---
            title: "Hello: world"
            date: 2026-10-20
            summary: First post.
            tags: dotnet, nixos
            ---
            Some **bold** text.
            """);

        Assert.Equal("Hello: world", post.Title);
        Assert.Equal(new DateOnly(2026, 10, 20), post.Date);
        Assert.Equal("First post.", post.Summary);
        Assert.Equal(["dotnet", "nixos"], post.Tags);
        Assert.Contains("<strong>bold</strong>", post.Html);
    }

    [Theory]
    [InlineData("Bad Name", "---\ntitle: x\ndate: 2026-10-20\n---\n")]
    [InlineData("no-front-matter", "just text")]
    [InlineData("missing-title", "---\ndate: 2026-10-20\n---\n")]
    [InlineData("bad-date", "---\ntitle: x\ndate: 20.10.2026\n---\n")]
    public void Parse_RejectsInvalidPosts(string slug, string text)
    {
        Assert.Throws<FormatException>(() => Post.Parse(slug, text));
    }
}
