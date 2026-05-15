/* ============================================================
   LaLume — Shopify Theme App JS
   ============================================================ */
(function () {
  'use strict';


  // ── Progress Bar ──────────────────────────────────────────
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const s = window.scrollY, t = document.documentElement.scrollHeight - window.innerHeight;
      if (t > 0) progressBar.style.width = (s / t * 100) + '%';
    });
  }

  // ── Nav ───────────────────────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));
  }

  // ── Magnetic Buttons ──────────────────────────────────────
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
      btn.style.transform = `translate(${dx}px,${dy}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // ── Shopify Cart ──────────────────────────────────────────
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartSidebar = document.querySelector('.cart-sidebar');
  const cartClose   = document.querySelector('.cart-close');

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

  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2).replace(/\.00$/, '');
  }

  function getItemEmoji(title) {
    if (/copper/i.test(title))    return '⚗️';
    if (/eye|patch/i.test(title)) return '✨';
    if (/led|mask/i.test(title))  return '💡';
    if (/jade/i.test(title))      return '🌿';
    return '🧴';
  }

  function renderCart(cart) {
    const countEl  = document.querySelector('.cart-count');
    const itemsEl  = document.querySelector('.cart-items');
    const emptyEl  = document.querySelector('.cart-empty');
    const footerEl = document.querySelector('.cart-footer');
    const totalEl  = document.querySelector('.cart-total strong');

    if (countEl) {
      countEl.textContent = cart.item_count;
      countEl.classList.toggle('visible', cart.item_count > 0);
    }
    if (itemsEl) {
      itemsEl.innerHTML = '';
      cart.items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <div class="cart-item-visual">${getItemEmoji(item.title)}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.title}</div>
            <div class="cart-item-price">${formatMoney(item.price)} CAD</div>
            <div class="cart-item-qty">Qty: ${item.quantity}</div>
          </div>`;
        itemsEl.appendChild(div);
      });
      itemsEl.classList.toggle('has-items', cart.item_count > 0);
    }
    if (emptyEl)  emptyEl.style.display = cart.item_count > 0 ? 'none' : '';
    if (footerEl) footerEl.classList.toggle('visible', cart.item_count > 0);
    if (totalEl)  totalEl.textContent = formatMoney(cart.total_price) + ' CAD';
  }

  async function refreshCart() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      renderCart(cart);
    } catch (e) { /* silently fail */ }
  }

  // Initialize cart count on load
  refreshCart();

  // ── Toast ─────────────────────────────────────────────────
  function showToast(msg, icon) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span class="toast-icon">${icon || '✅'}</span><span>${msg}</span>`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.transition = 'opacity 0.4s'; t.style.opacity = '0'; }, 2800);
    setTimeout(() => t.remove(), 3300);
  }

  // ── Add to Cart ───────────────────────────────────────────
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', async function (e) {
      e.preventDefault();
      const variantId = this.dataset.variantId;
      if (!variantId) return;

      // Ripple
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
      this.appendChild(r);
      setTimeout(() => r.remove(), 700);

      this.disabled = true;
      const origHTML = this.innerHTML;
      this.innerHTML = '<span>Adding…</span>';

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: parseInt(variantId), quantity: 1 })
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.description || 'Could not add to cart');
        }
        await refreshCart();
        openCart();
        showToast('Added to your cart', '🛍️');
      } catch (err) {
        showToast(err.message || 'Something went wrong', '❌');
      } finally {
        this.disabled = false;
        this.innerHTML = origHTML;
      }
    });
  });

  // ── Intersection Observer Reveals ─────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }

  // ── Counter Animation ─────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '', prefix = el.dataset.prefix || '';
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
  }

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

  // ── Subscribe & Save Toggle ───────────────────────────────
  document.querySelectorAll('.purchase-opt').forEach(btn => {
    btn.addEventListener('click', function () {
      const container = this.closest('.purchase-options');
      container.querySelectorAll('.purchase-opt').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const isSub = this.dataset.opt === 'sub';
      const priceEl = document.querySelector('.price-main');
      const compareEl = document.querySelector('.price-compare');
      const btnSpan = document.querySelector('.btn-add-to-cart span');
      const note = document.querySelector('.sub-delivery-note');
      if (priceEl) {
        const base = parseInt(priceEl.dataset.base || 0);
        if (base) {
          const cents = isSub ? Math.round(base * 0.85) : base;
          priceEl.textContent = '$' + (cents / 100).toFixed(2);
        }
      }
      if (compareEl) compareEl.textContent = isSub ? compareEl.dataset.labelSub : compareEl.dataset.labelOnce;
      if (btnSpan) btnSpan.innerHTML = isSub ? btnSpan.dataset.labelSub : btnSpan.dataset.labelOnce;
      if (note) note.classList.toggle('visible', isSub);
    });
  });

  // ── Product Tabs ──────────────────────────────────────────
  document.querySelectorAll('.tab-bar').forEach(bar => {
    const panel = bar.closest('.product-tabs') || bar.parentElement;
    bar.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        bar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        panel.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const target = panel.querySelector(`.tab-panel[data-tab="${this.dataset.tab}"]`);
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
  const stickyBar   = document.querySelector('.sticky-buy-bar');
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
      showToast("You're on the list! 10% code incoming.", '🌿');
      newsletterForm.reset();
    });
  }

})();
