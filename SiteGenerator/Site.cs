namespace SiteGenerator;

/// <summary>Identity used across all pages. After renaming the GitHub account, only GitHubUser needs changing.</summary>
public static class Site
{
    public const string Nickname = "MacPlb";
    public const string GitHubUser = "MacPlb";
    public const string GitHub = "https://github.com/" + GitHubUser;
    public const string Email = "macplb@proton.me";
    public const string LinkedIn = "https://pl.linkedin.com/in/maciej-pa%C5%82ubicki-b83456253";

    /// <summary>Repositories shown as cards in the GitHub section, in this order.</summary>
    public static readonly string[] FeaturedRepos = ["Vertical-Tabs", "macplb.github.io", "nix-os-configuration", "ArduinoThermometer"];
}
