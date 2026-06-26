/**
 * Feature 2: Bento-to-Accordion Wrapper with State Persistence
 * 
 * Architecture:
 * - Desktop (≥769px): Bento grid layout (CSS Grid, shown via CSS)
 * - Mobile (<769px): Accordion layout (built dynamically, shown via CSS)
 * - Context Lock: Tracks active hover/focus index on bento cards; 
 *   on breakpoint crossing, transfers that index to open the corresponding accordion panel
 * - Zero external libraries: Pure CSS transitions + matchMedia
 * - Transition timing: 300-400ms ease-in-out (structural)
 */

// ─── Feature Data ───
const FEATURES = [
  {
    title: 'AI Chat Engine',
    description: 'Deploy context-aware conversational agents that learn from your unique business data instantly.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/></svg>`,
    filled: false,
  },
  {
    title: 'Advanced Analytics',
    description: 'Deep-dive into model performance and user behavior with real-time telemetry and visualization.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"/><path d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"/></svg>`,
    filled: false,
  },
  {
    title: 'Auto-Flow',
    description: 'Connect your existing stack with AI-driven workflows that trigger based on complex events.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>`,
    filled: false,
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-grade encryption and SOC2 compliance for every byte of data processed by our AI core.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93c.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204c.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78c-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107c-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93c-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204c-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78c.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107c.397-.165.71-.505.78-.929l.15-.894Z"/><path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"/></svg>`,
    filled: false,
  },
  {
    title: 'Scalable API',
    description: 'Developer-first endpoints designed for high throughput and ultra-low latency requirements.',
    iconSvg: `<svg viewBox="0 0 16 16"><path fill="currentColor" d="M8.372 1.349a.75.75 0 0 0-.744 0l-4.81 2.748L8 7.131l5.182-3.034zM14 5.357L8.75 8.43v6.005l4.872-2.784A.75.75 0 0 0 14 11zm-6.75 9.078V8.43L2 5.357V11c0 .27.144.518.378.651z"/></svg>`,
    filled: true,
  },
  {
    title: 'Team Collaboration',
    description: 'Built-in version control and workspace sharing for seamless cross-functional AI development.',
    iconSvg: `<svg viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037a.75.75 0 0 1-.646 1.353a5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353a5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037a.75.75 0 0 1-.354-1Z" clip-rule="evenodd"/></svg>`,
    filled: true,
  },
];

// Chevron SVG for accordion toggle
const CHEVRON_DOWN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m19.5 8.25l-7.5 7.5l-7.5-7.5"/></svg>`;

// ─── Module State ───
let _activeIndex = -1;         // Currently hovered/focused bento index
let _isMobileView = false;     // Current breakpoint state
let _accordionBuilt = false;

// ─── Build Accordion DOM ───
function buildAccordion() {
  const container = document.getElementById('accordion-container');
  if (!container || _accordionBuilt) return;

  container.innerHTML = '';

  FEATURES.forEach((feature, index) => {
    const item = document.createElement('div');
    item.className = 'accordion-item';
    item.dataset.featureIndex = index;

    item.innerHTML = `
      <button class="accordion-trigger" aria-expanded="false" aria-controls="accordion-panel-${index}">
        <span class="accordion-trigger-left">
          <span class="accordion-trigger-icon ${feature.filled ? 'filled' : ''}">${feature.iconSvg}</span>
          <span>${feature.title}</span>
        </span>
        <span class="accordion-chevron">${CHEVRON_DOWN_SVG}</span>
      </button>
      <div class="accordion-panel" id="accordion-panel-${index}" role="region" aria-hidden="true">
        <div class="accordion-panel-content">
          ${feature.description}
        </div>
      </div>
    `;

    container.appendChild(item);
  });

  // Bind accordion click events
  container.querySelectorAll('.accordion-trigger').forEach((trigger, idx) => {
    trigger.addEventListener('click', () => toggleAccordionItem(idx));
  });

  _accordionBuilt = true;
}

// ─── Accordion Toggle ───
function toggleAccordionItem(index) {
  const container = document.getElementById('accordion-container');
  if (!container) return;

  const items = container.querySelectorAll('.accordion-item');

  items.forEach((item, idx) => {
    const panel = item.querySelector('.accordion-panel');
    const trigger = item.querySelector('.accordion-trigger');
    const panelContent = item.querySelector('.accordion-panel-content');

    if (idx === index) {
      const isOpen = item.classList.contains('open');
      if (isOpen) {
        // Close it
        item.classList.remove('open');
        panel.style.maxHeight = '0';
        panel.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        _activeIndex = -1;
      } else {
        // Open it
        item.classList.add('open');
        panel.style.maxHeight = panelContent.scrollHeight + 'px';
        panel.setAttribute('aria-hidden', 'false');
        trigger.setAttribute('aria-expanded', 'true');
        _activeIndex = index;
      }
    } else {
      // Close all others
      item.classList.remove('open');
      panel.style.maxHeight = '0';
      panel.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ─── Open specific accordion item (for context lock) ───
function openAccordionAt(index) {
  if (index < 0 || index >= FEATURES.length) return;
  
  const container = document.getElementById('accordion-container');
  if (!container) return;

  const items = container.querySelectorAll('.accordion-item');
  
  items.forEach((item, idx) => {
    const panel = item.querySelector('.accordion-panel');
    const trigger = item.querySelector('.accordion-trigger');
    const panelContent = item.querySelector('.accordion-panel-content');

    if (idx === index) {
      item.classList.add('open');
      panel.style.maxHeight = panelContent.scrollHeight + 'px';
      panel.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
    } else {
      item.classList.remove('open');
      panel.style.maxHeight = '0';
      panel.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ─── Bento Card Hover/Focus Tracking ───
function bindBentoTracking() {
  const bentoCards = document.querySelectorAll('.bento-card[data-feature-index]');

  bentoCards.forEach(card => {
    const index = parseInt(card.dataset.featureIndex, 10);

    card.addEventListener('mouseenter', () => {
      _activeIndex = index;
    });

    card.addEventListener('mouseleave', () => {
      // Keep the active index for a brief window to allow context lock
      // Don't reset immediately
    });

    card.addEventListener('focus', () => {
      _activeIndex = index;
    }, true);
  });
}

// ─── Breakpoint Listener (Context Lock) ───
function initBreakpointListener() {
  const mql = window.matchMedia('(max-width: 768px)');

  function handleBreakpoint(e) {
    const wasMobile = _isMobileView;
    _isMobileView = e.matches;

    if (!wasMobile && _isMobileView) {
      // Switched Desktop → Mobile
      // Context Lock: if user was interacting with a bento card, open that accordion panel
      buildAccordion();
      if (_activeIndex >= 0) {
        // Use requestAnimationFrame to ensure DOM is ready after display change
        requestAnimationFrame(() => {
          openAccordionAt(_activeIndex);
        });
      }
    } else if (wasMobile && !_isMobileView) {
      // Switched Mobile → Desktop
      // Get the currently open accordion index and keep it tracked
      const container = document.getElementById('accordion-container');
      if (container) {
        const openItem = container.querySelector('.accordion-item.open');
        if (openItem) {
          _activeIndex = parseInt(openItem.dataset.featureIndex, 10);
        }
      }
    }
  }

  // Initial check
  _isMobileView = mql.matches;
  if (_isMobileView) {
    buildAccordion();
  }

  mql.addEventListener('change', handleBreakpoint);
}

// ─── Export Init ───
export function initBento() {
  buildAccordion();
  bindBentoTracking();
  initBreakpointListener();
}
