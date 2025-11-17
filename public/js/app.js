// VIDA Travel - Enhanced Interactive Journey Application
// Modern, Gamified User Experience

const FUNCTIONS_BASE_URL = 'https://us-central1-vida-travel-vacation-credit.cloudfunctions.net';

// Global state
const appState = {
  currentStep: 1,
  selectedDestination: null,
  adults: 2,
  children: 0,
  salary: 0,
  weeklyDeposit: 0,
  checkInDate: null,
  checkOutDate: null,
  destinationData: null
};

// Component instances
let destinationSelector;
let datePicker;
let financialCalculator;
let financialVisualizer;

// ============================================
// Analytics & Tracking
// ============================================

function trackEvent(eventName, eventParams = {}) {
  const lang = window.i18n?.getLanguage() || 'es-MX';
  const paramsWithLang = { ...eventParams, language: lang };
  
  try {
    if (window.firebaseAnalytics && window.firebaseLogEvent) {
      window.firebaseLogEvent(window.firebaseAnalytics, eventName, paramsWithLang);
    }
  } catch (e) {
    console.warn('Firebase Analytics error:', e);
  }
  
  try {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, paramsWithLang);
    }
  } catch (e) {
    console.warn('Google Analytics error:', e);
  }
  
  try {
    if (typeof fbq !== 'undefined') {
      fbq('track', eventName, paramsWithLang);
    }
  } catch (e) {
    console.warn('Meta Pixel error:', e);
  }
  
  console.log('Event tracked:', eventName, paramsWithLang);
}

// ============================================
// Initialization
// ============================================

function initWhenReady() {
  if (typeof window.i18n === 'undefined' || 
      typeof window.DestinationSelector === 'undefined' ||
      typeof window.FinancialCalculator === 'undefined' ||
      typeof window.FinancialVisualizer === 'undefined') {
    setTimeout(initWhenReady, 100);
    return;
  }
  
  trackEvent('page_load', {
    page_title: 'VIDA Travel Landing Page',
    page_location: window.location.href
  });
  
  initializeApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWhenReady);
} else {
  initWhenReady();
}

function initializeApp() {
  initializeLanguageToggle();
  initializeHeroSection();
  initializeJourneyFlow();
  initializeChatSection();
  initializeScrollProgress();
  initializeFloatingChatButton();
}

// ============================================
// Language Toggle
// ============================================

function initializeLanguageToggle() {
  const langButtons = document.querySelectorAll('.lang-btn');
  const currentLang = window.i18n?.getLanguage() || 'es-MX';
  
  langButtons.forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newLang = btn.getAttribute('data-lang');
      if (window.i18n) {
        window.i18n.setLanguage(newLang);
        langButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.documentElement.lang = newLang === 'es-MX' ? 'es-MX' : 'en-US';
        
        trackEvent('language_changed', { new_language: newLang });
      }
    });
  });
}

// ============================================
// Hero Section
// ============================================

function initializeHeroSection() {
  const startJourneyBtn = document.getElementById('start-journey-btn');
  if (startJourneyBtn) {
    startJourneyBtn.addEventListener('click', () => {
      trackEvent('hero_cta_click');
      scrollToJourney();
    });
  }
}

function scrollToJourney() {
  const journeySection = document.getElementById('journey');
  if (journeySection) {
    journeySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ============================================
// Journey Flow - Step by Step
// ============================================

function initializeJourneyFlow() {
  // Initialize destination selector
  initializeDestinationStep();
  
  // Initialize family composition counters
  initializeFamilyStep();
  
  // Initialize financial inputs
  initializeFinancialStep();
  
  // Initialize date picker
  initializeDateStep();
  
  // Initialize form submission
  initializeFormSubmission();
  
  // Initialize step navigation
  initializeStepNavigation();
}

// Step 1: Destination Selection
function initializeDestinationStep() {
  const container = document.getElementById('destination-selector-container');
  if (!container) return;
  
  destinationSelector = new DestinationSelector('destination-selector-container', (destId) => {
    appState.selectedDestination = destId;
    appState.destinationData = destinationSelector.getDestinationData(destId);
    
    // Enable next button
    const nextBtn = document.querySelector('[data-step="1"] .btn-next');
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.classList.add('pulse-animation');
    }
    
    trackEvent('destination_selected', { destination: destId });
    
    // Celebrate selection
    celebrateSelection();
  });
}

// Step 2: Family Composition
function initializeFamilyStep() {
  const counterButtons = document.querySelectorAll('.counter-btn');
  
  counterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const target = btn.getAttribute('data-target');
      const input = document.getElementById(target);
      
      if (!input) return;
      
      let currentValue = parseInt(input.value);
      const min = parseInt(input.min);
      const max = parseInt(input.max);
      
      if (action === 'increase' && currentValue < max) {
        currentValue++;
        playSound('click');
      } else if (action === 'decrease' && currentValue > min) {
        currentValue--;
        playSound('click');
      }
      
      input.value = currentValue;
      appState[target] = currentValue;
      
      // Animate the change
      animateNumberChange(input);
      
      trackEvent('family_composition_changed', {
        type: target,
        value: currentValue
      });
    });
  });
}

// Step 3: Financial Information
function initializeFinancialStep() {
  const salaryInput = document.getElementById('salary');
  const depositInput = document.getElementById('deposit-amount');
  
  financialCalculator = new FinancialCalculator('salary', 'deposit-amount', (validation) => {
    appState.salary = parseFloat(salaryInput?.value || 0);
    appState.weeklyDeposit = parseFloat(depositInput?.value || 0);
    
    updateFinancialVisualizer();
    
    const nextBtn = document.querySelector('[data-step="3"] .btn-next');
    if (nextBtn) {
      nextBtn.disabled = !validation.isValid;
    }
  });
  
  // Real-time updates
  if (salaryInput) {
    salaryInput.addEventListener('input', debounce(() => {
      appState.salary = parseFloat(salaryInput.value || 0);
      updateFinancialVisualizer();
    }, 500));
  }
  
  if (depositInput) {
    depositInput.addEventListener('input', debounce(() => {
      appState.weeklyDeposit = parseFloat(depositInput.value || 0);
      updateFinancialVisualizer();
    }, 500));
  }
  
  // Initialize visualizer
  financialVisualizer = new FinancialVisualizer('financial-visualizer-container');
}

// Step 4: Date Selection
function initializeDateStep() {
  const startInput = document.getElementById('travel-start');
  const endInput = document.getElementById('travel-end');
  
  if (startInput && endInput) {
    startInput.addEventListener('change', () => {
      appState.checkInDate = startInput.value;
      validateDates();
    });
    
    endInput.addEventListener('change', () => {
      appState.checkOutDate = endInput.value;
      validateDates();
    });
  }
  
  datePicker = new DatePicker('travel-start', 'travel-end', (dates) => {
    appState.checkInDate = dates.checkIn;
    appState.checkOutDate = dates.checkOut;
  });
}

// ============================================
// Step Navigation
// ============================================

function initializeStepNavigation() {
  // Next buttons
  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.getAttribute('data-next-step'));
      goToStep(nextStep);
    });
  });
  
  // Back buttons
  document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
      const prevStep = parseInt(btn.getAttribute('data-prev-step'));
      goToStep(prevStep);
    });
  });
}

function goToStep(stepNumber) {
  // Hide current step
  const currentStepEl = document.querySelector(`.journey-step[data-step="${appState.currentStep}"]`);
  if (currentStepEl) {
    currentStepEl.classList.remove('active');
  }
  
  // Show new step
  const newStepEl = document.querySelector(`.journey-step[data-step="${stepNumber}"]`);
  if (newStepEl) {
    newStepEl.classList.add('active');
    newStepEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  // Update step progress indicator
  updateStepProgress(stepNumber);
  
  // Update state
  appState.currentStep = stepNumber;
  
  // Update top progress bar
  updateTopProgress();
  
  // Track step change
  trackEvent('journey_step_changed', { step: stepNumber });
  
  // Trigger confetti for completed steps
  if (stepNumber > 1) {
    triggerMicroCelebration();
  }
}

function updateStepProgress(currentStep) {
  document.querySelectorAll('.step-item').forEach((item, index) => {
    const step = index + 1;
    const circle = item.querySelector('.step-circle');
    
    if (step < currentStep) {
      item.classList.add('completed');
      item.classList.remove('active');
    } else if (step === currentStep) {
      item.classList.add('active');
      item.classList.remove('completed');
    } else {
      item.classList.remove('active', 'completed');
    }
  });
  
  // Update step lines
  document.querySelectorAll('.step-line').forEach((line, index) => {
    if (index < currentStep - 1) {
      line.classList.add('completed');
    } else {
      line.classList.remove('completed');
    }
  });
}

// ============================================
// Financial Visualizer Updates
// ============================================

function updateFinancialVisualizer() {
  if (!financialVisualizer || !appState.selectedDestination) return;
  
  financialVisualizer.updateData({
    destination: appState.destinationData,
    salary: appState.salary,
    weeklyDeposit: appState.weeklyDeposit,
    adults: appState.adults,
    children: appState.children
  });
}

// ============================================
// Date Validation
// ============================================

function validateDates() {
  if (!appState.checkInDate || !appState.checkOutDate) return;
  
  const validationEl = document.getElementById('date-validation-message');
  if (!validationEl) return;
  
  const checkIn = new Date(appState.checkInDate);
  const checkOut = new Date(appState.checkOutDate);
  const today = new Date();
  
  // Calculate earliest possible date based on savings
  const earliestDate = calculateEarliestDepartureDate();
  
  if (checkIn >= earliestDate && checkOut > checkIn) {
    validationEl.className = 'date-validation success';
    validationEl.innerHTML = `✅ ¡Perfecto! Tus fechas son viables. Podrás viajar en estas fechas.`;
  } else if (checkIn < earliestDate) {
    const formattedDate = earliestDate.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    validationEl.className = 'date-validation warning';
    validationEl.innerHTML = `⚠️ Necesitas más tiempo para ahorrar. Tu fecha de salida garantizada es: <strong>${formattedDate}</strong>`;
  }
}

function calculateEarliestDepartureDate() {
  if (!appState.destinationData || !appState.weeklyDeposit) {
    return new Date();
  }
  
  const avgPrice = (appState.destinationData.priceRange.min + appState.destinationData.priceRange.max) / 2;
  const totalPrice = (appState.adults * avgPrice) + (appState.children * avgPrice * 0.25);
  const savingsTarget = totalPrice * 0.8;
  const weeksToSave = Math.ceil(savingsTarget / appState.weeklyDeposit);
  
  const today = new Date();
  const earliestDate = new Date(today);
  earliestDate.setDate(earliestDate.getDate() + (weeksToSave * 7));
  
  return earliestDate;
}

// ============================================
// Form Submission
// ============================================

function initializeFormSubmission() {
  const form = document.getElementById('journey-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await submitJourney();
  });
}

async function submitJourney() {
  const submitBtn = document.getElementById('submit-journey-btn');
    const lang = window.i18n?.getLanguage() || 'es-MX';
    
  // Validation
  if (!appState.selectedDestination || !appState.salary || !appState.weeklyDeposit) {
    alert(lang === 'es-MX' ? 'Por favor completa todos los campos' : 'Please complete all fields');
      return;
    }
    
  if (!appState.checkInDate || !appState.checkOutDate) {
    alert(lang === 'es-MX' ? 'Por favor selecciona fechas de viaje' : 'Please select travel dates');
      return;
    }
    
  // Show loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>⏳ Calculando...</span>';
  }
  
  trackEvent('journey_submitted', {
    destination: appState.selectedDestination,
    adults: appState.adults,
    children: appState.children,
    salary: appState.salary,
    weekly_deposit: appState.weeklyDeposit
  });
  
  try {
    const formData = {
      destination: appState.selectedDestination,
      checkIn: appState.checkInDate,
      checkOut: appState.checkOutDate,
      adults: appState.adults,
      children: appState.children,
      monthlySalary: appState.salary,
      weeklyDeposit: appState.weeklyDeposit,
      language: lang,
      userId: getUserId(),
      sessionId: getSessionId(),
      experimentVariantId: getExperimentVariantId()
    };
    
      const response = await fetch(`${FUNCTIONS_BASE_URL}/simulateVacationCredit`, {
        method: 'POST',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
      displayResults(data.simulation, lang);
      triggerCelebration();
        
      trackEvent('journey_completed', {
        destination: appState.selectedDestination,
          loan_term: data.simulation.loanTerm,
        viable: data.simulation.selectedDatesViable
        });
        } else {
      throw new Error(data.error || 'Calculation failed');
      }
    } catch (error) {
      console.error('Error:', error);
    alert(lang === 'es-MX' 
        ? 'Ocurrió un error. Por favor intenta de nuevo.'
      : 'An error occurred. Please try again.');
    } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>✨ Calcular Mi Plan de Viaje</span>';
    }
  }
}

// ============================================
// Results Display
// ============================================

function displayResults(simulation, lang) {
  const resultsContainer = document.getElementById('results-container');
  const resultsContent = document.getElementById('results-content');
  
  if (!resultsContainer || !resultsContent) return;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const guaranteedDate = new Date(simulation.guaranteedDepartureDate);
  const formattedDate = guaranteedDate.toLocaleDateString(lang === 'es-MX' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  resultsContent.innerHTML = `
    <div class="results-grid">
      <div class="result-card highlight">
        <h4>💰 Precio Total</h4>
        <div class="value">${formatCurrency(simulation.totalPrice)}</div>
      </div>
      
      <div class="result-card">
        <h4>🏦 Tu Ahorro (80%)</h4>
        <div class="value">${formatCurrency(simulation.savingsTarget)}</div>
        <p style="font-size: 0.875rem; margin-top: 0.5rem;">En ${simulation.weeksToSave} semanas</p>
      </div>
      
      <div class="result-card highlight">
        <h4>🎁 Préstamo VIDA (20%)</h4>
        <div class="value">${formatCurrency(simulation.loanAmount)}</div>
        <p style="font-size: 0.875rem; margin-top: 0.5rem; font-weight: 600;">0% Interés</p>
      </div>
      
      <div class="result-card">
        <h4>📅 Plazo de Pago</h4>
        <div class="value">${simulation.loanTerm} meses</div>
      </div>
      
      <div class="result-card">
        <h4>💳 Pago Mensual</h4>
        <div class="value">${formatCurrency(simulation.monthlyPayment)}</div>
        <p style="font-size: 0.875rem; margin-top: 0.5rem;">${simulation.paymentPercentage.toFixed(1)}% de tu salario</p>
      </div>
      
      <div class="result-card ${simulation.selectedDatesViable ? 'highlight' : ''}">
        <h4>✈️ Fecha de Salida</h4>
        <div class="value" style="font-size: 1.25rem;">${formattedDate}</div>
        ${simulation.selectedDatesViable 
          ? '<p style="font-size: 0.875rem; margin-top: 0.5rem;">✅ Tus fechas son viables</p>'
          : '<p style="font-size: 0.875rem; margin-top: 0.5rem;">⚠️ Fecha garantizada</p>'
        }
      </div>
    </div>
    
    <div style="margin-top: 2rem; text-align: center;">
      <button class="cta-button" onclick="document.getElementById('enroll-btn').click()">
        <span>🎉 ¡Quiero Viajar!</span>
        <svg class="arrow-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  `;
  
  resultsContainer.style.display = 'block';
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================
// Chat Section
// ============================================

function initializeChatSection() {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-chat-btn');
  const chatMessages = document.getElementById('chat-messages');
  
  if (!chatInput || !sendBtn || !chatMessages) return;
  
  let conversationHistory = [];
  
  const welcomeMsg = window.i18n?.t('chat.welcome') || 
    '¡Hola! 👋 Estoy aquí para ayudarte a planear tus vacaciones con VIDA. ¿En qué puedo ayudarte?';
  addChatMessage('assistant', welcomeMsg);
  
  sendBtn.addEventListener('click', () => sendChatMessage());
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });
  
  async function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    const lang = window.i18n?.getLanguage() || 'es-MX';
    
    addChatMessage('user', message);
    chatInput.value = '';
    
    trackEvent('chat_message_sent', { source: 'section' });
    
    // Show typing indicator
    const typingId = addChatMessage('assistant', '...');
    
    try {
      const response = await fetch(`${FUNCTIONS_BASE_URL}/chatAgent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationHistory,
          userId: getUserId(),
          sessionId: getSessionId(),
          language: lang
        })
      });
      
      const data = await response.json();
      
      // Remove typing indicator
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();
      
      if (data.success) {
        addChatMessage('assistant', data.message);
        conversationHistory.push(
          { role: 'user', content: message },
          { role: 'assistant', content: data.message }
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();
      
      const errorMsg = lang === 'es-MX'
        ? 'Lo siento, hubo un error. Por favor intenta de nuevo.'
        : 'Sorry, there was an error. Please try again.';
      addChatMessage('assistant', errorMsg);
    }
  }
  
  function addChatMessage(role, content) {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const messageDiv = document.createElement('div');
    messageDiv.id = messageId;
    messageDiv.className = `chat-message ${role}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageId;
  }
}

// ============================================
// Floating Chat Button
// ============================================

function initializeFloatingChatButton() {
  const floatingBtn = document.getElementById('floating-chat-btn');
  if (floatingBtn) {
    floatingBtn.addEventListener('click', () => {
      const chatSection = document.getElementById('chat');
      if (chatSection) {
        chatSection.scrollIntoView({ behavior: 'smooth' });
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
          setTimeout(() => chatInput.focus(), 500);
        }
      }
    });
  }
}

// ============================================
// Scroll Progress
// ============================================

function initializeScrollProgress() {
  window.addEventListener('scroll', updateTopProgress);
}

function updateTopProgress() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  
  const progressBar = document.getElementById('journey-progress');
  if (progressBar) {
    progressBar.style.width = scrolled + '%';
  }
}

// ============================================
// Enrollment Button
// ============================================

const enrollBtn = document.getElementById('enroll-btn');
if (enrollBtn) {
  enrollBtn.addEventListener('click', () => {
    const lang = window.i18n?.getLanguage() || 'es-MX';
    trackEvent('enrollment_clicked');
    
    const msg = lang === 'es-MX'
      ? '🎉 ¡Genial! Pronto estarás viajando con VIDA. Redirigiendo...'
      : '🎉 Great! You\'ll soon be traveling with VIDA. Redirecting...';
    alert(msg);
  });
}

// ============================================
// Animations & Celebrations
// ============================================

function celebrateSelection() {
  playSound('success');
  triggerMicroCelebration();
}

function triggerMicroCelebration() {
  // Create small confetti effect
  const colors = ['#667eea', '#764ba2', '#f093fb', '#fee140'];
  for (let i = 0; i < 5; i++) {
    createConfetti(colors[Math.floor(Math.random() * colors.length)]);
  }
}

function triggerCelebration() {
  playSound('celebration');
  // Create larger confetti effect
  const colors = ['#667eea', '#764ba2', '#f093fb', '#fee140', '#fa709a'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      createConfetti(colors[Math.floor(Math.random() * colors.length)]);
    }, i * 50);
  }
}

function createConfetti(color) {
  const confetti = document.createElement('div');
  confetti.style.cssText = `
    position: fixed;
    width: 10px;
    height: 10px;
    background: ${color};
    top: -10px;
    left: ${Math.random() * 100}vw;
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
  `;
  
  document.body.appendChild(confetti);
  
  setTimeout(() => confetti.remove(), 4000);
}

function animateNumberChange(element) {
  element.style.transform = 'scale(1.2)';
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, 200);
}

function playSound(type) {
  // Placeholder for sound effects
  // Could integrate Web Audio API for click, success, and celebration sounds
  console.log(`Sound: ${type}`);
}

// ============================================
// Utility Functions
// ============================================

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function getUserId() {
  if (window.firebaseAuth && window.firebaseAuth.currentUser) {
    return window.firebaseAuth.currentUser.uid;
  }
  return getSessionId();
}

function getSessionId() {
  let sessionId = sessionStorage.getItem('vida_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('vida_session_id', sessionId);
  }
  return sessionId;
}

function getExperimentVariantId() {
    return sessionStorage.getItem('experiment_variant_id') || 'control';
  }

// ============================================
// Experiment Variant (A/B Testing)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const variantId = assignExperimentVariant();
  sessionStorage.setItem('experiment_variant_id', variantId);
});

function assignExperimentVariant() {
  const variants = ['control', 'variant_a', 'variant_b'];
  const random = Math.random();
  if (random < 0.33) return 'control';
  if (random < 0.66) return 'variant_a';
  return 'variant_b';
}

// Add confetti animation to CSS if not already present
const appStyle = document.createElement('style');
appStyle.textContent = `
  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
  
  .pulse-animation {
    animation: pulse 1s ease-in-out 3;
  }
`;
document.head.appendChild(appStyle);

console.log('✨ VIDA Travel - Interactive Journey Initialized');
