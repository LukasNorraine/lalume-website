/* ============================================================
   LaLume — Light Edition App JS
   ============================================================ */
(function () {
  'use strict';

  // ── Custom Cursor ─────────────────────────────────────────
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring) {
    let dotX = 0, dotY = 0, ringX = 0, ringY = 0, dotTX = 0, dotTY = 0;
    document.addEventListener('mousemove', e => { dotTX = e.clientX; dotTY = e.clientY; });
    const interactables = 'a, button, [data-hover], input, label, .product-card';
    document.addEventListener('mouseover', e => {
      if (e.target.matches(interactables) || e.target.closest(interactables))
        ring.classList.add('hovering');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.matches(interactables) || e.target.closest(interactables))
        ring.classList.remove('hovering');
    });
    (function animCursor() {
      dotX  += (dotTX - dotX) * 0.95;
      dotY  += (dotTY - dotY) * 0.95;
      ringX += (dotTX - ringX) * 0.12;
      ringY += (dotTY - ringY) * 0.12;
      dot.style.left  = dotX  + 'px'; dot.style.top  = dotY  + 'px';
      ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
      requestAnimationFrame(animCursor);
    })();
  }

  // ── Progress Bar ──────────────────────────────────────────
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const s = window.scrollY, t = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (s / t * 100) + '%';
    });
  }

  // ── Nav ───────────────────────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ── Magnetic Buttons ──────────────────────────────────────
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * 0.25, dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px,${dy}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ── Cart ──────────────────────────────────────────────────
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartSidebar = document.querySelector('.cart-sidebar');
  const cartClose   = document.querySelector('.cart-close');
  const cartCountEl = document.querySelector('.cart-count');
  const cartItemsEl = document.querySelector('.cart-items');
  const cartFooter  = document.querySelector('.cart-footer');
  const cartEmptyEl = document.querySelector('.cart-empty');
  let cartCount = 0, cartTotal = 0;
  const cartProducts = {};

  function openCart() {
    cartOverlay && cartOverlay.classList.add('open');
    cartSidebar && cartSidebar.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartOverlay && cartOverlay.classList.remove('open');
    cartSidebar && cartSidebar.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', openCart));
  cartClose && cartClose.addEventListener('click', closeCart);
  cartOverlay && cartOverlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  function getEmoji(name) {
    if (/copper/i.test(name))   return '⚗️';
    if (/eye|patch/i.test(name)) return '✨';
    if (/led|mask/i.test(name))  return '💡';
    if (/jade/i.test(name))      return '🌿';
    return '🧴';
  }

  function addToCart(name, price, qty) {
    const existing = document.querySelector(`.cart-item[data-name="${name}"]`);
    if (existing) {
      const qtyEl = existing.querySelector('.cart-item-qty');
      const n = parseInt(qtyEl.dataset.qty || 1) + qty;
      qtyEl.textContent = `Qty: ${n}`; qtyEl.dataset.qty = n;
    } else {
      const item = document.createElement('div');
      item.className = 'cart-item'; item.dataset.name = name;
      item.innerHTML = `
        <div class="cart-item-visual">${getEmoji(name)}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${name}</div>
          <div class="cart-item-price">$${price} CAD</div>
          <div class="cart-item-qty" data-qty="${qty}">Qty: ${qty}</div>
        </div>`;
      cartItemsEl && cartItemsEl.appendChild(item);
    }
    cartCount += qty; cartTotal += price * qty;
    cartProducts[name] = (cartProducts[name] || 0) + qty;
    updateCartUI();
    openCart();
  }

  function updateCartUI() {
    if (!cartCountEl) return;
    cartCountEl.textContent = cartCount;
    cartCountEl.classList.toggle('visible', cartCount > 0);
    if (cartEmptyEl)  cartEmptyEl.style.display = cartCount > 0 ? 'none' : '';
    if (cartItemsEl)  cartItemsEl.classList.toggle('has-items', cartCount > 0);
    if (cartFooter)   cartFooter.classList.toggle('visible', cartCount > 0);
    const totalEl = document.querySelector('.cart-total strong');
    if (totalEl) totalEl.textContent = `$${cartTotal} CAD`;
  }

  // ── Toast ─────────────────────────────────────────────────
  function showToast(msg, icon) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span class="toast-icon">${icon || '✅'}</span><span>${msg}</span>`;
    document.body.appendChild(t);
    setTimeout(() => t.style.opacity = '0', 2800);
    setTimeout(() => t.remove(), 3200);
  }

  // ── Add to Cart Buttons ───────────────────────────────────
  document.querySelectorAll('.btn-add-to-cart-main, [data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const name  = this.dataset.product || this.dataset.addToCart || 'LaLume Product';
      const price = parseInt(this.dataset.price || this.closest('[data-price]')?.dataset.price || '34');
      const qtyEl = document.querySelector('.qty-count');
      const qty   = qtyEl ? parseInt(qtyEl.textContent) : 1;

      // Ripple
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
      this.appendChild(r);
      setTimeout(() => r.remove(), 700);

      addToCart(name, price, qty);
      showToast(`${name} added to cart`, '🛍️');
    });
  });

  // ── Quantity Selector ─────────────────────────────────────
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const wrap = this.closest('.quantity-selector');
      const count = wrap.querySelector('.qty-count');
      let n = parseInt(count.textContent);
      if (this.dataset.action === 'plus') n = Math.min(n + 1, 10);
      if (this.dataset.action === 'minus') n = Math.max(n - 1, 1);
      count.textContent = n;
    });
  });

  // ── Intersection Observer Reveals ─────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  // ── Counter Animation ─────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const isDecimal = target % 1 !== 0;
      const duration = 1800, start = performance.now();
      (function frame(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = isDecimal ? (target * ease).toFixed(1) : Math.round(target * ease);
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(frame);
      })(performance.now());
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObs.observe(el));

  // ── 3D Card Tilt ──────────────────────────────────────────
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -10;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // ── Product Tabs ──────────────────────────────────────────
  document.querySelectorAll('.tab-bar').forEach(bar => {
    const panel = bar.closest('.product-tabs') || bar.parentElement;
    bar.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        bar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        panel.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const target = panel.querySelector(`[data-tab="${this.dataset.tab}"]`);
        if (target) target.classList.add('active');
      });
    });
  });

  // ── Filter Buttons ────────────────────────────────────────
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      document.querySelectorAll('.product-card[data-category]').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
      });
    });
  });

  // ── Marquee Duplication ───────────────────────────────────
  document.querySelectorAll('.marquee-track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });

  // ── Sticky Buy Bar ────────────────────────────────────────
  const stickyBar = document.querySelector('.sticky-buy-bar');
  const productHook = document.querySelector('.product-pain-hook');
  if (stickyBar && productHook) {
    const obs = new IntersectionObserver(entries => {
      stickyBar.classList.toggle('visible', !entries[0].isIntersecting);
    }, { threshold: 0 });
    obs.observe(productHook);
  }

  // ── Newsletter Form ───────────────────────────────────────
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('You\'re on the list! 10% code coming shortly.', '🌿');
      newsletterForm.reset();
    });
  }

  // ── GSAP ScrollTrigger (if loaded) ───────────────────────
  window.addEventListener('load', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Parallax on section labels
    gsap.utils.toArray('.ingredients-blob').forEach(el => {
      gsap.to(el, {
        yPercent: -20, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    });

    // Stagger product cards
    gsap.utils.toArray('.products-grid .product-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, delay: i * 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 85%', once: true } }
      );
    });
  });

})();
