# macplb.github.io

Personal site: plain HTML, CSS and JavaScript. No build step and no server-side code.

```
index.html        Home page
posts.html        Post index
post.html         Single post, opened as post.html?slug=my-post
collection.html   Hobby photos
posts/            Markdown posts
collection/       Photos, one folder per section
static/           CSS, JavaScript and images
```

## Write a post

1. Copy `posts/_example.md` to `posts/my-post.md` and edit it.
2. Add `my-post.md` to `posts/index.json`.
3. Serve the repository root over HTTP, for example `python3 -m http.server`, and open
   <http://localhost:8000/>. Opening the files directly with `file://` will not work because
   the browser is not allowed to fetch the Markdown and JSON files.

The three newest posts show on the home page, which links to the full list. The file name
becomes the URL: `post.html?slug=my-post`. Once there are a few posts, add a `Posts` link to
the nav in each HTML page.

## Add collection photos

Drop images into a folder under `collection/`, for example
`collection/1-vinyl/Pink Floyd - The Wall.jpg`, then add the file name to
`collection/index.json`:

```json
{
  "1-vinyl": ["Pink Floyd - The Wall.jpg"]
}
```

Each folder becomes a section ("1-vinyl" shows as "Vinyl"; the number only sets the order)
and the file name becomes the caption. Photos are published as-is, so resize them to about
1600px first. The page is not linked from the home page yet; add a link in the About section
once it has photos.

## Deploy

Pushing to `master` copies the site to GitHub Pages (`.github/workflows/pages.yml`).
