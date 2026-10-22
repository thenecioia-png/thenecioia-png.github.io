/* ═══════════════════════════════════════════════════════════════════
   EL NECIO DIGITAL — HUB (frontend)
   Vitrina pública + panel admin inline + doble autenticación.
   ═══════════════════════════════════════════════════════════════════ */

const SECTIONS = [
  { id: 'webs', label: 'Webs', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>' },
  { id: 'canales', label: 'Canales', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M10 8.5v4l3-2z" fill="currentColor" stroke="none"/></svg>' },
  { id: 'redes', label: 'Redes', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.3 10.8 15.7 7.2M8.3 13.2l7.4 3.6"/></svg>' },
  { id: 'apps', label: 'Apps', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>' },
  { id: 'diplomas', label: 'Diplomas', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5"/></svg>' },
  { id: 'contenido', label: 'Contenido', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/></svg>' },
];

/* ── Iconos SVG de línea (reemplazan los emojis genéricos, coherentes con el estilo de fuego) ── */
const ICON_MAP = {
  '⚡': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7z"/></svg>',
  '📺': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 21h8"/></svg>',
  '🎵': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V6l10-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>',
  '🤖': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="11" rx="2"/><circle cx="9" cy="13.5" r="1.2"/><circle cx="15" cy="13.5" r="1.2"/><path d="M12 8V5"/></svg>',
  '👤': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  '📘': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4z"/><path d="M20 4h-7a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h7z"/></svg>',
  '📕': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4z"/><path d="M20 4h-7a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h7z"/></svg>',
  '📗': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4z"/><path d="M20 4h-7a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h7z"/></svg>',
  '📚': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4z"/><path d="M20 4h-7a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h7z"/></svg>',
  '🎬': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>',
  '📸': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h3l2-2.5h6L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="4"/></svg>',
  '🎧': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a8 8 0 0 1 16 0"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></svg>',
  '✉️': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  '✉': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  '📇': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10.5" r="1.5"/><path d="M6 15.5c0-1.3 1-2.2 2.5-2.2s2.5.9 2.5 2.2"/><path d="M13.5 10h5M13.5 13.5h5"/></svg>',
  '📰': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h15v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M19 5h1a1 1 0 0 1 1 1v9"/><path d="M7 9h9M7 12h9M7 15h5"/></svg>',
  '💰': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>',
  '📜': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10a1 1 0 0 1 1 1v17l-5-3-5 3V4a1 1 0 0 1 1-1z"/><path d="M9 8h6M9 12h6"/></svg>',
  '🛒': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 4h2l2.2 11h10.6L20 8H6"/></svg>',
  '🚢': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15c1.5 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0"/><path d="M5 18h14l-1 3H6z"/><path d="M12 3v6M9 6l3 3 3-3"/></svg>',
  '🌐': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>',
  '🧭': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>',
  '🛍️': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1.2 12H7.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  '🎯': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>',
  '🏢': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5l8-3v19"/><path d="M12 21V10l8 3v8"/><path d="M7 9h2M7 13h2M7 17h2M15 15h2M15 18h2"/></svg>',
  '⚖️': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M8 21h8"/><path d="M5 7h14"/><path d="M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/></svg>',
  '📦': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>',
  '🛡️': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.2-3 6.8-7 9-4-2.2-7-4.8-7-9V6z"/></svg>',
  '📊': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/></svg>',
  '🏷️': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="8" cy="8" r="1.5"/></svg>',
  '📣': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h2l9 5V5L6 10H4a1 1 0 0 0-1 1z"/><path d="M18 9a4 4 0 0 1 0 6"/></svg>',
  '©️': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.2a3 3 0 1 0 0 5.6"/></svg>',
  '🤝': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11 4 8v5a3 3 0 0 0 3 3h2"/><path d="M17 11l3-3v5a3 3 0 0 1-3 3h-2"/><path d="M7 11a2.5 2.5 0 0 1 5 0v5h2a2.5 2.5 0 0 1 5 0"/></svg>',
  '🧠': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 5.8A3 3 0 0 0 9 20a3 3 0 0 0 3-3v-1"/><path d="M15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 5.8A3 3 0 0 1 15 20a3 3 0 0 1-3-3v-1"/><path d="M12 6v8"/></svg>',
  '🛃': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v5c0 4.5-3 7.5-8 10-5-2.5-8-5.5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  '🎓': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V17c0 1.5 3 3 6 3s6-1.5 6-3v-5.5"/><path d="M22 9v5"/></svg>',
  '💿': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/></svg>',
  '🔗': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 4 4l4-4a4 4 0 0 0-4-4M14 10a4 4 0 0 0-4-4L6 10a4 4 0 0 0 4 4"/></svg>',
};
function iconSvg(icon) {
  const i = icon || '🔗';
  return ICON_MAP[i] || esc(i);
}

const state = {
  token: localStorage.getItem('hub_token') || null,
  user: null,
  profile: null,
  items: [],
  tempToken: null,   // token temporal durante el flujo 2FA
  loginPhase: 'creds',
};

const $ = (id) => document.getElementById(id);

/* ── helpers ───────────────────────────────────────────────────────── */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function safeUrl(u) {
  if (!u) return '';
  try {
    const p = new URL(u);
    return (p.protocol === 'http:' || p.protocol === 'https:' || p.protocol === 'mailto:' || p.protocol === 'tel:') ? p.href : '';
  } catch { return ''; }
}
const API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? '' : 'https://the-necio-api.onrender.com';
async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) headers['Authorization'] = 'Bearer ' + state.token;
  const res = await fetch(API_BASE + path, { ...opts, headers: { ...headers, ...(opts.headers || {}) } });
  let data = null;
  try { data = await res.json(); } catch { /* no body */ }
  if (!res.ok) throw new Error((data && data.error) || 'Error del servidor');
  return data;
}
function toast(msg, kind) {
  const c = $('toast-container');
  const el = document.createElement('div');
  el.className = 'toast' + (kind ? ' ' + kind : '');
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; }, 2600);
  setTimeout(() => el.remove(), 3000);
}

/* ── modals ────────────────────────────────────────────────────────── */
function openModal(id) { $(id).classList.remove('hidden'); }
function closeModal(id) { $(id).classList.add('hidden'); }
document.querySelectorAll('[data-close]').forEach((btn) => {
  btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close')));
});
document.querySelectorAll('.modal-backdrop').forEach((bd) => {
  bd.addEventListener('click', (e) => { if (e.target === bd) bd.classList.add('hidden'); });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-backdrop').forEach((b) => b.classList.add('hidden'));
});

/* ── render ────────────────────────────────────────────────────────── */
function applyAccent(color) {
  if (color && /^#[0-9a-fA-F]{6}$/.test(color)) {
    document.documentElement.style.setProperty('--accent', color);
  }
}

function renderNavLinks() {
  const rail = $('rail-icons');
  if (!rail) return;
  rail.innerHTML = SECTIONS.map((s) =>
    `<button class="rail-icon" data-section="${s.id}" title="${esc(s.label)}" aria-label="${esc(s.label)}"><span class="rail-ic">${s.icon}</span><span class="rail-txt">${esc(s.label)}</span></button>`).join('');
  rail.querySelectorAll('.rail-icon').forEach((btn) => {
    btn.addEventListener('click', () => {
      const el = $('section-' + btn.getAttribute('data-section'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        const id = en.target.id.replace('section-', '');
        rail.querySelectorAll('.rail-icon').forEach((b) =>
          b.classList.toggle('active', b.getAttribute('data-section') === id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  SECTIONS.forEach((s) => { const el = $('section-' + s.id); if (el) obs.observe(el); });
}

function renderHero() {
  const p = state.profile || {};
  $('nav-emoji').textContent = p.emoji || '⚡';
  $('nav-name').textContent = p.name || 'El Necio';
  $('hero-name').innerHTML = highlightName(p.name || 'El Necio Digital');
  $('hero-tagline').textContent = p.tagline || 'Todo lo mío, en un solo lugar.';
  $('hero-bio').textContent = p.bio || '';
  const aboutBio = $('about-bio');
  if (aboutBio) aboutBio.textContent = p.bio || '';
  $('footer-name').textContent = p.name || 'El Necio Digital';
  $('footer-year').textContent = new Date().getFullYear();
  applyAccent(p.accent);
}
function highlightName(name) {
  const words = esc(name).split(' ');
  if (words.length > 1) {
    const last = words.pop();
    return words.join(' ') + ' <span class="accent">' + last + '</span>';
  }
  return '<span class="accent">' + esc(name) + '</span>';
}

function renderSections() {
  const wrap = $('sections');
  const isAdmin = !!state.token;
  wrap.innerHTML = '';
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  SECTIONS.forEach((sec, idx) => {
    const items = state.items.filter((i) => i.section === sec.id);
    const el = document.createElement('section');
    el.className = 'section reveal';
    el.id = 'section-' + sec.id;

    let grid = '';
    items.forEach((it) => { grid += cardHTML(it, isAdmin); });
    if (isAdmin) {
      grid += `<button class="add-tile" data-add="${sec.id}">＋ Agregar</button>`;
    }

    el.innerHTML = `
      <div class="section-head">
        <span class="section-num">${roman[idx] || ''}</span>
        <div class="section-head-txt">
          <div class="section-kicker">Capítulo ${idx + 1}</div>
          <h2 class="section-title">${esc(sec.label)}</h2>
        </div>
        <span class="section-icon">${sec.icon}</span>
      </div>
      <div class="card-grid">${grid || '<div class="card-desc" style="grid-column:1/-1">Sin elementos todavía.</div>'}</div>`;
    wrap.appendChild(el);
  });

  bindCards();
  observeReveals();
}

function cardHTML(it, isAdmin) {
  const url = safeUrl(it.url);
  const color = it.color || '#ff4d00';
  const inner = `
    <span class="card-icon" aria-hidden="true" style="color:${esc(color)}">${iconSvg(it.icon)}</span>
    <span class="card-body">
      <span class="card-title">${esc(it.title)}</span>
      ${it.description ? `<span class="card-desc">${esc(it.description)}</span>` : ''}
    </span>`;
  const arrow = url ? `<svg class="card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>` : '';

  const adminControls = isAdmin ? `
    <span class="card-admin">
      <button data-action="edit" data-id="${it.id}" title="Editar">✎</button>
      <button data-action="toggle" data-id="${it.id}" title="Público/privado">${it.visibility === 'public' ? '👁' : '🙈'}</button>
      <button data-action="del" data-id="${it.id}" class="del" title="Eliminar">✕</button>
    </span>` : '';

  const flag = isAdmin && it.visibility !== 'public' ? `<span class="card-flag">privado</span>` : '';

  if (url) {
    return `<a class="card${isAdmin && it.visibility !== 'public' ? ' is-private' : ''}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-id="${it.id}">${flag}${inner}${arrow}${adminControls}</a>`;
  }
  return `<div class="card${isAdmin && it.visibility !== 'public' ? ' is-private' : ''}" data-id="${it.id}">${flag}${inner}${arrow}${adminControls}</div>`;
}

function bindCards() {
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });
  document.querySelectorAll('[data-add]').forEach((b) => {
    b.addEventListener('click', () => openItemModal(b.getAttribute('data-add')));
  });
  document.querySelectorAll('[data-action]').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = b.getAttribute('data-id');
      const action = b.getAttribute('data-action');
      if (action === 'edit') openItemModal(null, id);
      if (action === 'del') deleteItem(id);
      if (action === 'toggle') toggleItem(id);
    });
  });
}

function observeReveals() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
}

/* ── data loading ──────────────────────────────────────────────────── */
async function loadPublic() {
  const data = await api('/api/hub/public');
  state.profile = data.profile;
  state.items = data.items || [];
  renderHero();
  renderSections();
  renderNavLinks();
}
async function loadAdmin() {
  const data = await api('/api/hub');
  state.items = Array.isArray(data) ? data : (data.items || []);
  renderSections();
}

/* ── admin session ─────────────────────────────────────────────────── */
function enterAdmin(user) {
  state.user = user;
  $('admin-toggle').classList.add('is-admin');
  $('admin-label').textContent = user.name || 'Admin';
  $('admin-bar').classList.remove('hidden');
  loadAdmin().catch((e) => toast(e.message, 'err'));
}
function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('hub_token');
  $('admin-toggle').classList.remove('is-admin');
  $('admin-label').textContent = 'Admin';
  $('admin-bar').classList.add('hidden');
  loadPublic().catch(() => {});
  toast('Sesión cerrada');
}

/* ── login + 2FA ───────────────────────────────────────────────────── */
$('admin-toggle').addEventListener('click', () => {
  if (state.token) { logout(); return; }
  resetLogin();
  openModal('login-modal');
});
function resetLogin() {
  state.loginPhase = 'creds';
  state.tempToken = null;
  $('login-error').classList.add('hidden');
  $('login-2fa-wrap').classList.add('hidden');
  $('login-password').value = '';
  $('login-2fa').value = '';
}
$('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = $('login-error');
  err.classList.add('hidden');
  try {
    if (state.loginPhase === 'creds') {
      const email = $('login-email').value.trim();
      const password = $('login-password').value;
      const res = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      if (res.requires2fa) {
        state.loginPhase = '2fa';
        state.tempToken = res.temp_token;
        $('login-2fa-wrap').classList.remove('hidden');
        $('login-2fa').focus();
        return;
      }
      state.token = res.token;
      localStorage.setItem('hub_token', res.token);
      closeModal('login-modal');
      resetLogin();
      enterAdmin(res.user);
      toast('Bienvenido, ' + (res.user.name || 'admin'));
    } else {
      const code = $('login-2fa').value.trim();
      const res = await api('/api/auth/2fa/verify', { method: 'POST', body: JSON.stringify({ temp_token: state.tempToken, code }) });
      state.token = res.token;
      localStorage.setItem('hub_token', res.token);
      closeModal('login-modal');
      resetLogin();
      enterAdmin(res.user);
      toast('Bienvenido, ' + (res.user.name || 'admin'));
    }
  } catch (er) {
    err.textContent = er.message;
    err.classList.remove('hidden');
  }
});

/* ── item create/edit ──────────────────────────────────────────────── */
function fillSectionSelect(selected) {
  const sel = $('item-section');
  sel.innerHTML = SECTIONS.map((s) => `<option value="${s.id}"${s.id === selected ? ' selected' : ''}>${esc(s.label)}</option>`).join('');
}
function openItemModal(section, id) {
  $('item-error').classList.add('hidden');
  $('item-id').value = id || '';
  $('item-modal-title').textContent = id ? 'Editar elemento' : 'Agregar elemento';
  $('item-title').value = '';
  $('item-url').value = '';
  $('item-description').value = '';
  $('item-icon').value = '';
  $('item-color').value = '#ff4d00';
  $('item-color-text').value = '#ff4d00';
  $('item-visibility').checked = true;
  fillSectionSelect(section || 'webs');
  if (id) {
    const it = state.items.find((x) => x.id == id);
    if (it) {
      $('item-title').value = it.title || '';
      $('item-url').value = it.url || '';
      $('item-description').value = it.description || '';
      $('item-icon').value = it.icon || '';
      $('item-color').value = it.color || '#ff4d00';
      $('item-color-text').value = it.color || '#ff4d00';
      $('item-visibility').checked = it.visibility === 'public';
      fillSectionSelect(it.section);
    }
  }
  openModal('item-modal');
  $('item-title').focus();
}
$('item-color').addEventListener('input', () => { $('item-color-text').value = $('item-color').value; });
$('item-color-text').addEventListener('input', () => {
  if (/^#[0-9a-fA-F]{6}$/.test($('item-color-text').value)) $('item-color').value = $('item-color-text').value;
});
$('item-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = $('item-error');
  err.classList.add('hidden');
  const id = $('item-id').value;
  const body = {
    section: $('item-section').value,
    title: $('item-title').value.trim(),
    url: $('item-url').value.trim(),
    description: $('item-description').value.trim(),
    icon: $('item-icon').value.trim() || '🔗',
    color: $('item-color').value,
    visibility: $('item-visibility').checked ? 'public' : 'private',
  };
  try {
    if (id) await api('/api/hub/' + id, { method: 'PATCH', body: JSON.stringify(body) });
    else await api('/api/hub', { method: 'POST', body: JSON.stringify(body) });
    closeModal('item-modal');
    await loadAdmin();
    toast(id ? 'Elemento actualizado' : 'Elemento agregado', 'ok');
  } catch (er) {
    err.textContent = er.message;
    err.classList.remove('hidden');
  }
});

async function deleteItem(id) {
  if (!confirm('¿Eliminar este elemento?')) return;
  try {
    await api('/api/hub/' + id, { method: 'DELETE' });
    await loadAdmin();
    toast('Elemento eliminado');
  } catch (e) { toast(e.message, 'err'); }
}
async function toggleItem(id) {
  const it = state.items.find((x) => x.id == id);
  if (!it) return;
  try {
    await api('/api/hub/' + id, { method: 'PATCH', body: JSON.stringify({ visibility: it.visibility === 'public' ? 'private' : 'public' }) });
    await loadAdmin();
    toast(it.visibility === 'public' ? 'Ahora es privado' : 'Ahora es público', 'ok');
  } catch (e) { toast(e.message, 'err'); }
}

/* ── profile ───────────────────────────────────────────────────────── */
$('admin-profile-btn').addEventListener('click', () => {
  const p = state.profile || {};
  $('profile-error').classList.add('hidden');
  $('profile-name').value = p.name || '';
  $('profile-emoji').value = p.emoji || '⚡';
  $('profile-tagline').value = p.tagline || '';
  $('profile-bio').value = p.bio || '';
  $('profile-accent').value = p.accent || '#ff4d00';
  $('profile-accent-text').value = p.accent || '#ff4d00';
  openModal('profile-modal');
});
$('profile-accent').addEventListener('input', () => { $('profile-accent-text').value = $('profile-accent').value; });
$('profile-accent-text').addEventListener('input', () => {
  if (/^#[0-9a-fA-F]{6}$/.test($('profile-accent-text').value)) $('profile-accent').value = $('profile-accent-text').value;
});
$('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = $('profile-error');
  err.classList.add('hidden');
  const body = {
    name: $('profile-name').value.trim(),
    emoji: $('profile-emoji').value.trim() || '⚡',
    tagline: $('profile-tagline').value.trim(),
    bio: $('profile-bio').value.trim(),
    accent: $('profile-accent').value,
  };
  try {
    await api('/api/hub/profile', { method: 'PUT', body: JSON.stringify(body) });
    closeModal('profile-modal');
    state.profile = { ...state.profile, ...body };
    renderHero();
    toast('Perfil actualizado', 'ok');
  } catch (er) {
    err.textContent = er.message;
    err.classList.remove('hidden');
  }
});

/* ── security (2FA) ────────────────────────────────────────────────── */
$('admin-security-btn').addEventListener('click', openSecurity);
async function openSecurity() {
  $('security-error').classList.add('hidden');
  openModal('security-modal');
  try {
    const st = await api('/api/auth/2fa/status');
    renderSecurity(st.enabled);
  } catch (e) {
    $('security-error').textContent = e.message;
    $('security-error').classList.remove('hidden');
  }
}
function renderSecurity(enabled) {
  const status = $('security-status');
  const body = $('security-body');
  if (enabled) {
    status.className = 'security-status on';
    status.textContent = '🔒 Doble autenticación ACTIVADA';
    body.innerHTML = `
      <p class="hint">Tu cuenta está protegida. Al iniciar sesión se te pedirá un código de tu app de autenticación.</p>
      <label class="field"><span>Código actual (para desactivar)</span>
        <input type="text" id="sec-code" inputmode="numeric" maxlength="6" placeholder="000000" />
      </label>
      <button class="btn btn-danger" id="sec-disable">Desactivar 2FA</button>`;
    $('sec-disable').addEventListener('click', async () => {
      const code = $('sec-code').value.trim();
      try {
        await api('/api/auth/2fa/disable', { method: 'POST', body: JSON.stringify({ code }) });
        toast('2FA desactivado', 'ok');
        renderSecurity(false);
      } catch (e) { secError(e.message); }
    });
  } else {
    status.className = 'security-status off';
    status.textContent = '⚠️ Doble autenticación DESACTIVADA';
    body.innerHTML = `
      <button class="btn btn-primary" id="sec-start">Activar 2FA</button>`;
    $('sec-start').addEventListener('click', startSetup);
  }
}
function secError(msg) {
  const err = $('security-error');
  err.textContent = msg;
  err.classList.remove('hidden');
}
async function startSetup() {
  try {
    const setup = await api('/api/auth/2fa/setup', { method: 'POST' });
    const status = $('security-status');
    status.className = 'security-status off';
    status.textContent = '🔑 Escanea o copia esta clave en tu app de autenticación';
    const body = $('security-body');
    body.innerHTML = `
      <div class="hint">1. Abre Google Authenticator, Authy o similar.<br>
        2. Añade una cuenta nueva y escanea el QR o escribe esta clave manualmente.</div>
      <div class="secret-box">${esc(setup.secret)}</div>
      <button class="btn btn-ghost" id="sec-copy">Copiar clave</button>
      <label class="field"><span>Introduce el código de 6 dígitos</span>
        <input type="text" id="sec-confirm" inputmode="numeric" maxlength="6" placeholder="000000" />
      </label>
      <button class="btn btn-primary" id="sec-confirm-btn">Confirmar y activar</button>`;
    $('sec-copy').addEventListener('click', () => {
      navigator.clipboard.writeText(setup.secret).then(() => toast('Clave copiada', 'ok'));
    });
    $('sec-confirm-btn').addEventListener('click', async () => {
      const code = $('sec-confirm').value.trim();
      try {
        await api('/api/auth/2fa/confirm', { method: 'POST', body: JSON.stringify({ code }) });
        toast('2FA activado correctamente', 'ok');
        renderSecurity(true);
      } catch (e) { secError(e.message); }
    });
  } catch (e) { secError(e.message); }
}

/* ── API token (vía directa para la IA) ────────────────────────────── */
$('admin-token-btn').addEventListener('click', async () => {
  try {
    const res = await api('/api/hub/token', { method: 'POST' });
    showToken(res.token);
  } catch (e) { toast(e.message, 'err'); }
});
function showToken(token) {
  const bd = document.createElement('div');
  bd.className = 'modal-backdrop';
  bd.innerHTML = `
    <div class="modal">
      <h2 class="modal-title">Token de API</h2>
      <p class="modal-sub">Esta clave permite a tu IA editar el hub sin tu contraseña. Guárdala en un lugar seguro.</p>
      <div class="secret-box" style="font-size:0.8rem">${esc(token)}</div>
      <div style="display:flex;gap:10px;margin-top:16px">
        <button class="btn btn-primary" id="tok-copy">Copiar</button>
        <button class="btn btn-ghost" id="tok-close">Cerrar</button>
      </div>
    </div>`;
  bd.querySelector('#tok-copy').addEventListener('click', () => {
    navigator.clipboard.writeText(token).then(() => toast('Token copiado', 'ok'));
  });
  bd.querySelector('#tok-close').addEventListener('click', () => bd.remove());
  bd.addEventListener('click', (e) => { if (e.target === bd) bd.remove(); });
  document.body.appendChild(bd);
}

/* ── boot ──────────────────────────────────────────────────────────── */
$('admin-logout-btn').addEventListener('click', logout);

(async function boot() {
  try {
    if (state.token) {
      // validar sesión existente
      try {
        const me = await api('/api/me');
        enterAdmin(me);
        return;
      } catch { state.token = null; localStorage.removeItem('hub_token'); }
    }
    await loadPublic();
  } catch (e) {
    console.error('boot error', e);
    $('sections').innerHTML = '<p style="text-align:center;color:var(--ink-dim);padding:40px">No se pudo cargar el hub.</p>';
  }
})();

/* ═══════════════════════════════════════════════════════════════════
   LA FOGATA — capa viva del hub (radio, clima, visitas, mascota, chat)
   IIFE independiente; no toca la lógica admin existente.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Radio en vivo ─────────────────────────────────────────────── */
  const radio = { stations: [], current: null, audio: null };

  async function loadRadio() {
    try {
      radio.stations = await api('/api/radio/stations');
      renderRadioGrid();
    } catch (e) {
      const g = $('radio-grid');
      if (g) g.innerHTML = '<p class="radio-sub">La radio está apagando el fuego. Vuelve en un momento.</p>';
    }
  }

  function renderRadioGrid() {
    const g = $('radio-grid');
    if (!g) return;
    g.innerHTML = radio.stations.map((s) => `
      <button class="radio-card" data-id="${esc(s.id)}" role="button">
        <span class="radio-card-flag">${esc(s.country)}</span>
        <div class="radio-card-meta">
          <div class="radio-card-name">${esc(s.name)}</div>
          <div class="radio-card-genre">${esc(s.genre)}</div>
        </div>
      </button>`).join('');
    g.querySelectorAll('.radio-card').forEach((btn) => {
      btn.addEventListener('click', () => playStation(btn.getAttribute('data-id')));
    });
  }

  function playStation(id) {
    const st = radio.stations.find((s) => s.id === id);
    if (!st) return;
    if (radio.current === id && radio.audio) {
      if (radio.audio.paused) { radio.audio.play().catch(() => {}); setPlaying(true); }
      else { radio.audio.pause(); setPlaying(false); }
      return;
    }
    if (radio.audio) { try { radio.audio.pause(); radio.audio.src = ''; } catch {} }
    radio.current = id;
    radio.audio = new Audio(API_BASE + '/api/radio/stream/' + encodeURIComponent(id));
    radio.audio.volume = Number($('radio-vol')?.value || 75) / 100;
    radio.audio.crossOrigin = 'anonymous';
    $('radio-flag').textContent = st.country;
    $('radio-name').textContent = st.name;
    $('radio-genre').textContent = 'Sintonizando…';
    radio.audio.addEventListener('canplay', () => {
      if (radio.current === id) { $('radio-genre').textContent = st.genre; setPlaying(true); }
    }, { once: true });
    radio.audio.play().catch(() => {
      setPlaying(false);
      $('radio-genre').textContent = st.genre;
      toast('No se pudo sintonizar esta emisora ahora mismo.', 'err');
    });
    radio.stations.forEach((s) => document.querySelector(`.radio-card[data-id="${s.id}"]`)?.classList.toggle('active', s.id === id));
  }

  function setPlaying(on) {
    $('radio-play')?.classList.toggle('playing', on);
    $('radio-eq')?.classList.toggle('playing', on);
  }

  $('radio-play')?.addEventListener('click', () => {
    if (radio.audio) { playStation(radio.current); }
    else if (radio.stations.length) { playStation(radio.stations[0].id); }
    else { loadRadio().then(() => { if (radio.stations.length) playStation(radio.stations[0].id); }); }
  });
  $('radio-vol')?.addEventListener('input', (e) => {
    if (radio.audio) radio.audio.volume = Number(e.target.value) / 100;
  });

  $('radio-toggle')?.addEventListener('click', () => {
    const widget = $('section-radio');
    if (!widget) return;
    const open = widget.classList.toggle('open');
    $('radio-toggle')?.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* ── Chat "El Diablito" ─────────────────────────────────────────── */
  function addChatMsg(role, text, typing) {
    const body = $('chat-body');
    if (!body) return;
    if (typing) {
      const t = document.createElement('div');
      t.className = 'chat-msg bot typing';
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
      return t;
    }
    const el = document.createElement('div');
    el.className = 'chat-msg ' + role;
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  $('chat-fab')?.addEventListener('click', () => $('chat-panel').classList.toggle('hidden'));
  $('chat-close')?.addEventListener('click', () => $('chat-panel').classList.add('hidden'));
  $('chat-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = $('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    addChatMsg('user', msg);
    const typing = addChatMsg('bot', '', true);
    try {
      const res = await api('/api/hub/assistant', { method: 'POST', body: JSON.stringify({ message: msg }) });
      typing.remove();
      addChatMsg('bot', res.reply || '…');
    } catch (err) {
      typing.remove();
      addChatMsg('bot', err.message || 'Ups, El Diablito se escondió un momento.');
    }
  });

  /* ── Geolocalización + contador de visitas ─────────────────────── */
  async function registerVisit() {
    try {
      const geo = await api('/api/hub/visit', { method: 'POST' });
      const el = $('footer-visitor');
      if (el) {
        if (geo && geo.country) {
          el.innerHTML = `📍 <b>${esc(geo.flag)}</b> ${esc(geo.country)}${geo.city ? ', ' + esc(geo.city) : ''}`;
        } else {
          el.textContent = '📍 visitante local';
        }
      }
      const chip = $('status-visitor-txt');
      if (chip) {
        if (geo && geo.country) {
          chip.innerHTML = `📍 ${esc(geo.flag)} <b>${esc(geo.country)}</b>`;
        } else {
          chip.textContent = '📍 visitante local';
        }
      }
    } catch {}
  }
  async function loadStats() {
    try {
      const s = await api('/api/hub/stats');
      const total = s.visits || 0;
      const countries = s.countries || [];
      const countriesTxt = countries.length ? ` · de <b>${countries.length}</b> país${countries.length === 1 ? '' : 'es'}` : '';
      const el = $('footer-visits');
      if (el) el.innerHTML = `🔥 <b>${total}</b> visita${total === 1 ? '' : 's'}${countriesTxt}`;
      const chip = $('status-visits-txt');
      if (chip) chip.innerHTML = `🔥 <b>${total}</b> visita${total === 1 ? '' : 's'}`;
      const fc = $('footer-countries');
      if (fc && countries.length) {
        fc.innerHTML = countries.slice(0, 8).map((c) =>
          `<span class="country-chip" title="${esc(c.country)} — ${c.count} visita${c.count === 1 ? '' : 's'}"><span class="country-flag">${esc(c.flag)}</span><span class="country-name">${esc(c.country)}</span><span class="country-count">${c.count}</span></span>`
        ).join('');
      }
    } catch {}
  }

  /* ── Clima + día/noche ─────────────────────────────────────────── */
  let weatherType = 'sun';
  const weatherInfo = { temp: null, code: null, label: '', isDay: null };

  function wmoType(code) {
    if (code == null) return null;
    if (code === 0) return 'sun';
    if (code === 1 || code === 2) return 'partly';
    if (code === 3) return 'clouds';
    if (code === 45 || code === 48) return 'fog';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
    if (code >= 95 && code <= 99) return 'storm';
    return 'sun';
  }
  function wmoLabel(code) {
    if (code == null) return '';
    if (code === 0) return 'Despejado';
    if (code === 1 || code === 2) return 'Parcialmente nublado';
    if (code === 3) return 'Nublado';
    if (code === 45 || code === 48) return 'Niebla';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'Lluvia';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'Nieve';
    if (code >= 95 && code <= 99) return 'Tormenta';
    return '';
  }
  function wmoIcon(type) {
    return { sun: '☀️', partly: '⛅', clouds: '☁️', fog: '🌫️', rain: '🌧️', snow: '❄️', storm: '⛈️', night: '🌙' }[type] || '🌤️';
  }

  function applyTheme(isDay) {
    let theme;
    if (isDay == null) {
      const h = new Date().getHours();
      if (h >= 6 && h < 17) theme = 'day';
      else if (h >= 17 && h < 20) theme = 'dusk';
      else theme = 'night';
    } else {
      theme = isDay ? 'day' : 'night';
    }
    document.body.classList.remove('theme-day', 'theme-dusk', 'theme-night');
    document.body.classList.add('theme-' + theme);
    return theme;
  }

  function renderWeather() {
    const ico = $('status-weather-ico');
    const txt = $('status-weather-txt');
    if (!ico || !txt) return;
    ico.textContent = wmoIcon(weatherType);
    if (weatherInfo.temp != null) {
      txt.innerHTML = `${weatherInfo.label ? esc(weatherInfo.label) + ' · ' : ''}<b>${Math.round(weatherInfo.temp)}°</b>`;
    } else {
      txt.textContent = weatherInfo.label || 'Clima local';
    }
  }

  async function initWeather() {
    applyTheme();
    try {
      const w = await api('/api/hub/weather');
      if (w && w.available && w.code != null) {
        weatherType = wmoType(w.code) || weatherType;
        weatherInfo.temp = w.temperature;
        weatherInfo.code = w.code;
        weatherInfo.label = wmoLabel(w.code);
        weatherInfo.isDay = w.is_day;
        applyTheme(w.is_day ? true : false);
      } else {
        const h = new Date().getHours();
        const day = h >= 6 && h < 20;
        weatherType = day ? 'sun' : 'night';
        weatherInfo.label = day ? 'Día local' : 'Noche local';
        weatherInfo.temp = null;
        weatherInfo.isDay = null;
      }
    } catch {
      const h = new Date().getHours();
      const day = h >= 6 && h < 20;
      weatherType = day ? 'sun' : 'night';
      weatherInfo.label = day ? 'Día local' : 'Noche local';
      weatherInfo.temp = null;
    }
    renderWeather();
  }

  /* ── Canvas: brasas + clima (la mascota vive en el hero, en SVG) ── */
  function startCanvas() {
    const canvas = $('fx-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const embers = [];
    const clouds = [];
    const rain = [];
    const snow = [];
    const stars = [];
    const bolts = [];

    for (let i = 0; i < 7; i++) clouds.push({ x: Math.random() * W, y: Math.random() * H * 0.4, r: 60 + Math.random() * 140, s: 0.04 + Math.random() * 0.1, a: 0.05 + Math.random() * 0.1 });
    for (let i = 0; i < 120; i++) stars.push({ x: Math.random() * W, y: Math.random() * H * 0.7, r: 0.5 + Math.random() * 1.4, tw: Math.random() * Math.PI * 2, s: 0.5 + Math.random() * 1.5 });

    // rastro de brasas al mover el mouse (vida)
    let mouseX = -100, mouseY = -100;
    window.addEventListener('mousemove', (e) => {
      if (reduceMotion) return;
      mouseX = e.clientX; mouseY = e.clientY;
      if (embers.length < 55 && Math.random() < 0.4) {
        embers.push({
          x: mouseX + (Math.random() - 0.5) * 8,
          y: mouseY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -(0.15 + Math.random() * 0.5),
          r: 0.7 + Math.random() * 1.8,
          life: 0.55,
          hue: Math.random() < 0.6 ? '255,180,70' : '255,110,25',
        });
      }
    }, { passive: true });

    // chispas al hacer clic en cualquier parte (emoción)
    window.addEventListener('click', (e) => {
      if (reduceMotion) return;
      const n = 14;
      for (let i = 0; i < n; i++) {
        const ang = (i / n) * Math.PI * 2;
        const sp = 1 + Math.random() * 1.8;
        embers.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp - 0.4,
          r: 1 + Math.random() * 2.2,
          life: 0.8,
          hue: Math.random() < 0.5 ? '255,180,70' : '255,110,25',
        });
      }
    });

    function spawnEmber() {
      embers.push({
        x: Math.random() * W,
        y: H + 10,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -(0.35 + Math.random() * 0.95),
        r: 0.8 + Math.random() * 2.4,
        life: 1,
        hue: Math.random() < 0.6 ? '255,180,70' : '255,110,25',
      });
    }

    function drawEmbers() {
      for (let i = embers.length - 1; i >= 0; i--) {
        const p = embers[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.006;
        if (p.life <= 0 || p.y < -10) { embers.splice(i, 1); continue; }
        const a = p.life * 0.7;
        ctx.fillStyle = `rgba(${p.hue},${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${p.hue},${(a * 0.4).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life * 2.4, 0, Math.PI * 2); ctx.fill();
      }
    }

    function spawnWeather(n) {
      if (weatherType === 'rain' || weatherType === 'storm') {
        for (let i = 0; i < n; i++) rain.push({ x: Math.random() * W, y: Math.random() * H - 20, len: 12 + Math.random() * 16, sp: 7 + Math.random() * 8, drift: -1 + Math.random() * 2 });
        if (rain.length > 220) rain.splice(0, rain.length - 220);
      } else if (weatherType === 'snow') {
        for (let i = 0; i < n; i++) snow.push({ x: Math.random() * W, y: Math.random() * H - 10, r: 1 + Math.random() * 2.5, sp: 0.6 + Math.random() * 1.4, drift: -0.4 + Math.random() * 0.8, a: 0.5 + Math.random() * 0.5 });
        if (snow.length > 220) snow.splice(0, snow.length - 220);
      }
    }

    function spawnBolt() {
      let x = Math.random() * W;
      const pts = [[x, 0]];
      let y = 0;
      while (y < H * 0.9) {
        y += 30 + Math.random() * 50;
        x += (Math.random() - 0.5) * 90;
        pts.push([x, y]);
      }
      bolts.push({ pts, t: performance.now(), life: 320 });
    }

    function drawBolts() {
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        const age = performance.now() - b.t;
        if (age > b.life) { bolts.splice(i, 1); continue; }
        const a = 1 - age / b.life;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.shadowColor = '#cfe4ff';
        ctx.shadowBlur = 18;
        ctx.strokeStyle = '#eaf4ff';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(b.pts[0][0], b.pts[0][1]);
        for (let k = 1; k < b.pts.length; k++) ctx.lineTo(b.pts[k][0], b.pts[k][1]);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        ctx.restore();
      }
    }

    function drawWeather(t) {
      ctx.save();
      if (weatherType === 'rain' || weatherType === 'storm') {
        ctx.strokeStyle = 'rgba(180,205,240,0.28)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const d of rain) {
          ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.drift, d.y + d.len);
          d.y += d.sp; d.x += d.drift;
          if (d.y > H + 20) { d.y = -20; d.x = Math.random() * W; }
        }
        ctx.stroke();
      } else if (weatherType === 'snow') {
        for (const s of snow) {
          ctx.fillStyle = `rgba(255,255,255,${s.a.toFixed(2)})`;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
          s.y += s.sp; s.x += s.drift + Math.sin(t * 0.001 + s.x) * 0.3;
          if (s.y > H + 10) { s.y = -10; s.x = Math.random() * W; }
        }
      }
      if (weatherType === 'clouds' || weatherType === 'fog' || weatherType === 'storm' || weatherType === 'partly') {
        for (const c of clouds) {
          const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
          g.addColorStop(0, `rgba(160,175,200,${c.a})`);
          g.addColorStop(1, 'rgba(160,175,200,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
          c.x += c.s;
          if (c.x - c.r > W) { c.x = -c.r; c.y = Math.random() * H * 0.4; }
        }
      }
      if (document.body.classList.contains('theme-night')) {
        for (const st of stars) {
          const tw = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.001 * st.s + st.tw));
          ctx.fillStyle = `rgba(220,228,255,${tw.toFixed(2)})`;
          ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();
    }

    let lastFrame = 0;
    function tick(t) {
      requestAnimationFrame(tick);

      // Throttle a ~30fps: el ambiente no necesita 60fps y así consume la mitad de CPU/batería.
      if (t - lastFrame < 33) return;
      lastFrame = t;

      // No dibujar si la pestaña está oculta (rAF ya se pausa solo, pero es explícito).
      if (document.hidden) return;

      ctx.clearRect(0, 0, W, H);

      if (!reduceMotion && embers.length < 42 && Math.random() < 0.35) spawnEmber();
      spawnWeather(1);

      drawWeather(t);
      drawBolts();
      if (!reduceMotion) drawEmbers();

      if (weatherType === 'storm' && Math.random() < 0.006) {
        const fl = $('thunder-flash');
        if (fl) { fl.classList.remove('flash'); void fl.offsetWidth; fl.classList.add('flash'); }
        spawnBolt();
      }
    }

    requestAnimationFrame(tick);
  }

  /* ── La mascota errante: máquina de estados ──────────────────────
     Estados: idle · walk · run · jump · mischief · react · sleep.
     Ajustes en CFG: speed (velocidad), timing (frecuencias), personality (travesura/curiosidad/charla). */
  function initWanderer() {
    const root = $('wanderer');
    if (!root) return;
    const say = $('wanderer-say');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const CFG = {
      speed: { walk: 1.7, run: 5.4, arrive: 0.045 },
      timing: { idle: [3200,7200], walk: [3500,8500], sleepAfter: 28000,
        jumpEvery: [9000,18000], mischiefEvery: [20000,38000], sayEvery: [12000,26000] },
      personality: { mischievousness: 0.7, curiosity: 0.6, chatter: 0.55 },
    };
    const PHRASES = ['Hola, necio.','Esta guarida es mía.','¿Qué miras tú?','¡Ja!','Pssst… por aquí.','Cuida tus enlaces.','¿Viste eso?','Quédate un rato.','El fuego nunca duerme.','Yo tampoco.','Tus secretos, a salvo.'];
    const STATES = { IDLE:'idle', WALK:'walk', RUN:'run', JUMP:'jump', MISCHIEF:'mischief', REACT:'react', SLEEP:'sleep' };

    let state = null, px = -140, py = -140, dir = 1, target = null, appear = false;
    let lastInteract = Date.now(), runCooldown = 0, sayTimer = null;
    const rand = (a,b) => a + Math.random()*(b-a);
    const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];

    function setState(next) {
      if (next === state) return;
      if (state === STATES.SLEEP && next !== STATES.REACT) return;
      state = next;
      root.className = 'wanderer' + (appear ? ' on' : '') + ' is-' + state;
      if (state === STATES.IDLE) scheduleWalk();
    }
    function sayPhrase(text, dur) {
      if (Math.random() > CFG.personality.chatter) return;
      say.textContent = text; say.classList.add('show');
      clearTimeout(sayTimer); sayTimer = setTimeout(() => say.classList.remove('show'), dur || 2200);
    }
    function isSafe(x, y) {
      const avoid = document.querySelectorAll('.masthead,.radio-widget,.chat-fab,.chat-panel,.footer,.admin-bar,.modal-backdrop');
      for (const el of avoid) { const r = el.getBoundingClientRect(); if (!r.width) continue;
        if (x > r.left-24 && x < r.right+24 && y > r.top-24 && y < r.bottom+24) return false; }
      const el = document.elementFromPoint(x, y);
      if (el && el.closest('a,button,input,select,textarea,[role="button"]')) return false;
      return true;
    }
    function safePoint() {
      const W = window.innerWidth, H = window.innerHeight, pad = 70;
      for (let i=0;i<40;i++){ const x = pad+Math.random()*(W-pad*2), y = 150+Math.random()*(H-150-pad);
        if (isSafe(x,y)) return {x,y}; }
      return { x: W*0.5, y: H*0.55 };
    }
    function face(x) { dir = x < px ? -1 : 1; }
    function sparkBurst() {
      const r = root.getBoundingClientRect(); const cx = r.left+r.width/2, cy = r.top+r.height/2;
      for (let i=0;i<12;i++){ const s = document.createElement('span'); s.className='spark';
        const ang = Math.random()*Math.PI*2, dist = 28+Math.random()*46;
        s.style.left=cx+'px'; s.style.top=cy+'px';
        s.style.setProperty('--dx',(Math.cos(ang)*dist).toFixed(1)+'px');
        s.style.setProperty('--dy',(Math.sin(ang)*dist).toFixed(1)+'px');
        document.body.appendChild(s); setTimeout(()=>s.remove(),720); }
    }
    function shakeACard() {
      const cards = Array.from(document.querySelectorAll('.card:not(.is-private)'));
      if (!cards.length) return null;
      const visible = cards.filter(c=>{const r=c.getBoundingClientRect();return r.top>0&&r.bottom<window.innerHeight;});
      const c = pick(visible.length?visible:cards);
      c.classList.add('pranked'); setTimeout(()=>c.classList.remove('pranked'),520); return c;
    }
    function doMischief() {
      if (state===STATES.SLEEP || Math.random()>CFG.personality.mischievousness) return;
      setState(STATES.MISCHIEF);
      const c = shakeACard();
      if (c){ const r=c.getBoundingClientRect(); target={x:r.left-90,y:r.top+r.height/2}; face(target.x); }
      sparkBurst(); sayPhrase(pick(['¡Ja!','¿Viste eso?','Travieso, yo.']));
      setTimeout(()=>{ if(state===STATES.MISCHIEF) setState(STATES.IDLE); },2200);
    }
    function doJump() { if (state===STATES.SLEEP) return; setState(STATES.JUMP);
      setTimeout(()=>{ if(state===STATES.JUMP) setState(STATES.IDLE); },850); }
    function doWalk(speedState) { if (state===STATES.SLEEP) return;
      target = safePoint(); face(target.x); setState(speedState || STATES.WALK); }
    function scheduleWalk() { setTimeout(()=>{ if(state===STATES.IDLE) doWalk(); }, rand(CFG.timing.idle[0],CFG.timing.idle[1])); }
    function wake() { lastInteract = Date.now();
      if (state===STATES.SLEEP){ setState(STATES.REACT); setTimeout(()=>{ if(state===STATES.REACT) setState(STATES.IDLE); },1400); } }
    function every(msRange, fn) {
      const loop = () => { if (appear) fn(); setTimeout(loop, rand(msRange[0],msRange[1])); };
      setTimeout(loop, rand(msRange[0],msRange[1]));
    }
    function tick() {
      if (appear && target && (state===STATES.WALK||state===STATES.RUN||state===STATES.MISCHIEF)) {
        const sp = state===STATES.RUN ? CFG.speed.run : CFG.speed.walk;
        const k = CFG.speed.arrive * (sp/CFG.speed.walk);
        px += (target.x-px)*k; py += (target.y-py)*k; face(target.x);
        if (Math.hypot(target.x-px,target.y-py) < 6){ target=null;
          if (state===STATES.WALK||state===STATES.RUN) setState(STATES.IDLE); }
      }
      if (appear) {
        root.style.transform = 'translate3d('+px.toFixed(1)+'px,'+py.toFixed(1)+'px,0) scaleX('+dir+')';
        say.style.transform = 'translateX(-50%) scaleX(' + dir + ')';
      }
      if (appear && state!==STATES.SLEEP && Date.now()-lastInteract > CFG.timing.sleepAfter){ setState(STATES.SLEEP); sayPhrase('Zzz…',3200); }
      requestAnimationFrame(tick);
    }
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (!appear && y > window.innerHeight*0.5){ appear=true; const sp=safePoint(); px=sp.x; py=sp.y; target=null;
        root.classList.add('on'); setState(STATES.IDLE); }
      wake();
      if (appear && state!==STATES.SLEEP && Date.now()>runCooldown && Math.abs(y-lastY)>2){ doWalk(STATES.RUN); runCooldown=Date.now()+900; }
      lastY = y;
    }, { passive:true });
    window.addEventListener('mousemove', (e) => {
      if (!appear || state===STATES.SLEEP) return; wake();
      if (Math.random() < CFG.personality.curiosity*0.25) face(e.clientX);
    }, { passive:true });
    window.addEventListener('click', (e) => {
      if (!appear || state===STATES.SLEEP) return; wake();
      const r = root.getBoundingClientRect(); const cx=r.left+r.width/2, cy=r.top+r.height/2;
      if (Math.hypot(e.clientX-cx,e.clientY-cy) < 180){ setState(STATES.REACT); sparkBurst();
        sayPhrase(pick(['¡Ey!','¡Cuidado!','¡Ja, ja!']));
        setTimeout(()=>{ if(state===STATES.REACT) setState(STATES.IDLE); },1200); }
    });
    every(CFG.timing.mischiefEvery, doMischief);
    every(CFG.timing.jumpEvery, doJump);
    every(CFG.timing.sayEvery, () => sayPhrase(pick(PHRASES)));
    requestAnimationFrame(tick);
  }

  /* ── Compartir (Web Share API) ────────────────────────────────── */
  $('share-btn')?.addEventListener('click', async () => {
    const url = window.location.href;
    const title = document.title || 'El Necio Digital — La Guarida';
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else if (navigator.clipboard) {
      try { await navigator.clipboard.writeText(url); toast('Enlace copiado al portapapeles', 'ok'); } catch {}
    }
  });

  /* ── Easter egg: escribe "necio" en el buscador ───────────────── */
  function necioEgg() {
    for (let i = 0; i < 45; i++) {
      const s = document.createElement('span');
      s.className = 'rain-spark';
      s.style.left = (Math.random() * 100) + 'vw';
      s.style.animationDelay = (Math.random() * 1.2) + 's';
      s.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 3500);
    }
    toast('🔥 ¡Necio! Encontraste el rincón secreto de la guarida. El fuego nunca duerme.', 'ok');
  }

  /* ── Buscador de obras ────────────────────────────────────────── */
  $('search-input')?.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (q === 'necio') necioEgg();
    document.querySelectorAll('.card').forEach((card) => {
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
      const match = !q || title.includes(q) || desc.includes(q);
      card.style.display = match ? '' : 'none';
    });
    document.querySelectorAll('.section').forEach((sec) => {
      const anyVisible = [...sec.querySelectorAll('.card')].some((c) => c.style.display !== 'none');
      sec.style.display = anyVisible ? '' : 'none';
    });
  });

  /* ── Reloj en vivo ────────────────────────────────────────────── */
  function updateClock() {
    const el = $('status-clock-txt');
    if (!el) return;
    const now = new Date();
    const date = now.toLocaleDateString('es-DO', { day: '2-digit', month: 'short' });
    const time = now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', hour12: false });
    el.textContent = `${date} · ${time}`;
  }
  updateClock();
  setInterval(updateClock, 10000);

  /* ── Formulario de contacto ───────────────────────────────────── */
  $('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('contact-name').value.trim();
    const email = $('contact-email').value.trim();
    const message = $('contact-message').value.trim();
    if (!name || !email || !message) return;
    const subject = encodeURIComponent(`Mensaje de ${name} — La Guarida`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:thenecioia@gmail.com?subject=${subject}&body=${body}`;
    toast('Abriendo tu correo para enviar el mensaje…', 'ok');
  });

  /* ── Feed de YouTube (últimos videos) ──────────────────────────── */
  async function loadVideos() {
    const grid = $('videos-grid');
    if (!grid) return;
    try {
      const vids = await api('/api/hub/youtube');
      if (!vids || !vids.length) {
        grid.innerHTML = '<div class="card-desc" style="grid-column:1/-1">Aún no hay videos recientes.</div>';
        return;
      }
      grid.innerHTML = vids.map((v) => `
        <a class="video-card" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">
          <span class="video-thumb"><img src="${esc(v.thumb)}" alt="" loading="lazy" /></span>
          <span class="video-meta">
            <span class="video-title">${esc(v.title)}</span>
            <span class="video-channel">${esc(v.channel)}</span>
          </span>
        </a>`).join('');
    } catch (e) {
      grid.innerHTML = '<div class="card-desc" style="grid-column:1/-1">No se pudieron cargar los videos.</div>';
    }
  }

  /* ── boot de la capa viva ──────────────────────────────────────── */
  async function bootLiving() {
    loadRadio();
    registerVisit();
    loadStats();
    loadVideos();
    initWeather().then(startCanvas);
    initWanderer();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootLiving);
  else bootLiving();
})();
