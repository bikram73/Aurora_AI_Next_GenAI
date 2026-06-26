/**
 * Feature 1: Matrix-Driven Pricing & Currency Switcher
 * 
 * Architecture:
 * - Multi-dimensional config matrix (base rates + currency conversion + annual discount)
 * - State-isolated DOM updates: only targeted text nodes change (no parent re-render)
 * - No global state reflows
 */

// ─── Pricing Configuration Matrix ───
const PRICING_MATRIX = {
  tiers: {
    starter: {
      name: 'Starter',
      baseMonthlyINR: 0,       // Free tier
      features: ['1,000 requests / mo', 'Standard Support', 'Shared AI Core'],
    },
    pro: {
      name: 'Pro',
      baseMonthlyINR: 4099,    // Base price in INR (monthly)
      features: ['50,000 requests / mo', 'Priority 24/7 Support', 'Dedicated Instance', 'Advanced Analytics'],
    },
    enterprise: {
      name: 'Enterprise',
      baseMonthlyINR: null,    // Custom pricing
      features: ['Unlimited requests', 'SLA Agreements', 'On-Prem Deployment'],
    },
  },
  currencies: {
    USD: { symbol: '$', rate: 83,  locale: 'en-US' },
    INR: { symbol: '₹', rate: 1,   locale: 'en-IN' },
    EUR: { symbol: '€', rate: 90,  locale: 'de-DE' },
  },
  annualDiscountMultiplier: 0.80,  // 20% discount → pay 80%
};

// ─── Internal State (module-scoped, not global) ───
let _currentCurrency = 'USD';
let _isAnnual = false;

// ─── Pure Computation ───
function computePrice(tier, currency, isAnnual) {
  const tierData = PRICING_MATRIX.tiers[tier];
  if (!tierData || tierData.baseMonthlyINR === null) return null;
  if (tierData.baseMonthlyINR === 0) return 0;

  const currencyConfig = PRICING_MATRIX.currencies[currency];
  let price = tierData.baseMonthlyINR / currencyConfig.rate;

  if (isAnnual) {
    price = price * PRICING_MATRIX.annualDiscountMultiplier;
  }

  return Math.round(price);
}

function formatPrice(value, currency) {
  if (value === null) return 'Custom';
  if (value === 0) return '0';
  
  const currencyConfig = PRICING_MATRIX.currencies[currency];
  // Simple formatting without Intl to keep it lightweight
  return value.toLocaleString(currencyConfig.locale);
}

// ─── State-Isolated DOM Updates ───
// CRITICAL: Only update targeted text nodes, never re-render parent containers
function updatePriceDisplay() {
  const tiers = ['starter', 'pro', 'enterprise'];
  
  tiers.forEach(tier => {
    const symbolEl = document.querySelector(`[data-price-symbol="${tier}"]`);
    const valueEl = document.querySelector(`[data-price-value="${tier}"]`);
    const periodEl = document.querySelector(`[data-price-period="${tier}"]`);

    if (!symbolEl || !valueEl || !periodEl) return;

    const tierData = PRICING_MATRIX.tiers[tier];
    const currencyConfig = PRICING_MATRIX.currencies[_currentCurrency];

    if (tierData.baseMonthlyINR === null) {
      // Enterprise — always "Custom"
      symbolEl.style.visibility = 'hidden';
      valueEl.textContent = 'Custom';
      periodEl.textContent = '';
    } else {
      const price = computePrice(tier, _currentCurrency, _isAnnual);
      // Direct textContent updates — no innerHTML, no parent mutation
      symbolEl.style.visibility = 'visible';
      symbolEl.textContent = currencyConfig.symbol;
      valueEl.textContent = formatPrice(price, _currentCurrency);
      periodEl.textContent = _isAnnual ? '/yr' : '/mo';
    }
  });
}

// ─── Event Binding ───
export function initPricing() {
  const billingToggle = document.getElementById('billing-toggle');
  const labelMonthly = document.getElementById('billing-label-monthly');
  const labelAnnual = document.getElementById('billing-label-annual');
  const annualBadge = document.getElementById('annual-badge');
  const currencyDropdown = document.getElementById('currency-dropdown');
  const currencyTrigger = document.getElementById('currency-trigger');
  const currencyDisplay = document.getElementById('currency-display');
  const currencyMenu = document.getElementById('currency-menu');

  if (!billingToggle || !currencyDropdown) return;

  // ── Billing Toggle ──
  function toggleBilling() {
    _isAnnual = !_isAnnual;
    
    // Update toggle UI (only toggle-related elements)
    billingToggle.classList.toggle('active', _isAnnual);
    billingToggle.setAttribute('aria-checked', String(_isAnnual));
    labelMonthly.classList.toggle('active', !_isAnnual);
    labelAnnual.classList.toggle('active', _isAnnual);
    annualBadge.classList.toggle('visible', _isAnnual);
    
    // Isolated price update
    updatePriceDisplay();
  }

  billingToggle.addEventListener('click', toggleBilling);
  billingToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBilling();
    }
  });

  // ── Currency Dropdown ──
  function toggleDropdown() {
    const isOpen = currencyDropdown.classList.toggle('open');
    currencyTrigger.setAttribute('aria-expanded', String(isOpen));
  }

  function selectCurrency(currency) {
    _currentCurrency = currency;
    const currencyConfig = PRICING_MATRIX.currencies[currency];
    
    // Update dropdown display (only dropdown text node)
    currencyDisplay.textContent = `${currency} (${currencyConfig.symbol})`;
    
    // Update selected state in menu
    currencyMenu.querySelectorAll('.currency-option').forEach(opt => {
      const isSelected = opt.dataset.currency === currency;
      opt.classList.toggle('selected', isSelected);
      opt.setAttribute('aria-selected', String(isSelected));
    });
    
    // Close dropdown
    currencyDropdown.classList.remove('open');
    currencyTrigger.setAttribute('aria-expanded', 'false');
    
    // Isolated price update
    updatePriceDisplay();
  }

  currencyTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  currencyMenu.querySelectorAll('.currency-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      selectCurrency(option.dataset.currency);
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!currencyDropdown.contains(e.target)) {
      currencyDropdown.classList.remove('open');
      currencyTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close dropdown on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      currencyDropdown.classList.remove('open');
      currencyTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  // Initial render
  updatePriceDisplay();
}
