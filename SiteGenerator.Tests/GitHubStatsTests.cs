namespace SiteGenerator.Tests;

public class GitHubStatsTests
{
    static ContributionDay Day(int day, int count) => new(new DateOnly(2026, 10, day), count);

    [Fact]
    public void CountLanguages_SortsByCountThenNameAndSkipsMissing()
    {
        var counts = GitHubStats.CountLanguages(["C#", "Java", null, "C#", "", "Nix", "C#", "Java", "CSS"]);

        Assert.Equal(
            [new("C#", 3), new("Java", 2), new("CSS", 1), new LanguageCount("Nix", 1)],
            counts);
    }

    [Fact]
    public void LongestRun_CountsConsecutiveActiveDaysInDateOrder()
    {
        // Given out of order on purpose: active on 1, 2, 3, then 5, 6.
        ContributionDay[] days = [Day(3, 1), Day(1, 2), Day(2, 5), Day(4, 0), Day(6, 1), Day(5, 3)];

        Assert.Equal(3, GitHubStats.LongestRun(days));
    }

    [Theory]
    [InlineData(0, 0)]
    [InlineData(1, 1)]
    [InlineData(4, 2)]
    [InlineData(6, 3)]
    [InlineData(8, 4)]
    public void Level_SplitsIntoQuartersOfTheBusiestDay(int count, int expected)
    {
        var stats = new GitHubStats(1, 2020, [], [], [Day(1, 8), Day(2, 0)]);

        Assert.Equal(expected, stats.Level(count));
    }
}
