const menuBtn = document.querySelector('#menu-btn');
const nav = document.querySelector('#nav');

const intro = document.querySelector('#intro-screen');
document.body.classList.add('intro-active');

const enterSite = () => {
  intro.classList.add('exit');
  document.body.classList.remove('intro-active');
};

const startIntro = () => {
  intro.classList.add('play');
  setTimeout(enterSite, 1500);
};

setTimeout(startIntro, 150);

intro.addEventListener('transitionend', event => {
  if (event.target === intro && intro.classList.contains('exit')) intro.classList.add('hidden');
});

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

const countEl = document.querySelector('#cart-count');
const toast = document.querySelector('#toast');
const cartDrawer = document.querySelector('#cart-drawer');
const cartOverlay = document.querySelector('#cart-overlay');
const cartItemsEl = document.querySelector('#cart-items');
const cartEmptyEl = document.querySelector('#cart-empty');
const cartTotalEl = document.querySelector('#cart-total');
const cartCheckout = document.querySelector('#cart-checkout');
const checkoutForm = document.querySelector('#checkout-form');
let cart = [];
try { cart = JSON.parse(localStorage.getItem('mp-cart')) || []; } catch (error) { cart = []; }

const escapeHTML = value => String(value).replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
const saveCart = () => {
  try { localStorage.setItem('mp-cart', JSON.stringify(cart)); } catch (error) { /* Storage can be unavailable. */ }
};
const showToast = message => {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
};
const renderCart = () => {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  countEl.textContent = count;
  cartEmptyEl.hidden = cart.length > 0;
  cartItemsEl.innerHTML = cart.map(item => `<article class="cart-item"><img src="${escapeHTML(item.image)}" alt=""><div><h3>${escapeHTML(item.name)}</h3><p>${item.price} DH</p><div class="cart-quantity"><button data-cart-action="minus" data-id="${item.id}" aria-label="Réduire">−</button><span>${item.quantity}</span><button data-cart-action="plus" data-id="${item.id}" aria-label="Augmenter">+</button></div></div><button class="cart-remove" data-cart-action="remove" data-id="${item.id}" aria-label="Supprimer">×</button></article>`).join('');
  cartTotalEl.textContent = `${total} DH`;
  cartCheckout.disabled = cart.length === 0;
};
const addToCart = product => {
  const existing = cart.find(item => String(item.id) === String(product.id));
  if (existing) existing.quantity += 1;
  else cart.push({...product, quantity: 1});
  saveCart();
  renderCart();
  showToast(`${product.name} ajouté au panier`);
};
const toggleCart = open => {
  cartDrawer.classList.toggle('open', open);
  cartOverlay.classList.toggle('open', open);
  cartDrawer.setAttribute('aria-hidden', String(!open));
  if (!open) checkoutForm.classList.remove('open');
};

document.querySelectorAll('.product-card').forEach((card, index) => {
  const baseId = index + 1;
  const baseName = card.dataset.name;
  const priceText = card.querySelector('.product-bottom strong').textContent;
  const basePrice = Number((priceText.match(/\d+/) || [0])[0]);
  const image = card.querySelector('.product-image img').getAttribute('src');
  const variantSelect = card.querySelector('[data-product-variant]');
  const addButton = card.querySelector('.add-cart');
  addButton.setAttribute('aria-label', `Ajouter ${baseName} au panier`);
  const actions = document.createElement('div');
  actions.className = 'product-actions';
  const whatsapp = document.createElement('a');
  whatsapp.className = 'product-wa';
  whatsapp.textContent = 'WA';
  whatsapp.setAttribute('aria-label', `Commander ${baseName} sur WhatsApp`);
  whatsapp.target = '_blank';
  whatsapp.rel = 'noreferrer';
  addButton.replaceWith(actions);
  actions.append(addButton, whatsapp);
  const selectedProduct = () => {
    if (!variantSelect) return {id: baseId, name: baseName, price: basePrice, image};
    const option = variantSelect.selectedOptions[0];
    return {id: `${baseId}-${option.value}`, name: `${baseName} ${option.value}`, price: Number(option.dataset.price), image};
  };
  const updateWhatsApp = () => {
    const selected = selectedProduct();
    whatsapp.href = `https://wa.me/212774145588?text=${encodeURIComponent(`Bonjour, je souhaite commander : ${selected.name} (${selected.price} DH)`)}`;
  };
  addButton.addEventListener('click', () => addToCart(selectedProduct()));
  if (variantSelect) variantSelect.addEventListener('change', updateWhatsApp);
  updateWhatsApp();
});

document.querySelector('#cart-button').addEventListener('click', () => toggleCart(true));
document.querySelector('#cart-close').addEventListener('click', () => toggleCart(false));
cartCheckout.addEventListener('click', () => {
  if (cart.length) checkoutForm.classList.add('open');
});
document.querySelector('#checkout-cancel').addEventListener('click', () => checkoutForm.classList.remove('open'));
checkoutForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!cart.length) return;
  const data = new FormData(checkoutForm);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lines = cart.map(item => `- ${item.name} x${item.quantity} : ${item.price * item.quantity} DH`);
  const note = String(data.get('note')).trim();
  const message = [
    'Bonjour, je souhaite confirmer cette commande :',
    '',
    ...lines,
    '',
    `Total : ${total} DH`,
    '',
    `Nom : ${data.get('name')}`,
    `Téléphone : ${data.get('phone')}`,
    `Ville : ${data.get('city')}`,
    `Adresse : ${data.get('address')}`,
    ...(note ? [`Note : ${note}`] : [])
  ].join('\n');
  window.open(`https://wa.me/212774145588?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});
cartOverlay.addEventListener('click', () => toggleCart(false));
cartItemsEl.addEventListener('click', event => {
  const button = event.target.closest('[data-cart-action]');
  if (!button) return;
  const item = cart.find(entry => String(entry.id) === button.dataset.id);
  if (!item) return;
  if (button.dataset.cartAction === 'plus') item.quantity += 1;
  if (button.dataset.cartAction === 'minus') item.quantity -= 1;
  if (button.dataset.cartAction === 'remove' || item.quantity <= 0) cart = cart.filter(entry => String(entry.id) !== String(item.id));
  saveCart();
  renderCart();
});
renderCart();

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
    if (event.target.closest('.product-actions, .variant-choice')) return;
    window.location.href = `product.html?id=${index + 1}`;
  };
  card.addEventListener('click', openProduct);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') openProduct(event);
  });
});

const searchPanel = document.querySelector('#search-panel');
document.querySelectorAll('[data-search]').forEach(button => button.addEventListener('click', () => searchPanel.classList.toggle('open')));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    searchPanel.classList.remove('open');
    toggleCart(false);
  }
});

window.addEventListener('scroll', () => {
  const current = [...document.querySelectorAll('main section[id]')].reverse().find(section => window.scrollY >= section.offsetTop - 180);
  document.querySelectorAll('.nav a').forEach(link => link.classList.toggle('active', current ? link.getAttribute('href') === `#${current.id}` : link.getAttribute('href') === '#top'));
});
