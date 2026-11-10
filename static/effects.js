// Visual effects only. Every page reads fine without this file: content is in
// the HTML and the motion styles only apply under html.fx, which the inline
// script in <head> sets unless the visitor prefers reduced motion.
const fx = document.documentElement.classList.contains('fx');
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const scrollHooks = [];

const clockFormat = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Warsaw' });

function startClocks() {
  const clocks = $$('[data-clock]');
  if (!clocks.length) return;
  const tick = () => { for (const clock of clocks) clock.textContent = clockFormat.format(new Date()); };
  tick();
  setInterval(tick, 10_000);
}

// Header turns solid after the hero, hides while scrolling down; progress bar under it
function watchScroll() {
  const header = document.querySelector('.site-header');
  const bar = document.querySelector('.progress');
  let lastY = scrollY;
  let queued = false;

  const update = () => {
    queued = false;
    const y = scrollY;
    header.classList.toggle('scrolled', y > 10);
    header.classList.toggle('away', y > lastY && y > 400 && !header.contains(document.activeElement));
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar?.style.setProperty('--p', max > 0 ? Math.min(y / max, 1) : 0);
    for (const hook of scrollHooks) hook();
  };

  addEventListener('scroll', () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

function highlightNav() {
  const links = new Map($$('.nav-links a[href^="#"]').map(link => [link.hash.slice(1), link]));
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries.filter(entry => entry.isIntersecting)) {
      for (const [id, link] of links) link.classList.toggle('active', id === entry.target.id);
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  for (const id of links.keys()) {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  }
}

// Isometric stack: the card crossing the middle of the screen lights its layer
function driveStack() {
  const grid = document.querySelector('.stack-grid');
  const diagram = grid?.querySelector('.stack-diagram');
  if (!diagram) return;

  const cards = $$('.stack-card', grid);
  const layers = $$('.layer', diagram);
  const show = id => {
    for (const layer of layers) layer.classList.toggle('on', id === 'all' || layer.dataset.layer === id);
    for (const card of cards) card.classList.toggle('active', card.dataset.layer === id);
    diagram.classList.toggle('solo', id !== 'all');
  };

  grid.classList.add('live');
  diagram.classList.add('live');
  show('all');

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) show(entry.target.dataset.layer);
  }, { rootMargin: '-45% 0px -45% 0px' });
  for (const card of cards) observer.observe(card);
}

// Wraps every word in <span class="word"><span>…</span></span>, keeping inline elements such as <em>
function splitWords(element) {
  for (const node of [...element.childNodes]) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      splitWords(node);
      continue;
    }
    if (node.nodeType !== Node.TEXT_NODE) continue;

    const fragment = document.createDocumentFragment();
    for (const part of node.textContent.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        fragment.append(' ');
        continue;
      }
      const word = document.createElement('span');
      word.className = 'word';
      const inner = document.createElement('span');
      inner.textContent = part;
      word.append(inner);
      fragment.append(word);
    }
    node.replaceWith(fragment);
  }
}

function splitLetters() {
  for (const element of $$('[data-split]')) {
    const letters = [...element.textContent].map((character, index) => {
      const span = document.createElement('span');
      span.className = 'ch';
      span.style.setProperty('--i', index);
      span.textContent = character;
      return span;
    });
    element.replaceChildren(...letters);
  }
}

function reveal() {
  const selector = 'main h2, .label, .job, .project, .stats > div, .stack-card, .terminal, .about-grid p, .setup-grid > div > p, .contact-lead, .section-head .pill';
  const targets = $$(selector).filter(element => !element.closest('.hero'));

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -12% 0px' });

  for (const element of targets) {
    if (element.matches('h2')) {
      splitWords(element);
      $$('.word > span', element).forEach((word, index) => word.style.setProperty('--i', index));
    }
    const peers = [...element.parentElement.children].filter(child => child.matches(selector));
    element.style.setProperty('--d', `${Math.min(peers.indexOf(element), 6) * 90}ms`);
    element.classList.add('reveal');
    observer.observe(element);
  }
}

function countUp() {
  const run = element => {
    const from = Number(element.dataset.from ?? 0);
    const to = Number(element.dataset.count);
    const start = performance.now();
    const step = now => {
      const t = Math.min((now - start) / 1600, 1);
      element.textContent = Math.round(from + (to - from) * (1 - (1 - t) ** 4));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      run(entry.target);
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.6 });

  for (const element of $$('[data-count]')) {
    element.textContent = element.dataset.from ?? '0';
    observer.observe(element);
  }
}

// cmatrix-style glyph rain behind the hero; stops drawing once the hero is off screen
function rain() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'rain';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);

  const context = canvas.getContext('2d');
  const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789{}[]<>/=+*#$;:λ';
  const size = 18;
  let width = 0;
  let height = 0;
  let drops = [];
  let running = false;
  let last = 0;

  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    ({ width, height } = hero.getBoundingClientRect());
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.font = `${size}px 'JetBrains Mono', monospace`;
    drops = Array.from({ length: Math.ceil(width / size) }, (_, index) => drops[index] ?? Math.random() * -40);
  };

  const draw = now => {
    if (!running) return;
    requestAnimationFrame(draw);
    if (now - last < 55) return; // ~18 fps is plenty for rain and keeps the CPU idle
    last = now;

    context.fillStyle = 'rgba(26, 26, 46, 0.16)'; // fade towards --ink for the trails
    context.fillRect(0, 0, width, height);
    drops.forEach((row, column) => {
      context.fillStyle = Math.random() < 0.05 ? '#e9dcff' : '#a77bff';
      context.fillText(glyphs[Math.random() * glyphs.length | 0], column * size, row * size);
      drops[column] = row * size > height && Math.random() > 0.97 ? 0 : row + 1;
    });
  };

  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(([entry]) => {
    const wasRunning = running;
    running = entry.isIntersecting;
    if (running && !wasRunning) requestAnimationFrame(draw);
  }).observe(hero);
}

// The hero gopher's pupils follow the pointer
function gopherEyes() {
  const eyes = $$('.gopher .eye').map(eye => ({ white: eye.querySelector('circle'), pupil: eye.querySelector('.pupil') }));
  if (!eyes.length) return;
  let pointer;
  let queued = false;

  const look = () => {
    queued = false;
    for (const { white, pupil } of eyes) {
      const box = white.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      const reach = 7 * Math.min(distance / 120, 1); // SVG units: eye r=17, pupil r=5.5
      pupil.style.translate = `${dx / distance * reach}px ${dy / distance * reach}px`;
    }
  };

  addEventListener('pointermove', event => {
    pointer = { x: event.clientX, y: event.clientY };
    if (!queued) {
      queued = true;
      requestAnimationFrame(look);
    }
  }, { passive: true });
}

// Pointer position for the card spotlight
document.addEventListener('pointermove', event => {
  const card = event.target.closest?.('.project');
  if (!card) return;
  const box = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${event.clientX - box.left}px`);
  card.style.setProperty('--my', `${event.clientY - box.top}px`);
}, { passive: true });

// Close the phone menu once a section is picked
document.getElementById('menu')?.addEventListener('click', event => {
  if (event.target.closest('a')) event.currentTarget.hidePopover();
});

// Print every job, not only the open one (an exclusive accordion would close the others)
addEventListener('beforeprint', () => {
  for (const details of $$('details')) {
    details.removeAttribute('name');
    details.open = true;
  }
});

startClocks();
watchScroll();
highlightNav();
driveStack();

if (fx) {
  splitLetters();
  reveal();
  countUp();
  rain();
  gopherEyes();
}
