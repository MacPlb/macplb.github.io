// Small enhancements on top of static HTML; every page works without this file.

// Tooltips for heatmap cells and chart rows: the title attribute is the no-JS fallback.
const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
tooltip.hidden = true;
document.body.append(tooltip);

for (const element of document.querySelectorAll('.heatmap-grid span, .bar-chart li')) {
    element.dataset.tip = element.title;
    element.removeAttribute('title');
}

function showTooltip(target, x, y) {
    // "3 contributions on 12 Mar 2026" or "C#: 5 of 10 repositories": value first, label second
    const text = target.dataset.tip;
    const [value, label] = text.includes(' on ') ? text.split(' on ') : text.split(': ').reverse();
    const strong = document.createElement('strong');
    strong.textContent = value;
    const small = document.createElement('span');
    small.textContent = label ?? '';
    tooltip.replaceChildren(strong, small);
    tooltip.hidden = false;
    const box = tooltip.getBoundingClientRect();
    tooltip.style.left = Math.min(Math.max(8, x - box.width / 2), innerWidth - box.width - 8) + 'px';
    tooltip.style.top = (y - box.height - 14 < 8 ? y + 18 : y - box.height - 14) + 'px';
}

document.addEventListener('pointermove', event => {
    const target = event.target.closest?.('[data-tip]');
    if (target) showTooltip(target, event.clientX, event.clientY);
    else tooltip.hidden = true;
});
document.addEventListener('scroll', () => { tooltip.hidden = true; }, { passive: true });

// Show the most recent weeks first when the heatmap has to scroll on small screens.
for (const scroller of document.querySelectorAll('.heatmap-scroll')) {
    scroller.scrollLeft = scroller.scrollWidth;
}

// Highlight the menu entry of the section being read.
const navLinks = new Map([...document.querySelectorAll('.nav-links a[href^="#"]')].map(link => [link.hash.slice(1), link]));
if (navLinks.size && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
        for (const entry of entries.filter(entry => entry.isIntersecting)) {
            for (const [id, link] of navLinks) link.classList.toggle('active', id === entry.target.id);
        }
    }, { rootMargin: '-40% 0px -55% 0px' });
    for (const id of navLinks.keys()) {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
    }
}

// Copy-to-clipboard buttons stay hidden unless the clipboard API exists.
for (const button of document.querySelectorAll('[data-copy]')) {
    if (!navigator.clipboard) continue;
    button.hidden = false;
    button.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(button.dataset.copy);
            button.textContent = 'Copied';
        } catch {
            button.textContent = 'Press Ctrl+C';
        }
        setTimeout(() => { button.textContent = 'Copy'; }, 2000);
    });
}

// Collection photos open in a viewer; arrow keys step through them, Esc closes.
const photos = [...document.querySelectorAll('.gallery a')];
if (photos.length && window.HTMLDialogElement) {
    const viewer = document.createElement('dialog');
    viewer.className = 'lightbox';
    viewer.innerHTML = '<img alt=""><p></p><button type="button" class="lightbox-close" aria-label="Close">&times;</button>';
    document.body.append(viewer);
    const image = viewer.querySelector('img');
    const caption = viewer.querySelector('p');
    let index = 0;

    const show = i => {
        index = (i + photos.length) % photos.length;
        image.src = photos[index].href;
        image.alt = photos[index].querySelector('img').alt;
        caption.textContent = photos[index].closest('figure').querySelector('figcaption').textContent;
    };

    photos.forEach((photo, i) => photo.addEventListener('click', event => {
        event.preventDefault();
        show(i);
        viewer.showModal();
    }));
    viewer.querySelector('.lightbox-close').addEventListener('click', () => viewer.close());
    viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
    viewer.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight') show(index + 1);
        if (event.key === 'ArrowLeft') show(index - 1);
    });
}
