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
async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) headers['Authorization'] = 'Bearer ' + state.token;
  const res = await fetch(path, { ...opts, headers: { ...headers, ...(opts.headers || {}) } });
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
    <span class="card-icon" style="color:${esc(color)}">${esc(it.icon || '🔗')}</span>
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
const STATIC_DATA = {
  profile: {
    name: 'El Necio Digital',
    tagline: 'Historias, música y código — todo lo de Denison Peguero',
    bio: 'Denison Peguero (The Necio). Creador de contenido, músico (NEON HEART) y maker dominicano. 50+ proyectos en GitHub, 12 certificados ProDominicana, música en Spotify y YouTube.',
    emoji: '⚡',
    accent: '#ff4d00'
  },
  items: [
    { id: 1, section: 'webs', title: 'GitHub', url: 'https://github.com/thenecioia-png', icon: '🐙', color: '#24292f', description: '50+ proyectos, apps y herramientas' },
    { id: 2, section: 'canales', title: 'El Narrador de Historias', url: 'https://www.youtube.com/channel/UC73SZabl1rJdAX8ZqkcECbA', icon: '📺', color: '#ff0000', description: 'Documentales e historias de República Dominicana' },
    { id: 3, section: 'canales', title: 'The Necio — Música', url: 'https://www.youtube.com/channel/UCj_Jyy61gv69kD7Oa3VWcSA', icon: '🎵', color: '#ff4d00', description: 'NEON HEART y todas mis canciones' },
    { id: 4, section: 'redes', title: 'Email', url: 'mailto:thenecioia@gmail.com', icon: '✉️', color: '#1a73e8', description: 'Escríbeme directo' },
    { id: 5, section: 'apps', title: 'Conversor Universal', url: 'https://github.com/thenecioia-png/conversor-universal', icon: '🔄', color: '#00c853', description: 'Conversor de unidades y medidas' },
    { id: 6, section: 'apps', title: 'Generador de Contraseñas', url: 'https://github.com/thenecioia-png/generador-passwords', icon: '🔐', color: '#ff6d00', description: 'Contraseñas seguras al instante' },
    { id: 7, section: 'apps', title: 'Memoria — Juego', url: 'https://github.com/thenecioia-png/memoria-juego', icon: '🧠', color: '#aa00ff', description: 'Juego clásico de memoria' },
    { id: 8, section: 'apps', title: 'Snake Clásico', url: 'https://github.com/thenecioia-png/snake-clasico', icon: '🐍', color: '#76ff03', description: 'El juego de la serpiente' },
    { id: 9, section: 'contenido', title: 'NEON HEART Vol.1', url: 'https://www.youtube.com/channel/UCj_Jyy61gv69kD7Oa3VWcSA', icon: '💿', color: '#ff4081', description: 'Álbum de 10 canciones — ya en Spotify y YouTube' },
    { id: 10, section: 'contenido', title: 'Libros — Amazon KDP', url: '', icon: '📚', color: '#e91e63', description: 'Mis libros (próximamente en Amazon)' }
  ]
};

/* ── Almacén local (sin backend) ──────────────────────────────────── */
const LS_ITEMS = 'necio_hub_items';
const LS_PROFILE = 'necio_hub_profile';
const ADMIN_EMAIL = 'admin@theneciodigital.com';
const ADMIN_PASS_HASH = '5a55c7873ed7338f35d782adb513d336a36086ddec0fa4b6444fda6d440387c2';
const ADMIN_TOKEN = 'necio-local-admin';

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
function loadItems() {
  try {
    const raw = localStorage.getItem(LS_ITEMS);
    if (raw) { const d = JSON.parse(raw); if (Array.isArray(d)) return d; }
  } catch {}
  return STATIC_DATA.items.map((x) => ({ ...x }));
}
function saveItems(items) { localStorage.setItem(LS_ITEMS, JSON.stringify(items)); }
function loadProfile() {
  try {
    const raw = localStorage.getItem(LS_PROFILE);
    if (raw) { const p = JSON.parse(raw); if (p && typeof p === 'object') return p; }
  } catch {}
  return { ...STATIC_DATA.profile };
}
function saveProfile(p) { localStorage.setItem(LS_PROFILE, JSON.stringify(p)); }

function loadPublic() {
  state.profile = loadProfile();
  state.items = loadItems();
  renderHero();
  renderSections();
  renderNavLinks();
}
function loadAdmin() {
  state.items = loadItems();
  renderSections();
}

/* ── admin session ─────────────────────────────────────────────────── */
function enterAdmin(user) {
  state.user = user;
  $('admin-toggle').classList.add('is-admin');
  $('admin-label').textContent = user.name || 'Admin';
  $('admin-bar').classList.remove('hidden');
  loadAdmin();
}
function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('hub_token');
  $('admin-toggle').classList.remove('is-admin');
  $('admin-label').textContent = 'Admin';
  $('admin-bar').classList.add('hidden');
  loadPublic();
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
  const email = $('login-email').value.trim().toLowerCase();
  const password = $('login-password').value;
  try {
    const passHash = await sha256(password);
    if (email === ADMIN_EMAIL && passHash === ADMIN_PASS_HASH) {
      state.token = ADMIN_TOKEN;
      localStorage.setItem('hub_token', ADMIN_TOKEN);
      closeModal('login-modal');
      resetLogin();
      enterAdmin({ name: 'El Necio', email: ADMIN_EMAIL });
      toast('Bienvenido, El Necio');
    } else {
      err.textContent = 'Email o contraseña incorrectos.';
      err.classList.remove('hidden');
    }
  } catch (er) {
    err.textContent = 'No se pudo verificar. Inténtalo de nuevo.';
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
$('item-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const err = $('item-error');
  err.classList.add('hidden');
  const id = $('item-id').value;
  const title = $('item-title').value.trim();
  if (!title) {
    err.textContent = 'El título es obligatorio.';
    err.classList.remove('hidden');
    return;
  }
  const body = {
    section: $('item-section').value,
    title,
    url: $('item-url').value.trim(),
    description: $('item-description').value.trim(),
    icon: $('item-icon').value.trim() || '🔗',
    color: $('item-color').value,
    visibility: $('item-visibility').checked ? 'public' : 'private',
  };
  const items = loadItems();
  if (id) {
    const it = items.find((x) => String(x.id) === String(id));
    if (it) Object.assign(it, body);
  } else {
    const nextId = items.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;
    items.push({ id: nextId, ...body });
  }
  saveItems(items);
  state.items = items;
  closeModal('item-modal');
  loadAdmin();
  toast(id ? 'Elemento actualizado' : 'Elemento agregado', 'ok');
});

function deleteItem(id) {
  if (!confirm('¿Eliminar este elemento?')) return;
  const items = loadItems().filter((x) => String(x.id) !== String(id));
  saveItems(items);
  state.items = items;
  loadAdmin();
  toast('Elemento eliminado');
}
function toggleItem(id) {
  const items = loadItems();
  const it = items.find((x) => String(x.id) === String(id));
  if (!it) return;
  const wasPublic = it.visibility === 'public';
  it.visibility = wasPublic ? 'private' : 'public';
  saveItems(items);
  state.items = items;
  loadAdmin();
  toast(wasPublic ? 'Ahora es privado' : 'Ahora es público', 'ok');
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
$('profile-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const err = $('profile-error');
  err.classList.add('hidden');
  const name = $('profile-name').value.trim();
  if (!name) {
    err.textContent = 'El nombre es obligatorio.';
    err.classList.remove('hidden');
    return;
  }
  const body = {
    name,
    emoji: $('profile-emoji').value.trim() || '⚡',
    tagline: $('profile-tagline').value.trim(),
    bio: $('profile-bio').value.trim(),
    accent: $('profile-accent').value,
  };
  saveProfile({ ...loadProfile(), ...body });
  closeModal('profile-modal');
  state.profile = { ...state.profile, ...body };
  renderHero();
  toast('Perfil actualizado', 'ok');
});

/* ── security (2FA) ────────────────────────────────────────────────── */
$('admin-security-btn')?.addEventListener('click', openSecurity);
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
$('admin-token-btn')?.addEventListener('click', async () => {
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
    if (state.token === ADMIN_TOKEN) {
      enterAdmin({ name: 'El Necio', email: ADMIN_EMAIL });
      return;
    }
    loadPublic();
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

  /* ── Radio en vivo ───────────────────────────────────────────────
     Emisoras reales con stream directo (sin backend). Todas HTTPS. */
  const RADIO_STATIONS = [
    { id: 'z101',    name: 'La Z101',            genre: 'Merengue · Salsa · Noticias', country: '🇩🇴', stream: 'https://streaming.z101digital.com/z101' },
    { id: 'lax',     name: 'La X 102.1',         genre: 'Éxitos y variedad',          country: '🇩🇴', stream: 'https://audio.livecastnet.com:2535/stream' },
    { id: 'fuego',   name: 'Fuego 90.1',         genre: 'Merengue',                   country: '🇩🇴', stream: 'https://radiordomi.com/8390/stream' },
    { id: 'urbano',  name: 'Top Urbano',         genre: 'Urbano · Reggaetón',         country: '🇩🇴', stream: 'https://radio.dominiserver.com/proxy/topurbano?mp=/stream' },
    { id: 'salsa',   name: 'Salsa 92.7',         genre: 'Salsa',                      country: '🇩🇴', stream: 'https://stream.zeno.fm/h7lnwv51bh5uv' },
    { id: 'bachata', name: 'Bachata Hits',       genre: 'Bachata',                    country: '🇩🇴', stream: 'https://stream.zeno.fm/prbf8rrgvzzuv' },
    { id: 'ritmo',   name: 'Ritmo 96.5',         genre: 'Merengue clásico',           country: '🇩🇴', stream: 'https://stream-49.zeno.fm/y0br5ck4ququv' },
    { id: 'fiera',   name: 'FieraMix',           genre: 'Bachata · Merengue',         country: '🇩🇴', stream: 'https://c11.radioboss.fm:18269/stream' },
    { id: 'disco',   name: 'Disco 88.9',         genre: 'Disco · Clásicos',           country: '🇩🇴', stream: 'https://rgradio.net/disco89/disco89.mp3' },
    { id: 'cdn',     name: 'CDN Radio',          genre: 'Noticias y análisis',        country: '🇩🇴', stream: 'https://play.cdnradio.com.do/cdnlive' },
    { id: 'nueva',   name: 'La Nueva 106.9',     genre: 'Variedad musical',           country: '🇩🇴', stream: 'https://lanueva106.radioca.st/stream/1/' },
    { id: 'rp',      name: 'Radio Paradise',     genre: 'Eclectic · Indie',           country: '🌍', stream: 'https://stream.radioparadise.com/mp3-192' },
    { id: 'groove',  name: 'SomaFM Groove Salad', genre: 'Ambient · Chill',           country: '🌍', stream: 'https://ice1.somafm.com/groovesalad-128-mp3' },
    { id: 'agent',   name: 'SomaFM Secret Agent', genre: 'Lounge · Downtempo',        country: '🌍', stream: 'https://ice1.somafm.com/secretagent-128-mp3' },
  ];
  const radio = { stations: RADIO_STATIONS, current: null, audio: null };

  function loadRadio() {
    renderRadioGrid();
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
    radio.audio = new Audio(st.stream);
    radio.audio.volume = Number($('radio-vol')?.value || 75) / 100;
    radio.audio.crossOrigin = 'anonymous';
    radio.audio.play().then(() => setPlaying(true)).catch(() => {
      setPlaying(false);
      toast('No se pudo sintonizar esta emisora ahora mismo.', 'err');
    });
    $('radio-flag').textContent = st.country;
    $('radio-name').textContent = st.name;
    $('radio-genre').textContent = st.genre;
    radio.stations.forEach((s) => document.querySelector(`.radio-card[data-id="${s.id}"]`)?.classList.toggle('active', s.id === id));
  }

  function setPlaying(on) {
    $('radio-play')?.classList.toggle('playing', on);
    $('radio-eq')?.classList.toggle('playing', on);
  }

  $('radio-play')?.addEventListener('click', () => {
    if (radio.audio) { playStation(radio.current); }
    else if (radio.stations.length) { playStation(radio.stations[0].id); }
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

  /* ── Geolocalización (IP) + contador de visitas local ──────────── */
  async function fetchGeo() {
    try {
      const r = await fetch('https://ipwho.is/');
      const g = await r.json();
      if (g && g.success !== false && g.country) {
        return {
          country: g.country,
          city: g.city || '',
          flag: (g.flag && g.flag.emoji) || '',
          lat: g.latitude,
          lon: g.longitude,
        };
      }
    } catch {}
    return null;
  }

  async function registerVisit() {
    const geo = await fetchGeo();
    const el = $('footer-visitor');
    const chip = $('status-visitor-txt');
    if (geo) {
      const flag = geo.flag ? `<b>${esc(geo.flag)}</b> ` : '';
      const where = `${esc(geo.country)}${geo.city ? ', ' + esc(geo.city) : ''}`;
      if (el) el.innerHTML = `📍 ${flag}${where}`;
      if (chip) chip.innerHTML = `📍 ${flag}<b>${esc(geo.country)}</b>`;
    } else {
      if (el) el.textContent = '📍 visitante local';
      if (chip) chip.textContent = '📍 visitante local';
    }
  }

  function loadStats() {
    // Contador local de este navegador (sin backend, honesto).
    const n = Number(localStorage.getItem('necio_visits') || 0) + 1;
    localStorage.setItem('necio_visits', String(n));
    const txt = `🔥 <b>${n}</b> visita${n === 1 ? '' : 's'}`;
    const el = $('footer-visits');
    if (el) el.innerHTML = txt;
    const chip = $('status-visits-txt');
    if (chip) chip.innerHTML = txt;
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

  function localWeatherFallback() {
    const h = new Date().getHours();
    const day = h >= 6 && h < 20;
    weatherType = day ? 'sun' : 'night';
    weatherInfo.label = day ? 'Día local' : 'Noche local';
    weatherInfo.temp = null;
    weatherInfo.isDay = null;
  }

  async function initWeather() {
    applyTheme();
    try {
      const geo = await fetchGeo();
      if (geo && geo.lat != null && geo.lon != null) {
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}&current_weather=true`);
        const w = await r.json();
        const cw = w && w.current_weather;
        if (cw && cw.weathercode != null) {
          weatherType = wmoType(cw.weathercode) || weatherType;
          weatherInfo.temp = cw.temperature;
          weatherInfo.code = cw.weathercode;
          weatherInfo.label = wmoLabel(cw.weathercode);
          weatherInfo.isDay = cw.is_day === 1;
          applyTheme(cw.is_day === 1);
        } else {
          localWeatherFallback();
        }
      } else {
        localWeatherFallback();
      }
    } catch {
      localWeatherFallback();
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

    function tick(t) {
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

      requestAnimationFrame(tick);
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
      if (appear) root.style.transform = 'translate3d('+px.toFixed(1)+'px,'+py.toFixed(1)+'px,0) scaleX('+dir+')';
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

  /* ── boot de la capa viva ──────────────────────────────────────── */
  async function bootLiving() {
    loadRadio();
    registerVisit();
    loadStats();
    initWeather().then(startCanvas);
    initWanderer();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootLiving);
  else bootLiving();
})();
