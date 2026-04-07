/* =============================================
   AGAVITOX — script.js
   Interactividad completa:
   · Loader de entrada
   · Cursor personalizado
   · Header sticky
   · Menú hamburguesa
   · Animaciones scroll (Intersection Observer)
   · Filtros por categoría
   · Modal con detalle de lugar
   · Scroll suave
   · Botón volver arriba
   ============================================= */

'use strict';

/* ===== LOADER ===== */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Esperar 1.8s (duración de la animación) y luego ocultar
  setTimeout(() => {
    loader.classList.add('hidden');

    // Trigger reveal de los elementos del hero
    document.querySelectorAll('.hero .reveal-up').forEach(el => {
      el.classList.add('visible');
    });
  }, 1800);
})();

/* ===== CURSOR PERSONALIZADO ===== */
(function initCursor() {
  // Solo en dispositivos con hover (desktop)
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cursor = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  if (!cursor || !cursorTrail) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // El trail sigue con lerp suave
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Efectos hover: agrandar en elementos interactivos
  const interactives = document.querySelectorAll('a, button, .card, .filter-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursorTrail.style.width = '50px';
      cursorTrail.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '';
      cursor.style.height = '';
      cursorTrail.style.width = '';
      cursorTrail.style.height = '';
    });
  });
})();

/* ===== HEADER STICKY ===== */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Estado inicial
})();

/* ===== MENÚ HAMBURGUESA ===== */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  function toggleMenu(force) {
    const isOpen = hamburger.classList.toggle('active', force);
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleMenu());

  // Cerrar al hacer clic en un enlace
  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      toggleMenu(false);
    }
  });
})();

/* ===== INTERSECTION OBSERVER — ANIMACIONES AL SCROLL ===== */
(function initReveal() {
  // Reveal genérico para .reveal-up (excepto en el hero, que se activa en el loader)
  const revealEls = document.querySelectorAll('.reveal-up:not(.hero .reveal-up)');

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  // Reveal escalonado para tarjetas (.reveal-card)
  const cards = document.querySelectorAll('.reveal-card');

  const cardObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  cards.forEach(card => cardObserver.observe(card));
})();

/* ===== FILTROS POR CATEGORÍA ===== */
(function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const allCards = document.querySelectorAll('.card[data-category]');
  const sections = document.querySelectorAll('.cards-section[data-section]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Actualizar estado de botones
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (filter === 'all') {
        // Mostrar todo
        allCards.forEach(card => {
          card.classList.remove('hidden-filter');
        });
        sections.forEach(s => s.style.display = '');
      } else {
        // Ocultar/mostrar tarjetas y secciones
        allCards.forEach(card => {
          card.classList.toggle('hidden-filter', card.dataset.category !== filter);
        });

        sections.forEach(section => {
          const sectionHasVisible = section.querySelector(`.card[data-category="${filter}"]`);
          section.style.display = sectionHasVisible ? '' : 'none';
        });

        // Scroll suave hacia la primera sección visible
        const target = document.getElementById(filter);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    });
  });
})();

/* ===== MODAL — DETALLE DE LUGAR ===== */
(function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('modalClose');
  const closeBtn2 = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalRate = document.getElementById('modalRating');
  const modalPrice = document.getElementById('modalPrecio');
  const modalHour = document.getElementById('modalHorario');
  const modalCta = document.getElementById('modalCta');

  if (!overlay) return;

  function openModal(card) {
    const { name, desc, img, rating, precio, horario, category } = card.dataset;

    modalImg.src = img || '';
    modalImg.alt = name || '';
    modalTitle.textContent = name || '';
    modalDesc.textContent = desc || '';
    modalRate.textContent = rating ? `⭐ ${rating}` : '';
    modalPrice.textContent = precio || '';
    modalHour.textContent = horario ? `🕐 ${horario}` : '';

    // Texto del CTA según categoría
    const ctaLabels = {
      restaurantes: 'Ver ubicación',
      lugares: 'Cómo llegar',
      hoteles: 'Ver disponibilidad',
      recomendaciones: 'Explorar',
      tours: 'Reservar ahora',
    };
    modalCta.textContent = ctaLabels[category] || 'Explorar';

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus trap básico
    setTimeout(() => closeBtn.focus(), 100);
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Abrir al clic en tarjeta o en btn-card
  document.addEventListener('click', e => {
    const card = e.target.closest('.card[data-name]');
    if (card) {
      openModal(card);
    }
  });

  // Cerrar
  closeBtn.addEventListener('click', closeModal);
  closeBtn2.addEventListener('click', closeModal);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });
})();

/* ===== SCROLL SUAVE para anclas del nav ===== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerH = document.getElementById('header')?.offsetHeight || 80;
      const y = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();

/* ===== BOTÓN VOLVER ARRIBA ===== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===== EFECTO PARALLAX SUAVE en el hero ===== */
(function initParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  // Solo en desktop (con hover: hover) para performance
  if (!window.matchMedia('(hover: hover)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const limit = window.innerHeight;
        if (scrolled < limit) {
          heroImg.style.transform = `scale(1.08) translateY(${scrolled * 0.18}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ===== ACTIVE NAV LINK (highlight al hacer scroll) ===== */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${id}`;
          link.style.color = active ? 'var(--gold)' : '';
        });
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ===== NÚMEROS ANIMADOS en stats del hero ===== */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  const targets = { '300+': 300, '50k': 50, '18': 18 };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent.trim();
      const target = targets[text];
      if (target === undefined) return;

      const suffix = text.includes('+') ? '+' : text.includes('k') ? 'k' : '';
      let start = 0;
      const step = target / 50;
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          el.textContent = target + suffix;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(start) + suffix;
        }
      }, 30);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
})();
