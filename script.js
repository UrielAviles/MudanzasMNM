/* ============================================================
   TRANSPORTES MNM — Mudanzas Nacionales México
   JavaScript principal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------------
  // 1. Header scroll effect
  // -----------------------------------------------
  const header = document.getElementById('header');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // check initial state


  // -----------------------------------------------
  // 2. Menú móvil (hamburguesa)
  // -----------------------------------------------
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = nav.querySelectorAll('.nav__link');

  const toggleMenu = () => {
    const isActive = nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    navOverlay.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  };

  const closeMenu = () => {
    nav.classList.remove('active');
    hamburger.classList.remove('active');
    navOverlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar menú con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeLightbox();
    }
  });


  // -----------------------------------------------
  // 3. Smooth scroll para links internos
  // -----------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // -----------------------------------------------
  // 4. Animaciones de entrada (Intersection Observer)
  // -----------------------------------------------
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Delay escalonado para elementos hermanos
        const siblings = entry.target.parentElement.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in-right');
        let siblingIndex = 0;
        siblings.forEach((sibling, i) => {
          if (sibling === entry.target) siblingIndex = i;
        });

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, siblingIndex * 100);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in-right').forEach(el => {
    observer.observe(el);
  });


  // -----------------------------------------------
  // 5. Galería — Carrusel & Lightbox
  // -----------------------------------------------
  const track = document.getElementById('galeria-track');
  const btnPrev = document.getElementById('carousel-btn-prev');
  const btnNext = document.getElementById('carousel-btn-next');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxItems = document.querySelectorAll('.galeria__item, .cobertura__map-frame');

  // Controladores de Scroll del Carrusel
  if (track && btnPrev && btnNext) {
    const getScrollAmount = () => {
      const firstItem = track.querySelector('.galeria__item');
      if (!firstItem) return 300;
      const itemWidth = firstItem.getBoundingClientRect().width;
      const trackGap = parseFloat(window.getComputedStyle(track).gap) || 0;
      
      // Calcular cuántas imágenes están visibles en la pantalla actualmente
      const visibleWidth = track.clientWidth;
      const singleScroll = itemWidth + trackGap;
      const visibleCount = Math.max(1, Math.floor((visibleWidth + trackGap) / singleScroll));
      
      // Desplazar un bloque completo de imágenes visibles a la vez (página completa)
      return singleScroll * visibleCount;
    };

    btnNext.addEventListener('click', () => {
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    btnPrev.addEventListener('click', () => {
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
  }

  // Lightbox
  lightboxItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });


  // -----------------------------------------------
  // 6. Active nav link highlighting
  // -----------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const highlightNav = () => {
    const scrollPos = window.scrollY + header.offsetHeight + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });


  // -----------------------------------------------
  // 7. Botón flotante de WhatsApp — mostrar después de scroll
  // -----------------------------------------------
  const whatsappFloat = document.getElementById('whatsapp-float');

  const handleWhatsAppVisibility = () => {
    if (window.scrollY > 400) {
      whatsappFloat.style.opacity = '1';
      whatsappFloat.style.pointerEvents = 'all';
    } else {
      whatsappFloat.style.opacity = '0';
      whatsappFloat.style.pointerEvents = 'none';
    }
  };

  // Estilo inicial
  whatsappFloat.style.opacity = '0';
  whatsappFloat.style.pointerEvents = 'none';
  whatsappFloat.style.transition = 'opacity 0.4s ease, transform 0.3s ease, box-shadow 0.3s ease';

  window.addEventListener('scroll', handleWhatsAppVisibility, { passive: true });


  // -----------------------------------------------
  // 8. Tipos de Maniobras — Acordeón Interactivo
  // -----------------------------------------------
  const maniobraCards = document.querySelectorAll('.maniobra-card');

  maniobraCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remover clase active de todas las cartas
      maniobraCards.forEach(c => c.classList.remove('active'));
      // Agregar clase active a la carta seleccionada
      card.classList.add('active');
    });
  });

});
