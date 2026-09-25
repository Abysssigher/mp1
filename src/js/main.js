/*
 * MP1 — LUMU single-page site
 * Vanilla JS (ES6). No external JS libraries used.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSmoothScroll();
  initScrollSpy();
  initCarousel();
  initModal();
  initScrollReveal();
});

/* ------------------------------------------------------------------ */
/* Navbar: sticky resize on scroll                                     */
/* ------------------------------------------------------------------ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const SCROLL_THRESHOLD = 60;

  function handleScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ------------------------------------------------------------------ */
/* Smooth scrolling for nav links (accounts for navbar height offset)  */
/* ------------------------------------------------------------------ */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId.charAt(0) !== '#') return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();
      const navbarHeight = navbar.getBoundingClientRect().height;
      const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });
}

/* ------------------------------------------------------------------ */
/* Scroll spy / position indicator: highlight nav item for current      */
/* section, based on which section sits just below the navbar's        */
/* bottom edge. Recomputed on every scroll event.                      */
/* ------------------------------------------------------------------ */
function initScrollSpy() {
  const sections = Array.from(document.querySelectorAll('main > section, footer'));
  const navLinks = document.querySelectorAll('.navbar__link');
  const navbar = document.getElementById('navbar');

  function setActive(sectionId) {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === sectionId);
    });
  }

  function handleScroll() {
    const navbarHeight = navbar.getBoundingClientRect().height;
    const probeLine = navbarHeight + 1; // just below the navbar's bottom edge

    // Special-case: if the user has scrolled to the very bottom of the
    // page, force-highlight the last section (footer/contact), since its
    // remaining height may be shorter than the viewport.
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    if (atBottom) {
      setActive(sections[sections.length - 1].id);
      return;
    }

    let currentId = sections[0].id;
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= probeLine && rect.bottom > probeLine) {
        currentId = section.id;
        break;
      }
      if (rect.top <= probeLine) {
        currentId = section.id;
      }
    }
    setActive(currentId);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll);
  handleScroll();
}

/* ------------------------------------------------------------------ */
/* Carousel: prev/next arrows + dot navigation                         */
/* ------------------------------------------------------------------ */
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const dotsContainer = document.getElementById('carouselDots');

  let currentIndex = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel__dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  function update() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    update();
  }

  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // auto-advance every 6s, pausing on hover
  let autoplay = setInterval(() => goToSlide(currentIndex + 1), 6000);
  const carouselEl = document.getElementById('carousel');
  carouselEl.addEventListener('mouseenter', () => clearInterval(autoplay));
  carouselEl.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goToSlide(currentIndex + 1), 6000);
  });

  update();
}

/* ------------------------------------------------------------------ */
/* Modal open/close                                                     */
/* ------------------------------------------------------------------ */
function initModal() {
  const modal = document.getElementById('modal');
  const openBtn = document.getElementById('openModal');
  const closeBtn = document.getElementById('closeModal');
  const backdrop = document.getElementById('modalBackdrop');

  function open() {
    modal.classList.add('is-open');
  }
  function close() {
    modal.classList.remove('is-open');
  }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

/* ------------------------------------------------------------------ */
/* Scroll-reveal fade-in animation via IntersectionObserver             */
/* ------------------------------------------------------------------ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.fade-in-el');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}
