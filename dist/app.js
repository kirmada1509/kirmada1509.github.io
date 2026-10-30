// Every profile, project, link, and resume is already present in the HTML.
// This file only adds controls, navigation feedback, and decorative motion.
const copyButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
let clearCopyStatus;
copyButton?.addEventListener('click', async () => {
  clearTimeout(clearCopyStatus);
  try {
    await navigator.clipboard.writeText('f20240732@pilani.bits-pilani.ac.in');
    copyStatus.textContent = 'Email copied.';
    copyButton.setAttribute('aria-label', 'Email address copied');
  } catch {
    copyStatus.textContent = 'Select the email address to copy it.';
  }
  clearCopyStatus = setTimeout(() => {
    copyStatus.textContent = '';
    copyButton.setAttribute('aria-label', 'Copy email address');
  }, 4000);
});

const timeElement = document.querySelector('#local-time');
function updateTime() {
  if (!timeElement) return;
  const date = new Date();
  timeElement.textContent = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false
  }).format(date) + ' IST';
  timeElement.dateTime = date.toISOString();
}
updateTime();
if (timeElement) setInterval(updateTime, 60000);
document.querySelector('[data-print]')?.addEventListener('click', () => window.print());

// One passive scroll listener updates the index and decorative reading indicator.
const navLinks = [...document.querySelectorAll('.sidebar nav a')];
const sections = navLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
const progress = document.querySelector('.reading-progress');
let scrollFramePending = false;
function updateScrollState() {
  scrollFramePending = false;
  const range = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0})`;
  if (!sections.length) return;
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= innerHeight * 0.35) current = section;
  }
  if (scrollY + innerHeight >= document.documentElement.scrollHeight - 5) current = sections.at(-1);
  for (const link of navLinks) {
    if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
addEventListener('scroll', () => {
  if (!scrollFramePending) {
    scrollFramePending = true;
    requestAnimationFrame(updateScrollState);
  }
}, { passive: true });
addEventListener('resize', updateScrollState);
updateScrollState();

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const motionToggle = document.querySelector('[data-motion-toggle]');
const traceButtons = [...document.querySelectorAll('[data-trace]')];
const visuals = [...document.querySelectorAll('.project-visual, .architecture')];
const activeAnimations = new Set();
const visualAnimations = new WeakMap();
const playedOnEntry = new WeakSet();
let storedMotion;
try { storedMotion = localStorage.getItem('portfolio-motion'); } catch { /* Storage is optional. */ }
let motionEnabled = false;

function remember(animation, group) {
  activeAnimations.add(animation);
  group?.push(animation);
  animation.finished.then(() => activeAnimations.delete(animation), () => activeAnimations.delete(animation));
  return animation;
}

// Only outlines and decoration animate. Labels never move, fade, or get replaced.
function traceFlow(visual) {
  if (!motionEnabled || document.hidden || !Element.prototype.animate) return;
  for (const animation of visualAnimations.get(visual) || []) animation.cancel();
  const animations = [];
  visualAnimations.set(visual, animations);
  const nodes = [...visual.querySelectorAll(
    '.runtime-nodes > div, .ai-flow-row > span, .guard-input > span, .guard-outcomes > span, ' +
    '.sync-node, .app-modules > span, .mobile-build > span, .architecture-flow > span'
  )];
  nodes.forEach((node, index) => {
    remember(node.animate([
      { outlineColor: 'transparent', boxShadow: '0 0 0 0 rgba(159,192,255,0)' },
      { outlineColor: 'rgba(159,192,255,.72)', boxShadow: '0 0 18px 1px rgba(159,192,255,.12)', offset: .4 },
      { outlineColor: 'transparent', boxShadow: '0 0 0 0 rgba(159,192,255,0)' }
    ], { duration: 950, delay: index * 140, easing: 'ease-in-out', id: 'diagram-signal' }), animations);
  });
  const connector = visual.querySelector('.connector');
  if (connector) remember(connector.animate([
    { backgroundColor: '#4a5666' }, { backgroundColor: '#b9d2ff', offset: .5 }, { backgroundColor: '#4a5666' }
  ], { duration: 650, id: 'signal-connector' }), animations);
}

function applyMotion() {
  motionEnabled = !reducedMotion.matches && storedMotion !== 'off';
  document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off';
  if (motionToggle) {
    motionToggle.hidden = false;
    motionToggle.disabled = reducedMotion.matches;
    motionToggle.setAttribute('aria-pressed', String(motionEnabled));
    motionToggle.setAttribute('aria-label', reducedMotion.matches
      ? 'Animations disabled by your reduced-motion preference'
      : 'Decorative animations');
    motionToggle.title = reducedMotion.matches ? 'Your system prefers reduced motion' : 'Toggle decorative animations';
    motionToggle.querySelector('[data-motion-label]').textContent = motionEnabled ? 'Motion on' : 'Motion off';
  }
  for (const button of traceButtons) button.hidden = !motionEnabled;
  if (!motionEnabled) {
    for (const animation of activeAnimations) animation.cancel();
    activeAnimations.clear();
    document.querySelectorAll('.is-pointing').forEach(card => card.classList.remove('is-pointing'));
    return;
  }
  for (const visual of visuals) {
    const rect = visual.getBoundingClientRect();
    if (!playedOnEntry.has(visual) && rect.top < innerHeight * .8 && rect.bottom > 0) {
      playedOnEntry.add(visual);
      traceFlow(visual);
    }
  }
}

motionToggle?.addEventListener('click', () => {
  if (reducedMotion.matches) return;
  storedMotion = motionEnabled ? 'off' : 'on';
  try { localStorage.setItem('portfolio-motion', storedMotion); } catch { /* Keep the in-memory preference. */ }
  applyMotion();
});
reducedMotion.addEventListener('change', applyMotion);
applyMotion();

for (const button of traceButtons) {
  button.addEventListener('click', () => traceFlow(button.closest('.project-visual')));
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting && motionEnabled && !playedOnEntry.has(entry.target)) {
        playedOnEntry.add(entry.target);
        traceFlow(entry.target);
      }
    }
  }, { threshold: .45 });
  visuals.forEach(visual => observer.observe(visual));
}

for (const card of document.querySelectorAll('.project')) {
  const visual = card.querySelector('.project-visual');
  if (!visual) continue;
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  card.addEventListener('pointerenter', event => {
    if (!motionEnabled || !finePointer.matches || event.pointerType === 'touch') return;
    card.classList.add('is-pointing');
    traceFlow(visual);
  });
  card.addEventListener('pointermove', event => {
    if (!motionEnabled || !finePointer.matches || event.pointerType === 'touch') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      if (!motionEnabled || !card.classList.contains('is-pointing')) return;
      const rect = visual.getBoundingClientRect();
      visual.style.setProperty('--pointer-x', `${Math.min(rect.width, Math.max(0, pointerX - rect.left))}px`);
      visual.style.setProperty('--pointer-y', `${Math.min(rect.height, Math.max(0, pointerY - rect.top))}px`);
    });
  });
  card.addEventListener('pointerleave', () => {
    card.classList.remove('is-pointing');
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
  });
  card.addEventListener('focusin', event => {
    if (!event.target.closest('[data-trace]')) traceFlow(visual);
  });
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) for (const animation of activeAnimations) animation.cancel();
});
