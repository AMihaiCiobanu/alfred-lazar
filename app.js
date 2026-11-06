// Alfred Lazar — draft client page built from the YourBusinessName demo (massage).
//
// Services and hours below are EXAMPLE content until Alfred creates his public booking link in the
// Appointments & Reports app. Then set BOOKING_LINK_ID and port the live-data block from
// NailsByClemi/app.js (services, hours, open-now badge, booking dialog), and remove the examples.

const BOOKING_LINK_ID = ''; // e.g. '269a0a1f-…'; empty = booking buttons are not live yet
const BOOKING_URL = BOOKING_LINK_ID ? `https://appointmentsapps.com/booking?id=${BOOKING_LINK_ID}` : '';

// Monday first.
const DAYS = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];

// Example only: replaced by the booking link's hours.
const HOURS = [[600, 1200], [600, 1200], [600, 1200], [600, 1200], [600, 1200], [600, 840], null];

// Example only: no prices until the real list comes from the app.
const SERVICES = [
  { name: 'Masaj de relaxare', min: 60, desc: 'Ritm lent, pentru tensiunea adunată în corp.' },
  { name: 'Terapie HVLA', min: 45, desc: 'Ședință de terapie manuală HVLA.' },
  { name: 'Masaj și echilibru', min: 90, desc: 'Masaj urmat de un moment de liniște și respirație.' }
];


function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

function formatTime(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function renderServices() {
  const container = document.getElementById('services-list');
  container.replaceChildren();
  for (const svc of SERVICES) {
    const card = el('div', 'service');
    const top = el('div', 'service-top');
    top.appendChild(el('span', 'service-name', svc.name));
    card.appendChild(top);
    card.appendChild(el('span', 'service-meta', formatDuration(svc.min)));
    card.appendChild(el('p', 'service-desc', svc.desc));
    card.appendChild(el('span', 'example-tag', 'Exemplu'));
    container.appendChild(card);
  }
}

function renderHours() {
  const tbody = document.querySelector('#hours-table tbody');
  tbody.replaceChildren();
  const now = new Date();
  const todayIndex = (now.getDay() + 6) % 7;
  DAYS.forEach((label, i) => {
    const range = HOURS[i];
    const row = el('tr');
    if (i === todayIndex) row.classList.add('today');
    if (!range) row.classList.add('closed');
    row.appendChild(el('td', null, label));
    row.appendChild(el('td', null, range ? `${formatTime(range[0])} – ${formatTime(range[1])}` : 'Închis'));
    tbody.appendChild(row);
  });
}


// ---------- booking buttons ----------

let toastTimer;
function toast(message) {
  let node = document.getElementById('toast');
  if (!node) {
    node = el('div', 'toast');
    node.id = 'toast';
    node.setAttribute('role', 'status');
    node.style.cssText = 'position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:50;max-width:min(92vw,28rem);padding:12px 18px;border-radius:14px;background:var(--text);color:var(--bg);box-shadow:var(--shadow);font-weight:600;text-align:center';
    document.body.appendChild(node);
  }
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { node.hidden = true; }, 3500);
}

function setupBooking() {
  for (const btn of document.querySelectorAll('.book-btn')) {
    btn.addEventListener('click', () => {
      if (BOOKING_URL) window.open(BOOKING_URL, '_blank', 'noopener');
      else toast('Programarea online va fi disponibilă în curând.');
    });
  }
}

// ---------- theme ----------

function syncThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || meta.content;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  syncThemeColor();
}

function setupThemeToggle() {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch { /* this visit only */ }
  });
  media.addEventListener('change', e => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch { /* ignore */ }
    if (!saved) applyTheme(e.matches ? 'dark' : 'light');
  });
}

setupThemeToggle();
document.getElementById('year').textContent = String(new Date().getFullYear());
renderServices();
renderHours();
setupBooking();
