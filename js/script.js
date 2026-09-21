/* ==========================================================================
   PORTFOLIO — JAVASCRIPT
   Mobile navigation, scroll reveals, navbar effects, form handling, theme toggle
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- DOM References ---
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');

  /* ==========================================================================
     THEME TOGGLE — Dark / Light mode
     ========================================================================== */

  // Check saved preference or system preference
  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    html.classList.remove('dark', 'light');
    html.classList.add(theme);
    localStorage.setItem('theme', theme);
    // Update aria-label for accessibility
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function toggleTheme() {
    const current = html.classList.contains('light') ? 'light' : 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Initialize theme
  setTheme(getPreferredTheme());

  themeToggle.addEventListener('click', toggleTheme);

  /* ==========================================================================
     MOBILE NAVIGATION
     ========================================================================== */

  function toggleMobileMenu() {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     NAVBAR SCROLL EFFECT
     ========================================================================== */

  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* ==========================================================================
     SCROLL REVEAL ANIMATIONS
     ========================================================================== */

  const revealElements = document.querySelectorAll('.reveal:not(.visible)');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Staggered reveal containers
  const staggerContainers = document.querySelectorAll('.reveal-stagger:not(.visible)');
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        staggerObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  staggerContainers.forEach(el => staggerObserver.observe(el));

  /* ==========================================================================
     STAT COUNTER ANIMATION
     ========================================================================== */

  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target, 10);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(element, target) {
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /* ==========================================================================
     ACTIVE NAV LINK HIGHLIGHTING
     ========================================================================== */

  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNavLink() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.style.color = 'var(--color-accent)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNavLink, { passive: true });

  /* ==========================================================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ========================================================================== */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==========================================================================
     CONTACT FORM — opens the visitor's email app with the message filled in.
     The address is read from the email link in the Contact section (index.html),
     so you only change your email in one place.
     ========================================================================== */

  const emailLink = document.querySelector('.contact-item[href^="mailto:"]');
  const CONTACT_EMAIL = emailLink ? emailLink.getAttribute('href').replace('mailto:', '') : '';

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(contactForm));

      const subject = encodeURIComponent(`Portfolio message from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} (${data.email})`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Opening your email app...';
      setTimeout(() => {
        submitBtn.textContent = originalText;
        contactForm.reset();
      }, 2500);
    });
  }

  /* ==========================================================================
     PROJECTS TIMELINE — a dot follows the scroll down the line and lights up
     each project's node. Works with any number of .timeline-item blocks.
     ========================================================================== */

  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const items = Array.from(timeline.querySelectorAll('.timeline-item'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let nodeYs = [];
    let lineTop = 0;
    let lineBottom = 0;
    let ticking = false;

    // Position of an element inside the timeline, ignoring transforms (reveal animations)
    const yWithin = (el, ancestor) => {
      let y = 0;
      while (el && el !== ancestor) {
        y += el.offsetTop;
        el = el.offsetParent;
      }
      return y;
    };

    const update = () => {
      ticking = false;
      if (!nodeYs.length) return;

      if (reduceMotion) {
        timeline.style.setProperty('--progress', (lineBottom - lineTop) + 'px');
        items.forEach(item => item.classList.add('is-passed'));
        return;
      }

      const raw = window.innerHeight * 0.5 - timeline.getBoundingClientRect().top;
      const y = Math.min(Math.max(raw, lineTop), lineBottom);
      timeline.style.setProperty('--dot-y', y + 'px');
      timeline.style.setProperty('--progress', (y - lineTop) + 'px');
      items.forEach((item, i) => item.classList.toggle('is-passed', raw >= nodeYs[i] - 1));
    };

    const measure = () => {
      nodeYs = items.map(item => {
        const node = item.querySelector('.timeline-node');
        return yWithin(node, timeline) + node.offsetHeight / 2;
      });
      if (!nodeYs.length) return;
      lineTop = nodeYs[0];
      lineBottom = nodeYs[nodeYs.length - 1];
      timeline.style.setProperty('--line-top', lineTop + 'px');
      timeline.style.setProperty('--line-height', (lineBottom - lineTop) + 'px');
      timeline.classList.add('is-ready');
      update();
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(timeline);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
  }

  // If a project image is missing, hide the broken icon and keep the gradient block
  document.querySelectorAll('.project-image').forEach(img => {
    const hide = () => img.classList.add('is-broken');
    img.addEventListener('error', hide);
    img.addEventListener('load', () => img.classList.remove('is-broken'));
    if (img.complete && img.naturalWidth === 0) hide();
  });

  /* ==========================================================================
     FOOTER YEAR
     ========================================================================== */

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
