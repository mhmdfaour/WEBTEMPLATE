/* EDIT THESE DETAILS for each business. No API keys or passwords belong here. */
const BUSINESS = {
  email: 'hello@example.com',
  phone: '+27000000000',
  phoneLabel: '+27 (0)00 000 0000',
  whatsapp: '27000000000', // Country code + number, digits only; omit leading local zero.
  address: 'Your business address, South Africa',
  mapDestination: 'South Africa', // Replace with a full address or Google Maps place ID.
  whatsappMessage: 'Hello! I would like to enquire about your collection.',
  formEndpoint: '' // Optional HTTPS form-service endpoint. Must support JSON POST and CORS.
};

document.documentElement.classList.add('js');
document.querySelectorAll('[data-email]').forEach(a => { a.textContent = `${BUSINESS.email} ↗`; a.href = `mailto:${BUSINESS.email}`; });
document.querySelectorAll('[data-phone]').forEach(a => { a.textContent = BUSINESS.phoneLabel; a.href = `tel:${BUSINESS.phone}`; });
document.querySelectorAll('[data-address]').forEach(el => { el.textContent = BUSINESS.address; });
document.querySelectorAll('[data-directions]').forEach(a => { a.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(BUSINESS.mapDestination)}`; });
document.querySelectorAll('[data-whatsapp]').forEach(a => { a.href = `https://wa.me/${BUSINESS.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(BUSINESS.whatsappMessage)}`; });
document.querySelector('#year').textContent = new Date().getFullYear();

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open); });
navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menu.focus(); } });

if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveals.unobserve(entry.target); } }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => reveals.observe(el));
} else document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));

const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const layers = [...document.querySelectorAll('[data-parallax]')];
let framePending = false;
function paintParallax() {
  layers.forEach(layer => { const box = layer.parentElement.getBoundingClientRect(); if (motion.matches) { layer.style.transform = ''; return; } if (box.bottom > 0 && box.top < innerHeight) { const offset = (innerHeight / 2 - box.top - box.height / 2) * Number(layer.dataset.parallax); layer.style.transform = `translate3d(0, ${Math.max(-65, Math.min(65, offset))}px, 0)`; } });
  framePending = false;
}
function scheduleParallax() { if (!framePending) { framePending = true; requestAnimationFrame(paintParallax); } }
window.addEventListener('scroll', scheduleParallax, { passive: true });
window.addEventListener('resize', scheduleParallax);
motion.addEventListener('change', scheduleParallax);
scheduleParallax();

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(other => { const active = other === button; other.classList.toggle('selected', active); other.setAttribute('aria-pressed', String(active)); });
  let count = 0;
  document.querySelectorAll('.product').forEach(product => { product.hidden = button.dataset.filter !== 'all' && product.dataset.category !== button.dataset.filter; if (!product.hidden) { count++; product.classList.add('visible'); } });
  document.querySelector('.collection-count').textContent = `${count} considered objects`;
}));
const form = document.querySelector('#contact-form');
const status = document.querySelector('.form-status');
if (form && BUSINESS.formEndpoint) status.textContent = 'Your enquiry will be sent securely to our contact service.';
if (form) {
  const product = new URLSearchParams(window.location.search).get('product');
  if (product) {
    form.elements.subject.value = 'Product enquiry';
    form.elements.message.value = `Hello, I would like to know more about ${product.slice(0, 200)}.`;
  }
}
form?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  if (!BUSINESS.formEndpoint) {
    const subject = `${data.subject} — ${data.name}`;
    const body = `Name: ${data.name}\nReply email: ${data.email}\n\n${data.message}`;
    window.location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Your email app has been requested. Review and send the message there. If it does not open, email us directly using the link beside this form.';
    return;
  }
  const submit = form.querySelector('[type="submit"]');
  submit.disabled = true; status.textContent = 'Sending your enquiry…';
  try {
    const endpoint = new URL(BUSINESS.formEndpoint);
    if (endpoint.protocol !== 'https:') throw new Error('HTTPS required');
    const response = await fetch(endpoint.href, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('Contact service failed');
    status.textContent = 'Thank you. Your enquiry was submitted successfully.'; form.reset();
  } catch { status.textContent = 'Your enquiry could not be sent. Please try again or use our email or WhatsApp link. Your message is still here.'; }
  finally { submit.disabled = false; }
});
