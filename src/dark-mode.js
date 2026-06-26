/**
 * Aurora AI — Dark Mode Toggle
 * 
 * Handles theme switching with localStorage persistence and smooth transitions
 */

export function initDarkMode() {
  const darkToggle = document.getElementById('dark-mode-toggle');
  const mobileDarkToggle = document.getElementById('mobile-dark-toggle');
  
  // Check for saved theme or default to light
  const savedTheme = localStorage.getItem('aurora-theme') || 'light';
  
  // Apply the theme on load
  setTheme(savedTheme);
  
  // Desktop toggle click handler
  if (darkToggle) {
    darkToggle.addEventListener('click', toggleTheme);
    
    // Keyboard support for desktop toggle
    darkToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }
  
  // Mobile toggle click handler
  if (mobileDarkToggle) {
    mobileDarkToggle.addEventListener('click', toggleTheme);
    
    // Keyboard support for mobile toggle
    mobileDarkToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addListener(handleSystemThemeChange);
  
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('aurora-theme', newTheme);
  }
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update the moon icon visibility for both toggles
    updateToggleIcons(theme);
    
    // Update aria-labels to reflect current state
    updateAriaLabels(theme);
  }
  
  function updateToggleIcons(theme) {
    // Handle desktop toggle
    const desktopToggle = document.getElementById('dark-mode-toggle');
    if (desktopToggle) {
      const sunIcon = desktopToggle.querySelector('.sun-icon');
      const moonIcon = desktopToggle.querySelector('.moon-icon');
      
      if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
    
    // Handle mobile toggle
    const mobileToggle = document.getElementById('mobile-dark-toggle');
    if (mobileToggle) {
      const sunIcon = mobileToggle.querySelector('.sun-icon');
      const moonIcon = mobileToggle.querySelector('.moon-icon');
      
      if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  }
  
  function updateAriaLabels(theme) {
    const desktopToggle = document.getElementById('dark-mode-toggle');
    const mobileToggle = document.getElementById('mobile-dark-toggle');
    
    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    
    if (desktopToggle) {
      desktopToggle.setAttribute('aria-label', label);
    }
    
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-label', label);
    }
  }
  
  function handleSystemThemeChange(e) {
    // Only follow system preference if user hasn't set a preference
    if (!localStorage.getItem('aurora-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  }
}