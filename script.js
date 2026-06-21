const menuBtn = document.querySelector('#menu-btn');
const nav = document.querySelector('#nav');

const intro = document.querySelector('#intro-screen');
let introSeen = false;
try { introSeen = sessionStorage.getItem('mp-intro-seen') === '1'; } catch (error) { introSeen = false; }
if (introSeen) {
  intro.classList.add('skip');
} else {
  document.body.classList.add('intro-active');
  window.addEventListener('load', () => {
    intro.classList.add('play');
    setTimeout(() => {
      intro.classList.add('exit');
      document.body.classList.remove('intro-active');
      try { sessionStorage.setItem('mp-intro-seen', '1'); } catch (error) { /* Storage can be unavailable in private mode. */ }
    }, 3000);
    setTimeout(() => intro.classList.add('hidden'), 3700);
  });
}

menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: .08, rootMargin: '0px 0px 80px 0px' });
  revealItems.forEach(el => observer.observe(el));
} else {
  revealItems.forEach(el => el.classList.add('visible'));
}

let count = 0;
const countEl = document.querySelector('#cart-count');
const toast = document.querySelector('#toast');
document.querySelectorAll('.add-cart').forEach(button => button.addEventListener('click', event => {
  count += 1;
  countEl.textContent = count;
  toast.textContent = `${event.currentTarget.closest('.product-card').dataset.name} ajouté au panier`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}));

document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter-btn').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  document.querySelectorAll('.product-card').forEach(card => {
    card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
  });
}));

document.querySelectorAll('.product-card').forEach((card, index) => {
  card.setAttribute('role', 'link');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `Voir la fiche de ${card.dataset.name}`);
  const openProduct = event => {
    if (event.target.closest('.add-cart')) return;
    window.location.href = `product.html?id=${index + 1}`;
  };
  card.addEventListener('click', openProduct);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') openProduct(event);
  });
});

const searchPanel = document.querySelector('#search-panel');
document.querySelectorAll('[data-search]').forEach(button => button.addEventListener('click', () => searchPanel.classList.toggle('open')));
document.addEventListener('keydown', event => { if (event.key === 'Escape') searchPanel.classList.remove('open'); });

window.addEventListener('scroll', () => {
  const current = [...document.querySelectorAll('main section[id]')].reverse().find(section => window.scrollY >= section.offsetTop - 180);
  document.querySelectorAll('.nav a').forEach(link => link.classList.toggle('active', current ? link.getAttribute('href') === `#${current.id}` : link.getAttribute('href') === '#top'));
});
