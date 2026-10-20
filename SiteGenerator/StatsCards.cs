using System.Globalization;
using System.Security;
using System.Text;

namespace SiteGenerator;

/// <summary>SVG cards with the GitHub numbers, published under /github/ for the profile README.</summary>
public static class StatsCards
{
    // Same palette as the site (kitty.nix); heatmap ramp validated for this surface
    const string Surface = "#1a1a2e", Border = "#3b2964", Text = "#e0e0e0", Muted = "#888888", Bar = "#8c52ff";
    const int Width = 800;
    const string Font = "font-family=\"'Segoe UI', -apple-system, Helvetica, Arial, sans-serif\"";
    public static readonly string[] Ramp = ["#2a2a3e", "#5236b0", "#7446e6", "#9b70ff", "#c8a8ff"];

    public static void Write(GitHubStats stats, string directory)
    {
        Directory.CreateDirectory(directory);
        File.WriteAllText(Path.Combine(directory, "stats.svg"), Summary(stats));
        File.WriteAllText(Path.Combine(directory, "languages.svg"), Languages(stats));
        if (stats.Contributions is not null)
            File.WriteAllText(Path.Combine(directory, "contributions.svg"), Contributions(stats));
    }

    public static IReadOnlyList<(string Value, string Label)> Tiles(GitHubStats stats)
    {
        List<(string, string)> tiles = [(N(stats.Repositories), "Public repositories")];
        if (stats.Contributions is not null)
        {
            tiles.Add((N(stats.TotalContributions), "Contributions, last year"));
            tiles.Add(($"{stats.LongestStreak} {(stats.LongestStreak == 1 ? "day" : "days")}", "Longest streak"));
        }
        tiles.Add((stats.SinceYear.ToString(CultureInfo.InvariantCulture), "On GitHub since"));
        return tiles;
    }

    static string Summary(GitHubStats stats)
    {
        var tiles = Tiles(stats);
        const int width = Width, height = 124, pad = 28;
        var column = (width - 2 * pad) / tiles.Count;
        var svg = Open(width, height, $"GitHub stats: {string.Join(", ", tiles.Select(t => $"{t.Label} {t.Value}"))}");
        svg.Append(Label(pad, 34, "GitHub stats"));
        for (var i = 0; i < tiles.Count; i++)
        {
            var x = pad + i * column;
            svg.Append($"<text x=\"{x}\" y=\"76\" fill=\"{Text}\" font-size=\"26\" font-weight=\"600\">{Escape(tiles[i].Value)}</text>");
            svg.Append($"<text x=\"{x}\" y=\"98\" fill=\"{Muted}\" font-size=\"12\">{Escape(tiles[i].Label)}</text>");
        }
        return svg.Append("</svg>").ToString();
    }

    static string Languages(GitHubStats stats)
    {
        const int width = Width, pad = 28, labelWidth = 110, rowHeight = 28, barHeight = 14, top = 54;
        var rows = stats.Languages;
        var height = top + rows.Count * rowHeight + 10;
        var max = rows.Count > 0 ? rows.Max(r => r.Repositories) : 1;
        var maxBar = width - 2 * pad - labelWidth - 32;
        var svg = Open(width, height, "Repositories by primary language: " + string.Join(", ", rows.Select(r => $"{r.Language} {r.Repositories}")));
        svg.Append(Label(pad, 34, "Repositories by primary language"));
        for (var i = 0; i < rows.Count; i++)
        {
            var y = top + i * rowHeight;
            var barWidth = Math.Max(6.0, maxBar * rows[i].Repositories / (double)max);
            svg.Append($"<text x=\"{pad}\" y=\"{y + 12}\" fill=\"{Text}\" font-size=\"13\">{Escape(rows[i].Language)}</text>");
            svg.Append($"<path d=\"{RoundedEndBar(pad + labelWidth, y, barWidth, barHeight)}\" fill=\"{Bar}\"/>");
            svg.Append($"<text x=\"{F(pad + labelWidth + barWidth + 8)}\" y=\"{y + 12}\" fill=\"{Text}\" font-size=\"13\">{rows[i].Repositories}</text>");
        }
        return svg.Append("</svg>").ToString();
    }

    static string Contributions(GitHubStats stats)
    {
        const int pad = 28, left = 60, top = 64, cell = 10, pitch = 13;
        var cells = ContributionCalendar.Cells(stats.Contributions!);
        var weeks = cells.Max(c => c.Week) + 1;
        var width = Math.Max(Width, left + weeks * pitch + pad - 3);
        var height = top + 7 * pitch + 42;
        var svg = Open(width, height, $"{stats.TotalContributions} contributions in the last year");
        svg.Append($"<text x=\"{pad}\" y=\"34\" fill=\"{Text}\" font-size=\"14\" font-weight=\"600\">{N(stats.TotalContributions)} contributions in the last year</text>");
        foreach (var (week, month) in ContributionCalendar.MonthLabels(cells))
            svg.Append($"<text x=\"{left + week * pitch}\" y=\"{top - 8}\" fill=\"{Muted}\" font-size=\"11\">{month}</text>");
        foreach (var (row, name) in new[] { (1, "Mon"), (3, "Wed"), (5, "Fri") })
            svg.Append($"<text x=\"{pad}\" y=\"{top + row * pitch + 9}\" fill=\"{Muted}\" font-size=\"11\">{name}</text>");
        foreach (var c in cells)
            svg.Append($"<rect x=\"{left + c.Week * pitch}\" y=\"{top + c.Weekday * pitch}\" width=\"{cell}\" height=\"{cell}\" rx=\"2\" fill=\"{Ramp[stats.Level(c.Day.Count)]}\"/>");

        // Legend, right-aligned under the grid
        var legendY = top + 7 * pitch + 14;
        var x = width - pad - 5 * pitch - 34;
        svg.Append($"<text x=\"{x - 34}\" y=\"{legendY + 9}\" fill=\"{Muted}\" font-size=\"11\">Less</text>");
        for (var level = 0; level < Ramp.Length; level++)
            svg.Append($"<rect x=\"{x + level * pitch}\" y=\"{legendY}\" width=\"{cell}\" height=\"{cell}\" rx=\"2\" fill=\"{Ramp[level]}\"/>");
        svg.Append($"<text x=\"{x + 5 * pitch + 4}\" y=\"{legendY + 9}\" fill=\"{Muted}\" font-size=\"11\">More</text>");
        return svg.Append("</svg>").ToString();
    }

    static StringBuilder Open(int width, int height, string title) => new StringBuilder()
        .Append($"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"{width}\" height=\"{height}\" viewBox=\"0 0 {width} {height}\" role=\"img\" {Font}>")
        .Append($"<title>{Escape(title)}</title>")
        .Append($"<rect x=\"0.5\" y=\"0.5\" width=\"{width - 1}\" height=\"{height - 1}\" rx=\"10\" fill=\"{Surface}\" stroke=\"{Border}\"/>");

    static string Label(int x, int y, string text) => $"<text x=\"{x}\" y=\"{y}\" fill=\"{Muted}\" font-size=\"13\">{Escape(text)}</text>";

    /// <summary>Bar square at the baseline (left) with a 4px rounded data end (right).</summary>
    static string RoundedEndBar(double x, double y, double w, double h)
    {
        var r = Math.Min(4, w / 2);
        return $"M{F(x)} {F(y)}h{F(w - r)}a{F(r)} {F(r)} 0 0 1 {F(r)} {F(r)}v{F(h - 2 * r)}a{F(r)} {F(r)} 0 0 1 {F(-r)} {F(r)}h{F(r - w)}z";
    }

    static string N(int value) => value.ToString("N0", CultureInfo.InvariantCulture);
    static string F(double value) => value.ToString("0.##", CultureInfo.InvariantCulture);
    static string Escape(string text) => SecurityElement.Escape(text);
}

/// <summary>Lays contribution days out like GitHub's calendar: one column per week, Sunday on top.</summary>
public static class ContributionCalendar
{
    public record Cell(ContributionDay Day, int Week, int Weekday);

    public static List<Cell> Cells(IReadOnlyList<ContributionDay> days)
    {
        var ordered = days.OrderBy(d => d.Date).ToList();
        if (ordered.Count == 0)
            return [];
        var offset = (int)ordered[0].Date.DayOfWeek;
        return ordered.Select((day, i) => new Cell(day, (i + offset) / 7, (int)day.Date.DayOfWeek)).ToList();
    }

    /// <summary>A label at the first week of each month, skipped when it would crowd the previous one.</summary>
    public static List<(int Week, string Month)> MonthLabels(IReadOnlyList<Cell> cells)
    {
        List<(int, string)> labels = [];
        var lastWeek = -10;
        foreach (var cell in cells.Where(c => c.Day.Date.Day == 1))
        {
            var week = cell.Weekday == 0 ? cell.Week : cell.Week + 1;
            if (week - lastWeek < 3 || week > cells[^1].Week)
                continue;
            labels.Add((week, cell.Day.Date.ToString("MMM", CultureInfo.InvariantCulture)));
            lastWeek = week;
        }
        return labels;
    }
}
