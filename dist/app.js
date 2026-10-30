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

const timeElements = [...document.querySelectorAll('#local-time, [data-local-time]')];
function updateTime() {
  const date = new Date();
  const clock = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false
  }).format(date) + ' IST';
  for (const element of timeElements) {
    element.textContent = clock;
    element.dateTime = date.toISOString();
  }
  for (const element of document.querySelectorAll('[data-local-date]')) {
    element.textContent = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short'
    }).format(date);
  }
}
updateTime();
if (timeElements.length) setInterval(updateTime, 60000);
initWeather();
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
let pipelineController;
let dotBackdropController;

function remember(animation, group) {
  activeAnimations.add(animation);
  group?.push(animation);
  animation.finished.then(() => activeAnimations.delete(animation), () => activeAnimations.delete(animation));
  return animation;
}

// Only outlines and decoration animate. Labels never move, fade, or get replaced.
function traceFlow(visual) {
  if (!motionEnabled || document.hidden || !Element.prototype.animate) return;
  // The featured diagram belongs to the explicit, pausable walkthrough.
  if (visual.querySelector('[data-pipeline]')) return;
  for (const animation of visualAnimations.get(visual) || []) animation.cancel();
  const animations = [];
  visualAnimations.set(visual, animations);
  const nodes = [...visual.querySelectorAll(
    '.runtime-nodes > div, .ai-flow-row > span, .guard-input > span, .guard-outcomes > span, ' +
    '.sync-node, .app-modules > span, .mobile-build > span, .mobile-build > div > span, .architecture-flow > span'
  )];
  let groups = nodes.map(node => [node]);
  if (visual.classList.contains('guard-visual')) groups = [nodes.slice(0, 1), nodes.slice(1, 2), nodes.slice(2)];
  if (visual.classList.contains('mobile-visual')) groups = [nodes.slice(0, 4), nodes.slice(4, 5), nodes.slice(5, 6), nodes.slice(6)];
  groups.forEach((group, index) => group.forEach(node => {
    const color = getComputedStyle(node).getPropertyValue('--signal-color').trim() || '#9fc0ff';
    remember(node.animate([
      { outlineColor: 'transparent', boxShadow: '0 0 0 transparent' },
      { outlineColor: color, boxShadow: `0 0 16px color-mix(in srgb, ${color} 22%, transparent)`, offset: .4 },
      { outlineColor: 'transparent', boxShadow: '0 0 0 transparent' }
    ], { duration: 1050, delay: index * 320, easing: 'ease-in-out', id: 'diagram-signal' }), animations);
  }));
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
  pipelineController?.onMotionChange();
  dotBackdropController?.onMotionChange();
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
pipelineController = initPipeline();
dotBackdropController = initDotBackdrop();
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
    if (!event.target.closest('[data-trace], [data-pipeline]')) traceFlow(visual);
  });
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    for (const animation of activeAnimations) animation.cancel();
    pipelineController?.pause();
    dotBackdropController?.reset();
  }
});

// SVG dot grid + radial pointer mask adapted from Magic UI (MIT).
// Source details and the full licence: /assets/magic-ui-LICENSE.txt.
// No frame runs while idle; text, layout and pointer targets are untouched.
function initDotBackdrop() {
  const reveal = document.querySelector('[data-dot-reveal]');
  if (!reveal) return;
  let frame = 0;
  let x = 0;
  let y = 0;
  const enabled = () => motionEnabled && finePointer.matches && !document.hidden;

  function reset() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    reveal.dataset.active = 'false';
  }

  document.addEventListener('pointermove', event => {
    if (!enabled() || event.pointerType !== 'mouse') return;
    x = event.clientX;
    y = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!enabled()) return;
      reveal.style.setProperty('--dot-x', `${x}px`);
      reveal.style.setProperty('--dot-y', `${y}px`);
      if (reveal.dataset.active !== 'true') reveal.dataset.active = 'true';
    });
  }, { passive: true });

  // Leaving the window, switching tabs, or disabling motion clears the glow.
  window.addEventListener('pointerout', event => { if (!event.relatedTarget) reset(); });
  window.addEventListener('blur', reset);
  window.addEventListener('pagehide', reset);
  finePointer.addEventListener('change', reset);
  return { reset, onMotionChange() { if (!enabled()) reset(); } };
}

function initPipeline() {
  const demo = document.querySelector('[data-pipeline]');
  if (!demo) return;
  const visual = demo.closest('.project-visual');
  const steps = [...demo.querySelectorAll('[data-pipeline-step]')];
  const nodes = [...visual.querySelectorAll('[data-voice-node]')];
  const run = demo.querySelector('[data-pipeline-run]');
  const stepButton = demo.querySelector('[data-pipeline-step-button]');
  const speed = demo.querySelector('[data-pipeline-speed]');
  const status = demo.querySelector('[data-pipeline-status]');
  const elapsedElement = demo.querySelector('[data-pipeline-elapsed]');
  const help = demo.querySelector('[data-pipeline-help]');
  const durations = steps.map(step => Number(step.dataset.ms));
  const ends = durations.map((_, index) => durations.slice(0, index + 1).reduce((sum, ms) => sum + ms, 0));
  const total = ends.at(-1);
  let elapsed = 0;
  let state = 'idle';
  let frame = 0;
  let previousTime = 0;
  let announcement = '';
  let activeIndex = -1;
  demo.querySelector('[data-pipeline-controls]').hidden = false;
  help.hidden = false;

  function paint() {
    demo.dataset.state = state;
    elapsedElement.textContent = Math.round(elapsed);
    const current = state === 'idle' || state === 'complete' ? -1 : ends.findIndex(end => elapsed < end);
    for (const [index, step] of steps.entries()) {
      step.dataset.phase = elapsed >= ends[index] ? 'done' : index === current ? 'active' : 'waiting';
      if (index === current) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
      const start = index ? ends[index - 1] : 0;
      step.style.setProperty('--step-progress', Math.max(0, Math.min(1, (elapsed - start) / durations[index])));
    }
    // Paint diagram nodes only on a stage change, not on each animation frame.
    if (current !== activeIndex || state === 'idle' || state === 'complete') {
      activeIndex = current;
      for (const node of nodes) {
        const active = current >= 0 && node.dataset.voiceNode === steps[current].dataset.node;
        const done = steps.some((step, index) => step.dataset.node === node.dataset.voiceNode && elapsed >= ends[index]);
        node.dataset.phase = active ? 'active' : done ? 'done' : 'waiting';
      }
    }
    const label = state === 'running' ? 'Pause' : state === 'paused' ? 'Resume' : state === 'complete' ? 'Replay' : 'Run example';
    run.querySelector('span').textContent = label;
    const playing = String(state === 'running');
    if (run.dataset.playing !== playing) {
      run.querySelector('svg path').setAttribute('d', playing === 'true' ? 'M8 5v14M16 5v14' : 'm8 4 12 8L8 20Z');
      run.dataset.playing = playing;
    }
    run.setAttribute('aria-label', `${label === 'Run example' ? 'Run' : label} voice pipeline example`);
    run.disabled = !motionEnabled;
    stepButton.disabled = state === 'running' || state === 'complete';
    const text = state === 'idle' ? `Example budget · ${total} ms across ${steps.length} stages`
      : state === 'complete' ? 'Example complete · audio delivered'
      : `${state === 'paused' ? 'Paused' : 'Running'} · ${current + 1}/${steps.length} · ${steps[current].querySelector('strong').textContent}`;
    if (text !== announcement) { status.textContent = text; announcement = text; }
    const hint = !motionEnabled ? 'Motion is off. Use Step to inspect each stage without animation.'
      : `${speed.value}× playback · ${total} ms of example work shown over ${(total / Number(speed.value) / 1000).toFixed(2)} seconds.`;
    if (help.textContent !== hint) help.textContent = hint;
  }
  function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; }
  function pause() { if (state === 'running') { stop(); state = 'paused'; paint(); } }
  function tick(now) {
    if (state !== 'running' || !motionEnabled || document.hidden) { pause(); return; }
    elapsed = Math.min(total, elapsed + (now - previousTime) * Number(speed.value));
    previousTime = now;
    if (elapsed >= total) { state = 'complete'; frame = 0; paint(); return; }
    paint();
    frame = requestAnimationFrame(tick);
  }
  run.addEventListener('click', () => {
    if (!motionEnabled) return;
    if (state === 'running') { pause(); return; }
    if (state === 'complete') { elapsed = 0; activeIndex = -1; }
    state = 'running'; previousTime = performance.now(); paint(); frame = requestAnimationFrame(tick);
  });
  demo.querySelector('[data-pipeline-reset]').addEventListener('click', () => {
    stop(); elapsed = 0; state = 'idle'; activeIndex = -1; paint();
  });
  stepButton.addEventListener('click', () => {
    if (state === 'running' || state === 'complete') return;
    if (state === 'idle') { state = 'paused'; elapsed = 0; }
    else { elapsed = ends.find(end => end > elapsed) ?? total; state = elapsed >= total ? 'complete' : 'paused'; }
    paint();
  });
  speed.addEventListener('change', () => { previousTime = performance.now(); paint(); });
  return { pause, onMotionChange() { if (!motionEnabled) pause(); paint(); } };
}

async function initWeather() {
  const panels = [...document.querySelectorAll('[data-location]')];
  if (!panels.length) return;
  const key = 'pilani-weather-v1';
  const ttl = 20 * 60 * 1000;
  let inFlight = false;
  const clock = value => new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false
  }).format(new Date(value * 1000));
  const conditions = {
    0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Freezing fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 56: 'Freezing drizzle', 57: 'Freezing drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains', 80: 'Rain showers',
    81: 'Rain showers', 82: 'Heavy showers', 85: 'Snow showers', 86: 'Snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm / hail', 99: 'Thunderstorm / hail'
  };
  function valid(data) {
    const c = data?.current;
    return [c?.time, c?.temperature_2m, c?.weather_code].every(Number.isFinite);
  }
  function render(data) {
    const c = data.current;
    const values = { temp: Math.round(c.temperature_2m), condition: conditions[c.weather_code] || 'Current weather',
      updated: `As of ${clock(c.time)} IST` };
    for (const panel of panels) {
      for (const [field, value] of Object.entries(values)) panel.querySelector(`[data-weather-${field}]`).textContent = value;
      panel.querySelector('[data-weather-body]').hidden = false;
      panel.querySelector('[data-weather-fallback]').hidden = true;
    }
  }
  function unavailable() {
    for (const panel of panels) {
      panel.querySelector('[data-weather-body]').hidden = true;
      panel.querySelector('[data-weather-fallback]').hidden = false;
      panel.querySelector('[data-weather-fallback]').textContent = 'Weather unavailable';
      panel.querySelector('[data-weather-updated]').textContent = 'Current conditions';
    }
  }
  async function refresh() {
    if (document.hidden || inFlight) return;
    try {
      const cached = JSON.parse(localStorage.getItem(key));
      if (cached && Date.now() >= cached.fetchedAt && Date.now() - cached.fetchedAt < ttl && valid(cached.data)) { render(cached.data); return; }
    } catch { /* Network weather also works without browser storage. */ }
    for (const panel of panels) panel.querySelector('[data-weather-fallback]').textContent = 'Loading weather…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    inFlight = true;
    try {
      // Fixed city coordinates, not visitor geolocation. Model-based current conditions.
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=28.36725&longitude=75.60352&current=temperature_2m,weather_code&timezone=Asia%2FKolkata&timeformat=unixtime';
      const response = await fetch(url, { signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
      if (!response.ok) throw new Error('Weather request failed');
      const data = await response.json();
      if (!valid(data)) throw new Error('Invalid weather data');
      render(data);
      try { localStorage.setItem(key, JSON.stringify({ fetchedAt: Date.now(), data })); } catch { /* Cache is optional. */ }
    } catch { unavailable(); }
    finally { clearTimeout(timeout); inFlight = false; }
  }
  refresh();
  setInterval(refresh, ttl);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
}
