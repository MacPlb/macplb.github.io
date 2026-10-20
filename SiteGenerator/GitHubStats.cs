using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;

namespace SiteGenerator;

public record LanguageCount(string Language, int Repositories);
public record RepoSummary(string Name, string Description, string? Language, int Stars, string Url);
public record ContributionDay(DateOnly Date, int Count);

/// <summary>Public GitHub numbers, fetched once per build.</summary>
public record GitHubStats(
    int Repositories,
    int SinceYear,
    IReadOnlyList<LanguageCount> Languages,
    IReadOnlyList<RepoSummary> Featured,
    IReadOnlyList<ContributionDay>? Contributions)
{
    static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web) { PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower };

    public int TotalContributions => Contributions?.Sum(day => day.Count) ?? 0;
    public int LongestStreak => Contributions is null ? 0 : LongestRun(Contributions);
    int BusiestDay => Contributions is { Count: > 0 } days ? days.Max(day => day.Count) : 0;

    /// <summary>0 for no contributions, otherwise 1-4 by quarter of the busiest day, like GitHub's calendar.</summary>
    public int Level(int count) => count == 0 || BusiestDay == 0 ? 0 : Math.Clamp((int)Math.Ceiling(4.0 * count / BusiestDay), 1, 4);

    public static int LongestRun(IEnumerable<ContributionDay> days)
    {
        int best = 0, run = 0;
        foreach (var day in days.OrderBy(day => day.Date))
        {
            run = day.Count > 0 ? run + 1 : 0;
            best = Math.Max(best, run);
        }
        return best;
    }

    /// <summary>Repositories per primary language, most common first; repositories without a language are skipped.</summary>
    public static List<LanguageCount> CountLanguages(IEnumerable<string?> languages) => languages
        .Where(language => !string.IsNullOrEmpty(language))
        .GroupBy(language => language!)
        .Select(group => new LanguageCount(group.Key, group.Count()))
        .OrderByDescending(language => language.Repositories)
        .ThenBy(language => language.Language, StringComparer.Ordinal)
        .ToList();

    /// <summary>
    /// Reads profile and repositories from the REST API. The contribution calendar needs a token (GraphQL),
    /// so without one, or if that call fails, Contributions is null and the rest still works.
    /// </summary>
    public static async Task<GitHubStats> FetchAsync(string user, IReadOnlyList<string> featured, string? token)
    {
        using var http = new HttpClient { BaseAddress = new Uri("https://api.github.com/"), Timeout = TimeSpan.FromSeconds(30) };
        http.DefaultRequestHeaders.UserAgent.ParseAdd("macplb-site-generator");
        http.DefaultRequestHeaders.Accept.ParseAdd("application/vnd.github+json");
        if (!string.IsNullOrEmpty(token))
            http.DefaultRequestHeaders.Authorization = new("Bearer", token);

        var profile = await http.GetFromJsonAsync<UserDto>($"users/{user}", Json)
            ?? throw new InvalidOperationException("empty profile response");
        var repos = (await http.GetFromJsonAsync<List<RepoDto>>($"users/{user}/repos?per_page=100&type=owner", Json) ?? [])
            .Where(repo => !repo.Fork && !repo.Archived)
            .ToList();

        var featuredRepos = featured
            .Select(name => repos.FirstOrDefault(repo => repo.Name.Equals(name, StringComparison.OrdinalIgnoreCase)))
            .OfType<RepoDto>()
            .Select(repo => new RepoSummary(repo.Name, repo.Description ?? "", repo.Language, repo.StargazersCount, repo.HtmlUrl))
            .ToList();

        return new GitHubStats(
            repos.Count,
            profile.CreatedAt.Year,
            CountLanguages(repos.Select(repo => repo.Language)),
            featuredRepos,
            string.IsNullOrEmpty(token) ? null : await FetchContributionsAsync(http, user));
    }

    static async Task<List<ContributionDay>?> FetchContributionsAsync(HttpClient http, string user)
    {
        const string query = "query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar { weeks { contributionDays { date contributionCount } } } } } }";
        try
        {
            using var response = await http.PostAsJsonAsync("graphql", new { query, variables = new { login = user } });
            response.EnsureSuccessStatusCode();
            using var document = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
            return document.RootElement
                .GetProperty("data").GetProperty("user").GetProperty("contributionsCollection")
                .GetProperty("contributionCalendar").GetProperty("weeks")
                .EnumerateArray()
                .SelectMany(week => week.GetProperty("contributionDays").EnumerateArray())
                .Select(day => new ContributionDay(
                    DateOnly.ParseExact(day.GetProperty("date").GetString()!, "yyyy-MM-dd", CultureInfo.InvariantCulture),
                    day.GetProperty("contributionCount").GetInt32()))
                .ToList();
        }
        catch (Exception e) when (e is HttpRequestException or JsonException or KeyNotFoundException or InvalidOperationException or FormatException)
        {
            Console.Error.WriteLine($"warning: contribution calendar unavailable ({e.Message})");
            return null;
        }
    }

    record UserDto(DateTime CreatedAt);
    record RepoDto(string Name, string? Description, string? Language, int StargazersCount, string HtmlUrl, bool Fork, bool Archived);
}
