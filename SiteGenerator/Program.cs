using System.Text.Encodings.Web;
using System.Text.Unicode;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SiteGenerator;
using SiteGenerator.Components;

// Run from the repository root: dotnet run --project SiteGenerator
const string PostsDir = "posts", StaticDir = "static", CollectionDir = "collection", OutputDir = "_site";

if (!Directory.Exists(PostsDir) || !Directory.Exists(StaticDir))
{
    Console.Error.WriteLine("Run this from the repository root (the folder containing posts/ and static/).");
    return 1;
}

List<Post> posts;
try
{
    posts = Directory.GetFiles(PostsDir, "*.md")
        .Where(file => !Path.GetFileName(file).StartsWith('_'))
        .Select(file => Post.Parse(Path.GetFileNameWithoutExtension(file), File.ReadAllText(file)))
        .OrderByDescending(post => post.Date)
        .ThenBy(post => post.Slug)
        .ToList();
}
catch (FormatException e)
{
    Console.Error.WriteLine($"posts/{e.Message}");
    return 1;
}

var collection = Collection.Load(CollectionDir);

GitHubStats? github = null;
try
{
    github = await GitHubStats.FetchAsync(Site.GitHubUser, Site.FeaturedRepos, Environment.GetEnvironmentVariable("GITHUB_TOKEN"));
}
catch (Exception e) when (e is HttpRequestException or TaskCanceledException or System.Text.Json.JsonException or InvalidOperationException)
{
    Console.Error.WriteLine($"warning: GitHub stats unavailable ({e.Message})");
    // In CI, fail so the last good deploy stays up instead of a site whose README cards 404
    if (Environment.GetEnvironmentVariable("CI") == "true")
        return 1;
}

if (Directory.Exists(OutputDir))
    Directory.Delete(OutputDir, recursive: true);
CopyDirectory(StaticDir, OutputDir);
foreach (var item in collection.SelectMany(category => category.Items))
{
    var target = Path.Combine(OutputDir, Uri.UnescapeDataString(item.Url));
    Directory.CreateDirectory(Path.GetDirectoryName(target)!);
    File.Copy(item.SourcePath, target);
}

var services = new ServiceCollection()
    .AddLogging()
    // Keep characters like "ł" readable in the output instead of &#x142; entities
    .AddSingleton(HtmlEncoder.Create(UnicodeRanges.All))
    .BuildServiceProvider();
await using var renderer = new HtmlRenderer(services, services.GetRequiredService<ILoggerFactory>());

await Render<HomePage>("index.html", new() { [nameof(HomePage.Posts)] = posts.Take(3).ToList(), [nameof(HomePage.GitHub)] = github });
await Render<PostsPage>("posts.html", new() { [nameof(PostsPage.Posts)] = posts });
await Render<CollectionPage>("collection.html", new() { [nameof(CollectionPage.Categories)] = collection });
foreach (var post in posts)
    await Render<PostPage>($"posts/{post.Slug}.html", new() { [nameof(PostPage.Post)] = post });

if (github is not null)
    StatsCards.Write(github, Path.Combine(OutputDir, "github"));

Console.WriteLine($"Built {posts.Count} post(s) and {collection.Sum(c => c.Items.Count)} collection photo(s) into {OutputDir}/");
return 0;

async Task Render<TComponent>(string path, Dictionary<string, object?> parameters) where TComponent : IComponent
{
    var html = await renderer.Dispatcher.InvokeAsync(async () =>
        (await renderer.RenderComponentAsync<TComponent>(ParameterView.FromDictionary(parameters))).ToHtmlString());
    var file = Path.Combine(OutputDir, path);
    Directory.CreateDirectory(Path.GetDirectoryName(file)!);
    await File.WriteAllTextAsync(file, html);
}

static void CopyDirectory(string from, string to)
{
    foreach (var file in Directory.GetFiles(from, "*", SearchOption.AllDirectories))
    {
        var target = Path.Combine(to, Path.GetRelativePath(from, file));
        Directory.CreateDirectory(Path.GetDirectoryName(target)!);
        File.Copy(file, target);
    }
}
