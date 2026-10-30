import { readFileSync } from 'node:fs';

// Brand symbols: Simple Icons (CC0); source and licence retained in scripts/icons.
const brandPaths = Object.fromEntries(['github', 'whatsapp'].map(name => [name,
  readFileSync(`scripts/icons/${name}.svg`, 'utf8').match(/<path[^>]*d="([^"]+)"/)[1]
]));
const drawings = {
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7.5 11v6M11.5 17v-6m0 2a2.75 2.75 0 0 1 5.5 0v4"/><circle cx="7.5" cy="7.5" r=".9" fill="currentColor" stroke="none"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  phone: '<path d="m7 3 3 5-3 3c1 3 3 5 6 6l3-3 5 3c0 3-2 5-5 4C9 19 5 15 3 8 2 5 4 3 7 3Z"/>',
  file: '<path d="M14 3H5v18h14V8Zm0 0v5h5M8 12h8M8 16h6"/>',
  projects: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  play: '<path d="m8 4 12 8L8 20Z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  reset: '<path d="M3 10a9 9 0 1 1 1 7M3 4v6h6"/>',
  step: '<path d="m5 5 10 7-10 7ZM19 5v14"/>',
};
export function icon(name) {
  return `<svg class="action-icon${brandPaths[name] ? ' icon-fill' : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${brandPaths[name] ? `<path d="${brandPaths[name]}"/>` : drawings[name] || drawings.file}</svg>`;
}

export function decorateButtons(html) {
  return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/g, (match, attrs, contents) => {
    if (/class="[^"]*(?:wordmark|header-resume)/.test(attrs)) return match;
    const href = attrs.match(/\bhref="([^"]+)"/)?.[1] || '';
    const name = href.includes('github.com') ? 'github' : href.includes('linkedin.com') ? 'linkedin'
      : href.includes('wa.me') ? 'whatsapp' : href.startsWith('mailto:') ? 'mail'
      : href.startsWith('tel:') ? 'phone' : /(?:resume\.html|\.pdf)/.test(href) ? 'file'
      : /class="[^"]*button/.test(attrs) && href === '#work' ? 'projects'
      : /class="project-link"/.test(attrs) ? 'file' : null;
    if (!name) return match;
    const body = contents
      .replace(/<svg class="action-icon[\s\S]*?<\/svg>\s*/g, '')
      .replace(/<span class="button-label">([\s\S]*?)<\/span>(?=<span aria-hidden)/, '$1');
    if (/class="[^"]*\bbutton\b/.test(attrs)) {
      const arrow = body.match(/\s*(<span aria-hidden="true">[\s\S]*?<\/span>)\s*$/);
      const label = arrow ? body.slice(0, arrow.index).trim() : body.trim();
      return `<a${attrs}><span class="button-label">${icon(name)}${label}</span>${arrow ? arrow[1] : ''}</a>`;
    }
    return `<a${attrs}>${icon(name)}${body}</a>`;
  });
}

export function decorateDiagrams(html) {
  const titles = { agent: ['REENTRY', 'AGENT ARCHITECTURE'], guard: ['PRECEDENT', 'AGENT RELIABILITY'], sync: ['ONETAP VENDOR', 'LOCAL-FIRST'], mobile: ['BOSM ’25', 'MOBILE'] };
  return html.replace(/(<div class="project-visual (agent|guard|sync|mobile)-visual"[^>]*>)<div class="visual-toolbar">[\s\S]*?(?=<div class="(?:ai-flow|guard-flow|sync-diagram|mobile-diagram)")/g, (_, opening, kind) => {
    const [name, label] = titles[kind];
    return `${opening.replace('role="img"', 'role="group"')}<div class="visual-toolbar"><span><i></i> ${name}</span><div class="visual-tools"><span>${label}</span><button class="diagram-replay" type="button" data-trace aria-label="Replay ${name} architecture" hidden>${icon('reset')}<span>Replay</span></button></div></div>`;
  });
}

// A pedagogical latency budget, deliberately distinct from project benchmarks.
const pipelineSteps = [
  ['capture', 'End-of-speech gate', 'Silero VAD · 32 ms audio frames', 320, 'teal'],
  ['stt', 'Final transcript', 'Deepgram · finalize speech → text', 180, 'cyan'],
  ['engine', 'Commit the turn', 'Fastify · persist one idempotent turn', 35, 'amber'],
  ['engine', 'Select next prompt', 'Server-authorized interview state', 75, 'amber'],
  ['tts', 'First speech chunk', 'Cartesia · streamed text → audio', 110, 'violet'],
  ['transport', 'Deliver audio', 'LiveKit · WebRTC back to candidate', 45, 'green'],
];
export const pipelineDemo = `<div class="pipeline-demo" data-pipeline data-state="idle">
  <div class="pipeline-heading"><div><span class="mono-label">ONE INTERVIEW TURN</span><p class="pipeline-title">Follow the voice pipeline</p></div><span class="example-badge">ILLUSTRATIVE TIMINGS</span></div>
  <p class="pipeline-disclaimer">Example timing budget after the candidate stops speaking. Illustrative, not production telemetry; stages can overlap in practice.</p>
  <ol class="pipeline-steps">${pipelineSteps.map(([node, title, detail, ms, color], index) => `<li data-pipeline-step data-node="${node}" data-ms="${ms}" style="--signal-color:var(--signal-${color})"><span class="step-number">${String(index + 1).padStart(2, '0')}</span><span class="step-copy"><strong>${title}</strong><small>${detail}</small></span><span class="step-duration">${ms}<small> ms</small></span><span class="step-meter" aria-hidden="true"></span></li>`).join('')}</ol>
  <div class="pipeline-readout"><span data-pipeline-status role="status" aria-live="polite" aria-atomic="true">Example budget · 765 ms across 6 stages</span><span class="pipeline-elapsed"><b data-pipeline-elapsed>0</b> / 765 ms <small>example</small></span></div>
  <div class="pipeline-controls" data-pipeline-controls hidden><button type="button" class="pipeline-run" data-pipeline-run>${icon('play')}<span>Run example</span></button><button type="button" data-pipeline-step-button>${icon('step')}<span>Step</span></button><button type="button" data-pipeline-reset>${icon('reset')}<span>Reset</span></button><label class="pipeline-speed">Speed<select data-pipeline-speed aria-label="Example playback speed"><option value="0.1">0.1×</option><option value="0.25">0.25×</option><option value="1">1×</option></select></label></div>
  <p class="pipeline-help" data-pipeline-help hidden>0.1× playback · 765 ms of example work shown over 7.65 seconds.</p>
</div>`;

export function locationPanel(mobile = false) {
  return `<section class="location-panel${mobile ? ' location-mobile' : ' location-sidebar'}" data-location aria-label="Pilani local time and weather">
    <div class="local-heading"><span>PILANI, INDIA</span><span>UTC+05:30</span></div>
    <div class="local-clock"><time ${mobile ? 'data-local-time' : 'id="local-time"'}>IST</time><span data-local-date>India Standard Time</span></div>
    <div class="weather-slot"><div class="weather-data" data-weather-body hidden><div class="weather-now"><strong><span data-weather-temp>—</span><small>°C</small></strong><span data-weather-condition></span></div><dl class="weather-metrics"><div><dt>FEELS</dt><dd data-weather-feels>—</dd></div><div><dt>WIND</dt><dd data-weather-wind>—</dd></div><div><dt>HUMIDITY</dt><dd data-weather-humidity>—</dd></div><div><dt>SUNSET</dt><dd data-weather-sunset>—</dd></div></dl></div><p data-weather-fallback>Weather unavailable</p></div>
    <p class="weather-source"><span data-weather-updated>Current conditions</span><a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo ↗</a></p>
  </section>`;
}
