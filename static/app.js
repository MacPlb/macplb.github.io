import { escapeHtml, renderMarkdown } from './markdown.js';
import { lang, t, restorePlace } from './i18n.js';

const longDate = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

async function fetchText(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${path}`);
  return response.text();
}

const fetchJSON = async path => JSON.parse(await fetchText(path));

// Files starting with _ are drafts and templates
const isPublished = file => file.endsWith('.md') && !file.startsWith('_');
const slugOf = file => file.replace(/\.md$/, '');

function tagsHtml(tags) {
  if (!tags.length) return '';
  return `<ul class="tags">${tags.map(tag => `<li>${escapeHtml(tag)}</li>`).join('')}</ul>`;
}

function postListHtml(posts) {
  return posts.map(post => `
    <li>
      <time datetime="${post.date}">${post.displayDate}</time>
      <div>
        <a href="post.html?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a>
        ${post.summary ? `<p>${escapeHtml(post.summary)}</p>` : ''}
        ${tagsHtml(post.tags)}
      </div>
    </li>`).join('');
}

function parsePost(slug, text) {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`${slug}.md: file names may only use a-z, 0-9 and '-'`);
  }

  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const end = lines[0] === '---' ? lines.indexOf('---', 1) : -1;
  if (end < 0) throw new Error(`${slug}.md: missing front matter`);

  const meta = {};
  for (const line of lines.slice(1, end)) {
    const colon = line.indexOf(':');
    if (colon < 0) continue;
    meta[line.slice(0, colon).trim().toLowerCase()] = line.slice(colon + 1).trim().replace(/^"|"$/g, '');
  }

  const required = key => {
    if (!meta[key]) throw new Error(`${slug}.md: front matter is missing '${key}'`);
    return meta[key];
  };

  const date = required('date');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${slug}.md: date must be written as yyyy-MM-dd`);
  }

  const body = lines.slice(end + 1).join('\n');
  const words = body.match(/\S+/g)?.length ?? 0;

  return {
    slug,
    title: required('title'),
    date,
    displayDate: longDate.format(new Date(`${date}T00:00:00Z`)),
    summary: meta.summary || '',
    tags: (meta.tags || '').split(',').map(tag => tag.trim()).filter(Boolean),
    readingTime: Math.max(1, Math.round(words / 220)),
    html: renderMarkdown(body),
  };
}

const loadPost = async file => parsePost(slugOf(file), await fetchText(`posts/${encodeURIComponent(file)}`));

async function loadPosts() {
  const files = (await fetchJSON('posts/index.json')).filter(isPublished);
  const posts = await Promise.all(files.map(loadPost));
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

function addCopyButtons(root) {
  if (!navigator.clipboard) return;
  for (const code of root.querySelectorAll('pre > code')) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy';
    button.textContent = t('js.copy', 'Copy');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = t('js.copied', 'Copied');
      } catch {
        button.textContent = t('js.failed', 'Failed');
      }
      setTimeout(() => { button.textContent = t('js.copy', 'Copy'); }, 2000);
    });
    code.parentElement.append(button);
  }
}

async function renderHome() {
  const posts = await loadPosts();
  if (!posts.length) return;
  document.querySelector('#latest-posts').innerHTML = postListHtml(posts.slice(0, 3));
  document.querySelector('#posts').hidden = false;
}

async function renderPostsPage() {
  const status = document.querySelector('#posts-status');
  try {
    const posts = await loadPosts();
    if (posts.length) document.querySelector('#post-list').innerHTML = postListHtml(posts);
    else status.hidden = false;
  } catch (error) {
    status.textContent = t('js.postsError', 'Could not load posts.');
    status.hidden = false;
    throw error;
  }
}

function showMissingPost(container) {
  const title = t('js.missing', 'Post not found');
  document.title = `${title} · Maciej Pałubicki`;
  container.innerHTML = `
    <header><h1>${title}</h1></header>
    <p>${t('js.missingText', 'The post you are looking for does not exist.')}</p>
    <p class="back"><a href="posts.html">${t('js.allPosts', '&larr; All posts')}</a></p>`;
}

async function renderPostPage() {
  const container = document.querySelector('#post');
  const slug = new URLSearchParams(location.search).get('slug');

  try {
    const files = await fetchJSON('posts/index.json');
    const file = files.find(name => isPublished(name) && slugOf(name) === slug);
    if (!file) {
      showMissingPost(container);
      return;
    }

    const post = await loadPost(file);
    document.title = `${post.title} · Maciej Pałubicki`;
    document.querySelector('meta[name="description"]').content = post.summary || post.title;

    container.innerHTML = `
      <header>
        <p class="meta"><time datetime="${post.date}">${post.displayDate}</time> · ${post.readingTime} ${t('js.minRead', 'min read')}</p>
        <h1>${escapeHtml(post.title)}</h1>
        ${tagsHtml(post.tags)}
      </header>
      <div class="post-body">${post.html}</div>
      <p class="back"><a href="posts.html">${t('js.allPosts', '&larr; All posts')}</a></p>`;
    addCopyButtons(container);
  } catch (error) {
    showMissingPost(container);
    throw error;
  }
}

// "1-vinyl" -> "Vinyl"; the number only sets the order
function sectionTitle(folder) {
  const title = folder.replace(/^\d+-/, '').replace(/-/g, ' ');
  return title ? title[0].toUpperCase() + title.slice(1) : folder;
}

const photoCaption = file => file.replace(/\.[^.]+$/, '').replace(/ - /g, ' – ');

async function renderCollection() {
  const container = document.querySelector('#collection-content');

  try {
    const manifest = await fetchJSON('collection/index.json');
    const sections = Object.entries(manifest)
      .filter(([, files]) => Array.isArray(files) && files.length)
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));

    if (!sections.length) {
      container.innerHTML = `<p>${t('js.photosSoon', 'Photos coming soon.')}</p>`;
      return;
    }

    container.innerHTML = sections.map(([folder, files]) => `
      <section class="gallery-section">
        <h2>${escapeHtml(sectionTitle(folder))}</h2>
        <ul class="gallery">
          ${files.map(file => {
            const url = `collection/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;
            const caption = escapeHtml(photoCaption(file));
            return `
            <li>
              <figure>
                <a href="${url}"><img src="${url}" alt="${caption}" loading="lazy"></a>
                <figcaption>${caption}</figcaption>
              </figure>
            </li>`;
          }).join('')}
        </ul>
      </section>`).join('');
  } catch (error) {
    container.innerHTML = `<p>${t('js.collectionError', 'Could not load the collection.')}</p>`;
    throw error;
  }
}

const pages = { home: renderHome, posts: renderPostsPage, post: renderPostPage, collection: renderCollection };

document.querySelector('[data-year]').textContent = new Date().getFullYear();
pages[document.body.dataset.page]?.().catch(console.error).finally(restorePlace);
