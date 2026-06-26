/**
 * Aurora AI — Main Entry Point
 * 
 * Orchestrates all modules. Initializes after DOM is ready.
 * Total entry animation orchestration target: <500ms.
 */

import './style.css';
import { initPricing } from './pricing.js';
import { initBento } from './bento.js';
import { initAnimations } from './animations.js';
import { initNav } from './nav.js';
import { initDarkMode } from './dark-mode.js';

// ─── Initialize Everything ───
function init() {
  // Feature 1: Dark Mode Toggle
  initDarkMode();

  // Feature 2: Pricing Matrix & Currency Switcher
  initPricing();

  // Feature 3: Bento-to-Accordion with State Persistence
  initBento();

  // Animations: Scroll reveals, counters, testimonial slider, scroll-to-top
  initAnimations();

  // Navigation: Mobile menu, smooth scroll
  initNav();
}

// ─── Boot ───
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
