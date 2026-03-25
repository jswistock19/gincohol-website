/* ============================================
   ANCIENT PROOF — App JavaScript
   Multi-Page: Age Gate, Parallax, Gallery,
   Store Modals, Contact Form, Navigation
   ============================================ */

(function () {
  'use strict';

  // ---- Age Verification Gate ----
  const ageGate = document.getElementById('ageGate');
  if (ageGate && !sessionStorage.getItem('ageVerified')) {
    ageGate.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const monthInput = document.getElementById('ageMonth');
    const dayInput = document.getElementById('ageDay');
    const yearInput = document.getElementById('ageYear');
    const verifyBtn = document.getElementById('ageVerifyBtn');
    const errorMsg = document.getElementById('ageError');

    // Auto-advance fields
    [monthInput, dayInput].forEach((input, i) => {
      input.addEventListener('input', () => {
        if (input.value.length >= 2) {
          [dayInput, yearInput][i]?.focus();
        }
      });
    });

    function verifyAge() {
      const month = parseInt(monthInput.value);
      const day = parseInt(dayInput.value);
      const year = parseInt(yearInput.value);

      if (!month || !day || !year || month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > 2026) {
        errorMsg.textContent = 'Please enter a valid date of birth.';
        return;
      }

      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age >= 21) {
        sessionStorage.setItem('ageVerified', 'true');
        ageGate.classList.add('hidden');
        document.body.style.overflow = '';
      } else {
        errorMsg.textContent = "Sorry, you must be 21 or older to enter this site.";
      }
    }

    verifyBtn.addEventListener('click', verifyAge);

    yearInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') verifyAge();
    });
  } else if (ageGate) {
    ageGate.classList.add('hidden');
  }

  // ---- Theme Toggle ----
  const themeToggle = document.getElementById('themeToggle');

  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  // Default to dark for the whiskey brand feel
  applyTheme(true);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(!isDark);
    });
  }

  // ---- Sticky Header with Hide on Scroll Down ----
  const header = document.getElementById('header');
  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    if (scrollY > lastScrollY && scrollY > 300) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // ---- Mobile Hamburger Menu ----
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.contains('mobile-open');
      nav.classList.toggle('mobile-open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    nav.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('mobile-open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Smooth Scroll for Same-Page Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Scroll Reveal (Intersection Observer) ----
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 6 * 60, 300)}ms`;
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ---- Parallax Hero Effect ----
  const heroSection = document.querySelector('.hero');
  const heroBgImg = document.querySelector('.hero__bg-img');

  if (heroSection && heroBgImg) {
    let parallaxTicking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const heroHeight = heroSection.offsetHeight;

      if (scrollY < heroHeight) {
        const translateY = scrollY * 0.35;
        heroBgImg.style.transform = `translateY(${translateY}px) scale(1.1)`;
      }
      parallaxTicking = false;
    }

    // Set initial scale
    heroBgImg.style.transform = 'translateY(0) scale(1.1)';

    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  // ---- Gallery Filter Tabs ----
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

  if (filterBtns.length > 0) {
    const placeholderItems = document.querySelectorAll('.gallery-item--placeholder');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });

        // Hide placeholders when filtering, show on "all"
        placeholderItems.forEach(p => {
          if (filter === 'all') {
            p.classList.remove('hidden');
          } else {
            p.classList.add('hidden');
          }
        });
      });
    });
  }

  // ---- Gallery Lightbox ----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let lightboxImages = [];
  let currentLightboxIndex = 0;

  if (lightbox) {
    // Collect all gallery images (non-placeholder)
    document.querySelectorAll('.gallery-item:not(.gallery-item--placeholder)').forEach((item, i) => {
      const img = item.querySelector('img');
      const captionEl = item.querySelector('.gallery-item__caption');
      if (img) {
        lightboxImages.push({
          src: img.src,
          caption: captionEl ? captionEl.textContent.trim() : ''
        });

        item.addEventListener('click', () => {
          currentLightboxIndex = i;
          openLightbox();
        });
      }
    });

    function openLightbox() {
      if (lightboxImages.length === 0) return;
      const data = lightboxImages[currentLightboxIndex];
      lightboxImg.src = data.src;
      lightboxCaption.textContent = data.caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function prevImage() {
      currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
      updateLightboxImage();
    }

    function nextImage() {
      currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
      updateLightboxImage();
    }

    function updateLightboxImage() {
      const data = lightboxImages[currentLightboxIndex];
      lightboxImg.src = data.src;
      lightboxCaption.textContent = data.caption;
    }

    lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });
  }

  // ---- Store Product Modals ----
  const productCards = document.querySelectorAll('.product-card[data-product]');
  const modalOverlay = document.getElementById('productModalOverlay');

  if (productCards.length > 0 && modalOverlay) {
    const modalClose = modalOverlay.querySelector('.product-modal__close');
    const modalImage = modalOverlay.querySelector('.product-modal__image');
    const modalBadge = modalOverlay.querySelector('.product-modal__badge');
    const modalName = modalOverlay.querySelector('.product-modal__name');
    const modalDesc = modalOverlay.querySelector('.product-modal__desc');
    const modalDetails = modalOverlay.querySelector('.product-modal__details');

    const productData = {
      'original-blend': {
        badge: 'Flagship',
        name: 'Original Blend',
        image: './assets/bottle-display.png',
        hasImage: true,
        desc: 'Our flagship expression. Wild American ginseng root steeped in aged Kentucky bourbon, creating an unmistakable smooth warmth with earthy depth. The perfect introduction to the Ancient Proof experience — where centuries of ginseng hunting tradition meet modern extraction science in every sip.',
        details: [
          { label: 'Volume', value: '700 mL' },
          { label: 'Proof', value: '80 Proof' },
          { label: 'ABV', value: '40%' },
          { label: 'Origin', value: 'Kentucky' }
        ]
      },
      'barrel-select': {
        badge: 'Reserve',
        name: 'Barrel Select',
        image: null,
        hasImage: false,
        desc: 'Single-barrel aged with hand-selected ginseng roots. Each barrel is individually chosen for its exceptional character and depth. A limited small-batch release for those who seek the most refined expression of ginseng-infused whiskey.',
        details: [
          { label: 'Volume', value: '750 mL' },
          { label: 'Proof', value: '80 Proof' },
          { label: 'ABV', value: '40%' },
          { label: 'Release', value: 'Small Batch' }
        ]
      },
      'hunters-collection': {
        badge: 'Gift Set',
        name: "The Hunter's Collection",
        image: null,
        hasImage: false,
        desc: "The ultimate Ancient Proof experience. Features our Original Blend alongside an engraved ginseng root flask and artisan tasting notes journal. A tribute to the generations of Appalachian ginseng hunters whose knowledge made this spirit possible.",
        details: [
          { label: 'Includes', value: 'Bottle + Flask' },
          { label: 'Edition', value: 'Limited' },
          { label: 'ABV', value: '40%' },
          { label: 'Origin', value: 'Kentucky' }
        ]
      }
    };

    productCards.forEach(card => {
      card.addEventListener('click', () => {
        const productId = card.getAttribute('data-product');
        const data = productData[productId];
        if (!data) return;

        modalBadge.textContent = data.badge;
        modalName.textContent = data.name;
        modalDesc.textContent = data.desc;

        if (data.hasImage) {
          modalImage.innerHTML = `<img src="${data.image}" alt="${data.name}">`;
        } else {
          modalImage.innerHTML = `
            <div class="product-card__image-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              <span>Image Coming Soon</span>
            </div>
          `;
        }

        modalDetails.innerHTML = data.details.map(d => `
          <div class="product-modal__detail">
            <span class="product-modal__detail-label">${d.label}</span>
            <span class="product-modal__detail-value">${d.value}</span>
          </div>
        `).join('');

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ---- Contact Form ----
  const contactForm = document.getElementById('contactForm');
  const formContainer = document.getElementById('formContainer');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm && formContainer && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formContainer.style.display = 'none';
      formSuccess.style.display = 'block';
      window.scrollTo({
        top: formSuccess.getBoundingClientRect().top + window.scrollY - 120,
        behavior: 'smooth'
      });
    });
  }

  // ---- Email Capture Form ----
  const emailForm = document.getElementById('emailCaptureForm');
  const emailSuccess = document.getElementById('emailSuccess');
  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      emailForm.style.display = 'none';
      if (emailSuccess) emailSuccess.style.display = 'block';
    });
  }

  // ---- Active Navigation State (multi-page) ----
  // Determine current page from URL
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.header__nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Match the page
    if (currentPath.endsWith(href) ||
        (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html'))) ||
        (href === 'index.html' && currentPath === '')) {
      link.classList.add('active');
    }
  });

})();
