/**
 * Mobile Navigation Module
 * 
 * Handles the mobile hamburger menu toggle and overlay.
 * Uses CSS transitions for open/close animation.
 */

export function initNav() {
  const toggle = document.getElementById('nav-mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');

  if (!toggle || !mobileMenu) return;

  function openMenu() {
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus trap — focus the first link
    requestAnimationFrame(() => {
      const firstLink = mobileMenu.querySelector('.mobile-nav-link');
      if (firstLink) firstLink.focus();
    });
  }

  function closeMenu() {
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on resize to desktop
  const mql = window.matchMedia('(min-width: 769px)');
  mql.addEventListener('change', (e) => {
    if (e.matches && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-link, .mobile-nav-link, a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    });
  });
}
