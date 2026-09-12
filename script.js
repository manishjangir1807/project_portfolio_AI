/**
 * Manish Jangir - Portfolio Website Core JavaScript
 * Features: Brute Force Simulator, AI Selector, Lightbox Modal, Copy-to-Clipboard & Mobile Nav
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollSpy();
  initBruteForceSimulator();
  initAiRecommender();
  initAiFilterTabs();
  initCertificateModal();
  initClipboardButtons();
  initContactForm();
});

/* -------------------------------------------------------------
   1. Mobile Navigation
   ------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen ? '✕' : '☰';
  });

  // Close menu when link clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggleBtn.innerHTML = '☰';
    });
  });
}

/* -------------------------------------------------------------
   2. Scroll Spy & Smooth Active Nav Tracking
   ------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
   3. Interactive Brute Force Defense Simulator
   ------------------------------------------------------------- */
function initBruteForceSimulator() {
  const attackBtn = document.getElementById('simAttackBtn');
  const resetBtn = document.getElementById('simResetBtn');
  const inputPwd = document.getElementById('simPasswordInput');
  const terminal = document.getElementById('simTerminal');
  const statusBadge = document.getElementById('simStatusBadge');
  const attemptsMetric = document.getElementById('metricAttempts');
  const latencyMetric = document.getElementById('metricLatency');
  const defenseMetric = document.getElementById('metricDefense');

  if (!attackBtn || !terminal) return;

  let attemptCount = 0;
  let simulatedLatency = 120; // base ms
  let isQuarantined = false;

  const passwords = ['admin123', 'password', 'qwerty2026', 'letmein123!', 'masterkey', 'rootadmin'];

  function logMessage(text, type = 'info') {
    const timeStr = new Date().toTimeString().split(' ')[0];
    const line = document.createElement('div');
    line.className = `terminal-line log-${type}`;
    line.textContent = `[${timeStr}] ${text}`;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
  }

  attackBtn.addEventListener('click', () => {
    if (isQuarantined) return;

    attemptCount++;
    attemptsMetric.textContent = attemptCount;

    // Pick simulated password if empty
    const currentAttemptPassword = inputPwd.value.trim() || passwords[(attemptCount - 1) % passwords.length];
    inputPwd.value = currentAttemptPassword;

    attackBtn.disabled = true;
    attackBtn.textContent = 'Processing request...';

    // Simulate progressive delay (tarpitting)
    if (attemptCount <= 2) {
      simulatedLatency = 120 + Math.floor(Math.random() * 40);
    } else if (attemptCount <= 4) {
      simulatedLatency = 650 + (attemptCount * 250);
    } else if (attemptCount <= 6) {
      simulatedLatency = 1800 + (attemptCount * 400);
    } else {
      simulatedLatency = 3200;
    }

    latencyMetric.textContent = `${simulatedLatency}ms`;

    setTimeout(() => {
      // Evaluate Security State
      if (attemptCount <= 2) {
        logMessage(`POST /api/v1/auth/login [Attempt ${attemptCount}] - HTTP 401 Invalid credentials (pw: "${currentAttemptPassword}")`, 'info');
        statusBadge.className = 'sim-status status-active-secure';
        statusBadge.textContent = 'SECURE / NORMAL';
        defenseMetric.textContent = 'Standard Auth';
      } else if (attemptCount <= 4) {
        logMessage(`[RATE-LIMIT TRIGGER] Rapid attempts detected from 192.168.1.104. Imposing progressive delay (+${simulatedLatency}ms).`, 'warn');
        statusBadge.className = 'sim-status status-active-warn';
        statusBadge.textContent = 'SUSPICIOUS (RATE-LIMITING)';
        defenseMetric.textContent = 'Progressive Delay';
      } else if (attemptCount <= 6) {
        logMessage(`[CHALLENGE ENFORCED] High-frequency credential stuffing signature. Cloudflare Turnstile CAPTCHA challenge spawned!`, 'warn');
        statusBadge.className = 'sim-status status-active-warn';
        statusBadge.textContent = 'BOT CHALLENGE REQUIRED';
        defenseMetric.textContent = 'CAPTCHA Escalation';
      } else {
        // Quarantine / Lockout
        isQuarantined = true;
        logMessage(`[CRITICAL] Max threshold exceeded (7 attempts). Fail2Ban IP Quarantine activated!`, 'danger');
        logMessage(`[BLOCKED] IP 192.168.1.104 blacklisted for 3600 seconds. WAF Dropped Connection.`, 'danger');
        statusBadge.className = 'sim-status status-active-danger';
        statusBadge.textContent = 'IP QUARANTINE / BLOCKED';
        defenseMetric.textContent = 'WAF & Fail2Ban IP Block';
        attackBtn.textContent = '⛔ Connection Dropped (IP Blacklisted)';
        showToast('Security Alert: IP address quarantined due to automated brute force pattern.');
        return;
      }

      attackBtn.disabled = false;
      attackBtn.textContent = '⚡ Simulate Login Attempt';
      inputPwd.value = passwords[attemptCount % passwords.length];
    }, simulatedLatency);
  });

  resetBtn.addEventListener('click', () => {
    attemptCount = 0;
    simulatedLatency = 120;
    isQuarantined = false;

    attemptsMetric.textContent = '0';
    latencyMetric.textContent = '120ms';
    defenseMetric.textContent = 'Active Monitoring';

    statusBadge.className = 'sim-status status-active-secure';
    statusBadge.textContent = 'SECURE / NORMAL';

    attackBtn.disabled = false;
    attackBtn.textContent = '⚡ Simulate Login Attempt';
    inputPwd.value = '';

    terminal.innerHTML = '';
    logMessage('WAF security engine reset to idle. Listening for inbound traffic...', 'success');
    showToast('Brute force defense simulator reset to initial state.');
  });
}

/* -------------------------------------------------------------
   4. AI Platform Suitability & Interactive Recommender
   ------------------------------------------------------------- */
const AI_DATA = {
  chatgpt: {
    name: 'OpenAI ChatGPT (GPT-4o)',
    icon: '💬',
    badge: 'Versatile Generalist & Code',
    desc: 'Excels in natural conversational flow, multifaceted brainstorming, rapid prototyping, and broad problem-solving. Ideal for everyday software development, drafting, and ad-hoc code explanation.'
  },
  gemini: {
    name: 'Google Gemini (1.5 Pro / 2.0)',
    icon: '🌐',
    badge: 'Massive Context & Multimodal',
    desc: 'Unmatched 1M-2M+ token context window. Ingests full codebases, hours of video, or whole audio files natively. Features direct grounding in Google Search for fresh web discovery.'
  },
  claude: {
    name: 'Anthropic Claude (3.5 Sonnet)',
    icon: '⚡',
    badge: 'Complex Architecture & Technical Writing',
    desc: 'Industry benchmark for deep software refactoring, structural logic, exceptional steerability, and nuanced human-grade technical documentation with strict safety alignment.'
  },
  perplexity: {
    name: 'Perplexity AI',
    icon: '🔍',
    badge: 'Grounded Research & Live Citations',
    desc: 'The gold standard for real-time academic, investigative, and technical research. Synthesizes web sources with inline hyperlinked citations, zeroing out hallucinations.'
  },
  grok: {
    name: 'xAI Grok',
    icon: '🚀',
    badge: 'Real-Time Social Pulse & Direct Reasoning',
    desc: 'Direct pipeline into live X (Twitter) social data streams. Provides uncensored, real-time contextual perspective on breaking global events and conversational inquiry.'
  }
};

const RECOMMENDATIONS = {
  'code-audit': {
    target: 'claude',
    title: 'Top Recommendation: Anthropic Claude 3.5 Sonnet',
    rationale: 'Claude exhibits superior abstract reasoning over multi-file architectural dependencies, complex refactors, and writing rigorous unit tests with low hallucination.'
  },
  'massive-docs': {
    target: 'gemini',
    title: 'Top Recommendation: Google Gemini 1.5 / 2.0 Pro',
    rationale: 'With up to 2 million tokens of native context, Gemini can ingest your entire textbook, code repository, or multi-hour lecture video in a single prompt with needle-in-a-haystack recall.'
  },
  'research-citations': {
    target: 'perplexity',
    title: 'Top Recommendation: Perplexity AI',
    rationale: 'Combines multiple search indexes with real-time URL verification, providing concise answers with direct scholarly and web references you can audit immediately.'
  },
  'daily-assist': {
    target: 'chatgpt',
    title: 'Top Recommendation: OpenAI ChatGPT (GPT-4o)',
    rationale: 'Greatest overall ecosystem, lightning-fast voice mode, flexible custom GPTs, and seamless general-purpose workflow integration.'
  },
  'social-trends': {
    target: 'grok',
    title: 'Top Recommendation: xAI Grok',
    rationale: 'Unrivaled real-time ingestion of current social discussions, viral tech trends, and rapid community commentary without search lag.'
  }
};

function initAiRecommender() {
  const buttons = document.querySelectorAll('.recommender-btn');
  const resultCard = document.getElementById('recommendationResult');

  if (!buttons.length || !resultCard) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const caseKey = btn.getAttribute('data-case');
      const rec = RECOMMENDATIONS[caseKey];

      if (rec) {
        const modelInfo = AI_DATA[rec.target];
        resultCard.style.opacity = '0';

        setTimeout(() => {
          resultCard.innerHTML = `
            <div class="rec-badge-icon">${modelInfo.icon}</div>
            <div class="rec-content">
              <h4>${rec.title}</h4>
              <p><strong>Rationale:</strong> ${rec.rationale}</p>
              <p style="margin-top: 6px; font-size: 0.85rem; color: #22d3ee;">
                <strong>Key Strength:</strong> ${modelInfo.badge}
              </p>
            </div>
          `;
          resultCard.style.opacity = '1';

          // Highlight the respective card
          highlightAiCard(rec.target);
        }, 150);
      }
    });
  });
}

function highlightAiCard(targetId) {
  const cards = document.querySelectorAll('.ai-card');
  cards.forEach(card => {
    if (card.getAttribute('data-ai') === targetId) {
      card.style.borderColor = 'var(--accent-cyan)';
      card.style.boxShadow = '0 0 25px rgba(6, 182, 212, 0.35)';
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      card.style.borderColor = 'var(--border-subtle)';
      card.style.boxShadow = 'none';
    }
  });
}

function initAiFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const aiCards = document.querySelectorAll('.ai-card');

  if (!filterBtns.length || !aiCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      aiCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory.includes(filterCategory)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
   5. Certificate Lightbox Modal
   ------------------------------------------------------------- */
function initCertificateModal() {
  const trigger = document.getElementById('certModalTrigger');
  const modal = document.getElementById('certLightboxModal');
  const closeBtn = document.getElementById('certModalClose');

  if (!trigger || !modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', openModal);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* -------------------------------------------------------------
   6. One-Click Clipboard Copying
   ------------------------------------------------------------- */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Information';

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showCopySuccess(btn, label);
        }).catch(() => {
          fallbackCopy(textToCopy, btn, label);
        });
      } else {
        fallbackCopy(textToCopy, btn, label);
      }
    });
  });
}

function showCopySuccess(btn, label) {
  const originalHtml = btn.innerHTML;
  btn.innerHTML = `✓ Copied`;
  btn.style.color = '#34d399';
  btn.style.borderColor = '#10b981';

  showToast(`${label} copied to clipboard!`);

  setTimeout(() => {
    btn.innerHTML = originalHtml;
    btn.style.color = '';
    btn.style.borderColor = '';
  }, 2200);
}

function fallbackCopy(text, btn, label) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    showCopySuccess(btn, label);
  } catch (err) {
    showToast(`Could not copy automatically. Text: ${text}`);
  }
  document.body.removeChild(tempInput);
}

/* -------------------------------------------------------------
   7. Contact Form Interactive Handler
   ------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('senderName')?.value || 'Friend';
    const submitBtn = form.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting message...';
    }

    setTimeout(() => {
      showToast(`Thank you, ${name}! Your message has been routed to Manish.`);
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message ➔';
      }
    }, 1000);
  });
}

/* -------------------------------------------------------------
   8. Global Toast Notification System
   ------------------------------------------------------------- */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-box';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span style="color: var(--accent-cyan); font-size: 1.2rem;">✦</span>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
