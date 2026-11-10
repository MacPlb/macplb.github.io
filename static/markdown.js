export const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character]));

const decodeEntities = value => value
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'");

function safeUrl(url) {
  const value = decodeEntities(url).trim();
  if (/^(https?:|mailto:|tel:)/i.test(value)) return escapeHtml(value);
  if (/^(#|\/|\.\.?\/)/.test(value)) return escapeHtml(value);
  if (/^[\w.-]+(\/|$)/.test(value)) return escapeHtml(value);
  return '#';
}

function inline(text) {
  const code = [];
  let result = escapeHtml(text);

  result = result.replace(/`([^`]+)`/g, (_, value) => {
    code.push(value);
    return `\u0000${code.length - 1}\u0000`;
  });

  result = result.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, alt, url, title) =>
    `<img src="${safeUrl(url)}" alt="${alt}"${title ? ` title="${title}"` : ''}>`);

  result = result.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, label, url, title) =>
    `<a href="${safeUrl(url)}"${title ? ` title="${title}"` : ''}>${label}</a>`);

  result = result
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/(^|[^_])_([^_\n]+)_/g, '$1<em>$2</em>');

  return result.replace(/\u0000(\d+)\u0000/g, (_, index) => `<code>${code[index]}</code>`);
}

function splitRow(line) {
  let row = line.trim();
  if (row.startsWith('|')) row = row.slice(1);
  if (row.endsWith('|')) row = row.slice(0, -1);
  return row.split('|').map(cell => cell.trim());
}

function isTableStart(lines, index) {
  return index + 1 < lines.length
    && lines[index].includes('|')
    && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(lines[index + 1]);
}

function isBlockStart(lines, index) {
  const line = lines[index];
  return /^```/.test(line)
    || /^#{1,6}\s+/.test(line)
    || /^(\*{3,}|-{3,}|_{3,})\s*$/.test(line)
    || /^>\s?/.test(line)
    || /^\s*([-*+]|\d+\.)\s+/.test(line)
    || isTableStart(lines, index);
}

function renderTable(lines, index) {
  const headers = splitRow(lines[index]);
  const alignments = splitRow(lines[index + 1]).map(cell => {
    const left = cell.startsWith(':');
    const right = cell.endsWith(':');
    return left && right ? 'center' : right ? 'right' : left ? 'left' : '';
  });
  let cursor = index + 2;
  const rows = [];

  while (cursor < lines.length && lines[cursor].trim() && lines[cursor].includes('|')) {
    rows.push(splitRow(lines[cursor]));
    cursor++;
  }

  const style = alignment => alignment ? ` style="text-align:${alignment}"` : '';
  const head = headers.map((cell, column) => `<th${style(alignments[column])}>${inline(cell)}</th>`).join('');
  const body = rows.map(row => `<tr>${headers.map((_, column) => `<td${style(alignments[column])}>${inline(row[column] ?? '')}</td>`).join('')}</tr>`).join('');

  return {
    html: `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`,
    next: cursor,
  };
}

export function renderMarkdown(markdown) {
  const lines = String(markdown).replace(/\r\n?/g, '\n').split('\n');
  let html = '';
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index++;
      continue;
    }

    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      const code = [];
      index++;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) {
        code.push(lines[index]);
        index++;
      }
      index++;
      html += `<pre><code${fence[1] ? ` class="language-${escapeHtml(fence[1])}"` : ''}>${escapeHtml(code.join('\n'))}</code></pre>`;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      html += `<h${level}>${inline(heading[2])}</h${level}>`;
      index++;
      continue;
    }

    if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(line)) {
      html += '<hr>';
      index++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ''));
        index++;
      }
      html += `<blockquote>${renderMarkdown(quote.join('\n'))}</blockquote>`;
      continue;
    }

    if (isTableStart(lines, index)) {
      const table = renderTable(lines, index);
      html += table.html;
      index = table.next;
      continue;
    }

    const list = line.match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
    if (list) {
      const ordered = /^\d+\.$/.test(list[2]);
      const items = [];

      while (index < lines.length) {
        const item = lines[index].match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
        if (!item || /^\d+\.$/.test(item[2]) !== ordered) break;

        let text = item[3];
        index++;

        while (index < lines.length && /^\s{2,}\S/.test(lines[index]) && !/^(\s*)([-*+]|\d+\.)\s+/.test(lines[index])) {
          text += ` ${lines[index].trim()}`;
          index++;
        }

        items.push(text);
      }

      const tag = ordered ? 'ol' : 'ul';
      html += `<${tag}>${items.map(item => `<li>${inline(item)}</li>`).join('')}</${tag}>`;
      continue;
    }

    const paragraph = [];
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines, index)) {
      paragraph.push(lines[index]);
      index++;
    }
    html += `<p>${inline(paragraph.join('\n')).replace(/ {2,}\n/g, '<br>\n')}</p>`;
  }

  return html;
}
