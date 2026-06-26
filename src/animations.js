/**
 * Animations Module
 * 
 * - Scroll-triggered reveal (IntersectionObserver)
 * - Animated counters (requestAnimationFrame)
 * - Scroll-to-top button visibility
 * - Testimonial slider
 * 
 * All motion uses native CSS transitions/animations.
 * No CSS-in-JS or runtime animation engines.
 */

// ─── Scroll Reveal ───
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach(el => observer.observe(el));
}

// ─── Animated Counters ───
function initCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterElements.forEach(el => {
    if (el.dataset.static === 'true') return; // Skip static values like "24/7"
    observer.observe(el);
  });
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.counter);
  const suffix = el.dataset.suffix || '';
  const isDecimal = el.dataset.decimal === 'true';
  const duration = 1500; // ms
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    if (isDecimal) {
      el.textContent = current.toFixed(2) + suffix;
    } else {
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Final value
      if (isDecimal) {
        el.textContent = target.toFixed(2) + suffix;
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }
  }

  requestAnimationFrame(update);
}

// ─── Scroll-to-Top Button ───
function initScrollToTop() {
  const btn = document.getElementById('scroll-top-btn');
  if (!btn) return;

  function updateVisibility() {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  // Passive scroll listener for performance
  window.addEventListener('scroll', updateVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  updateVisibility();
}

// ─── Active Nav Link Tracking ───
function initNavTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '-80px 0px -40% 0px',
    }
  );

  sections.forEach(section => observer.observe(section));
}

// ─── Testimonial Slider ───
function initTestimonialSlider() {
  const slider = document.getElementById('testimonials-slider');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');

  if (!slider || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  const cards = slider.querySelectorAll('.testimonial-card');
  const totalCards = cards.length;

  function getCardWidth() {
    if (!cards.length) return 0;
    const card = cards[0];
    const style = getComputedStyle(card);
    const gap = parseInt(getComputedStyle(slider).gap) || 32;
    return card.offsetWidth + gap;
  }

  function getMaxIndex() {
    const containerWidth = slider.parentElement.offsetWidth;
    const cardWidth = getCardWidth();
    if (cardWidth === 0) return 0;
    const visibleCards = Math.max(1, Math.floor(containerWidth / cardWidth));
    return Math.max(0, totalCards - visibleCards);
  }

  function slideTo(index) {
    const maxIdx = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, maxIdx));
    const offset = currentIndex * getCardWidth();
    slider.style.transform = `translateX(-${offset}px)`;
    slider.style.transition = 'transform 350ms ease-in-out';
  }

  let autoSlideInterval;

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
      const maxIdx = getMaxIndex();
      if (currentIndex >= maxIdx) {
        slideTo(0);
      } else {
        slideTo(currentIndex + 1);
      }
    }, 5000);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  }

  prevBtn.addEventListener('click', () => {
    slideTo(currentIndex - 1);
    startAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    slideTo(currentIndex + 1);
    startAutoSlide();
  });

  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);

  // Keyboard navigation for accessibility (when testimonials section is focused or in view)
  document.addEventListener('keydown', (e) => {
    const rect = slider.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inViewport) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      slideTo(currentIndex - 1);
      startAutoSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      slideTo(currentIndex + 1);
      startAutoSlide();
    }
  });

  // Reset on resize
  window.addEventListener('resize', () => {
    slideTo(Math.min(currentIndex, getMaxIndex()));
  });

  // Start auto slide
  startAutoSlide();
}

// ─── Interactive AI Demo Chat Sandbox ───
function initDemoChat() {
  const chatContainer = document.querySelector('.demo-chat');
  const inputField = document.getElementById('demo-input-field');
  const sendBtn = document.getElementById('demo-send-btn');
  
  if (!chatContainer || !inputField || !sendBtn) return;

  const initialAIMsg = chatContainer.querySelector('.chat-msg--ai');
  if (!initialAIMsg) return;
  
  const initialAIHTML = initialAIMsg.querySelector('.chat-bubble').innerHTML;
  
  // Hide the initial AI bubble text initially
  const initialBubble = initialAIMsg.querySelector('.chat-bubble');
  initialBubble.style.opacity = '0';
  
  let initialTriggered = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !initialTriggered) {
        initialTriggered = true;
        // Make AI msg card visible but run sequence inside
        initialBubble.style.opacity = '1';
        simulateAISequence(initialAIMsg, initialAIHTML);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(chatContainer);

  function simulateAISequence(msgElement, finalHTML, customPrompt = '') {
    const bubble = msgElement.querySelector('.chat-bubble');
    if (!bubble) return;

    // Save classes
    const originalClasses = bubble.className;

    // Show step sequence
    bubble.className = 'chat-bubble chat-bubble--status';
    bubble.innerHTML = `<span class="status-step active">Analyzing prompt...</span>`;
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const steps = [
      'Generating components...',
      'Optimizing layout...',
      'Complete ✓'
    ];

    let stepIdx = 0;
    
    function runNextStep() {
      if (stepIdx < steps.length) {
        setTimeout(() => {
          const stepText = steps[stepIdx];
          bubble.innerHTML = `<span class="status-step active">${stepText}</span>`;
          chatContainer.scrollTop = chatContainer.scrollHeight;
          stepIdx++;
          runNextStep();
        }, 700);
      } else {
        // Show final output
        setTimeout(() => {
          bubble.className = originalClasses;
          if (customPrompt) {
            bubble.innerHTML = `
              <p>I have built an optimized prototype for your request: "<strong>${customPrompt}</strong>". Here is the generated component:</p>
              <div class="chat-code-block">
                <code>// Aurora Code Pilot 2.4 - Generated Output
import React from 'react';

export default function CustomApp() {
  return (
    &lt;div className="p-8 bg-oceanic-noir text-white rounded-2xl border border-mystic-mint"&gt;
      &lt;h3 className="text-xl font-bold"&gt;Custom Workspace Enabled&lt;/h3&gt;
      &lt;p className="mt-2 text-sm text-gray-400"&gt;Generated dynamically for: ${customPrompt}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code>
              </div>
            `;
          } else {
            bubble.innerHTML = finalHTML;
          }
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 500);
      }
    }

    runNextStep();
  }

  function handleSendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    inputField.value = '';

    // Create user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg chat-msg--user';
    userMsg.innerHTML = `<div class="chat-bubble">${text}</div>`;
    chatContainer.appendChild(userMsg);

    // Create placeholder AI message
    const aiMsg = document.createElement('div');
    aiMsg.className = 'chat-msg chat-msg--ai';
    aiMsg.innerHTML = `<div class="chat-bubble"></div>`;
    chatContainer.appendChild(aiMsg);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Simulate AI sequence after short delay
    setTimeout(() => {
      simulateAISequence(aiMsg, '', text);
    }, 400);
  }

  sendBtn.addEventListener('click', handleSendMessage);
  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });
}

// ─── Export ───
export function initAnimations() {
  initScrollReveal();
  initCounters();
  initScrollToTop();
  initNavTracking();
  initTestimonialSlider();
  initDemoChat();
}
