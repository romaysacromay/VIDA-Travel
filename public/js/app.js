// VIDA Travel Vacation Credit Landing Page - Main JavaScript
// Bilingual support (Spanish default)

// Firebase Functions URLs
const FUNCTIONS_BASE_URL = 'https://us-central1-vida-travel-vacation-credit.cloudfunctions.net';

// Global component instances
let destinationSelector;
let datePicker;
let financialCalculator;
let financialVisualizer;

// Initialize analytics tracking
function trackEvent(eventName, eventParams = {}) {
  const lang = window.i18n?.getLanguage() || 'es-MX';
  
  // Add language to all events
  const paramsWithLang = {
    ...eventParams,
    language: lang
  };
  
  // Firebase Analytics
  try {
    if (window.firebaseAnalytics && window.firebaseLogEvent) {
      window.firebaseLogEvent(window.firebaseAnalytics, eventName, paramsWithLang);
    }
  } catch (e) {
    console.warn('Firebase Analytics error:', e);
  }
  
  // Google Analytics
  try {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, paramsWithLang);
    }
  } catch (e) {
    console.warn('Google Analytics error:', e);
  }
  
  // Meta Pixel
  try {
    if (typeof fbq !== 'undefined') {
      fbq('track', eventName, paramsWithLang);
    }
  } catch (e) {
    console.warn('Meta Pixel error:', e);
  }
  
  console.log('Event tracked:', eventName, paramsWithLang);
}

// Track page view on load - wait for all scripts to load
function initWhenReady() {
  // Check if all required modules are loaded
  if (typeof window.i18n === 'undefined' || 
      typeof window.DestinationSelector === 'undefined' ||
      typeof window.DatePicker === 'undefined' ||
      typeof window.FinancialCalculator === 'undefined' ||
      typeof window.FinancialVisualizer === 'undefined') {
    // Retry after a short delay
    setTimeout(initWhenReady, 100);
    return;
  }
  
  const lang = window.i18n?.getLanguage() || 'es-MX';
  
  trackEvent('page_load', {
    page_title: 'Vacation Credit Landing Page',
    page_location: window.location.href,
    language: lang
  });
  
  initializeComponents();
  initializeLanguageToggle();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWhenReady);
} else {
  // DOM already loaded, wait for scripts
  initWhenReady();
}

// Initialize all components
function initializeComponents() {
  // Initialize Destination Selector
  const destContainer = document.getElementById('destination-selector-container');
  if (destContainer) {
    destinationSelector = new DestinationSelector('destination-selector-container', (destId) => {
      console.log('Destination selected:', destId);
      // When destination is selected, check if we can show date picker
      checkAndShowDatePicker();
      // Update visualizer
      updateFinancialVisualizer();
    });
  }
  
  // Initialize Date Picker (hidden initially)
  datePicker = new DatePicker('travel-start', 'travel-end', (dates) => {
    console.log('Dates selected:', dates);
  });
  
  // Initialize Financial Calculator
  financialCalculator = new FinancialCalculator('salary', 'deposit-amount', (validation) => {
    console.log('Financial validation:', validation);
    // When financial inputs are ready, check if we can show date picker
    if (validation.readyForDates) {
      checkAndShowDatePicker();
    }
    
    // Update visualizer in real-time
    updateFinancialVisualizer();
  });
  
  // Initialize Financial Visualizer
  financialVisualizer = new FinancialVisualizer('financial-visualizer-container');
  
  // Update visualizer when inputs change
  const salaryInput = document.getElementById('salary');
  const depositInput = document.getElementById('deposit-amount');
  if (salaryInput) {
    salaryInput.addEventListener('input', () => {
      updateFinancialVisualizer();
    });
  }
  if (depositInput) {
    depositInput.addEventListener('input', () => {
      updateFinancialVisualizer();
    });
  }
  
  // Listen for changes in adults/children count
  const adultsSelect = document.getElementById('adults');
  const childrenInput = document.getElementById('children');
  if (adultsSelect) {
    adultsSelect.addEventListener('change', () => {
      checkAndShowDatePicker();
      updateFinancialVisualizer();
    });
  }
  if (childrenInput) {
    childrenInput.addEventListener('input', () => {
      checkAndShowDatePicker();
      updateFinancialVisualizer();
    });
    childrenInput.addEventListener('change', () => {
      checkAndShowDatePicker();
      updateFinancialVisualizer();
    });
  }
  
  // Initialize Chat Widget (already initialized by chat-widget.js)
  
  // Initialize form submission
  initializeFormSubmission();
  
  // Initialize chat section
  initializeChatSection();
  
  // Initialize enrollment button
  initializeEnrollmentButton();
  
  // Initialize hero CTA
  initializeHeroCTA();
}

// Update financial visualizer with current data
function updateFinancialVisualizer() {
  if (!financialVisualizer) return;
  
  const destination = destinationSelector?.getSelectedDestination();
  const salary = parseFloat(document.getElementById('salary')?.value || '0');
  const weeklyDeposit = parseFloat(document.getElementById('deposit-amount')?.value || '0');
  const adults = parseInt(document.getElementById('adults')?.value || '2');
  const children = parseInt(document.getElementById('children')?.value || '0');
  
  financialVisualizer.updateData({
    destination,
    salary,
    weeklyDeposit,
    adults,
    children
  });
}

// Check if we have all required info to show date picker and calculate earliest date
function checkAndShowDatePicker() {
  // Need destination, salary, and weekly deposit
  const destination = destinationSelector?.getSelectedDestination();
  const salary = parseFloat(document.getElementById('salary')?.value || '0');
  const weeklyDeposit = parseFloat(document.getElementById('deposit-amount')?.value || '0');
  const adults = parseInt(document.getElementById('adults')?.value || '2');
  const children = parseInt(document.getElementById('children')?.value || '0');
  
  if (!destination || salary <= 0 || weeklyDeposit <= 0) {
    // Hide date picker if not ready
    if (datePicker && datePicker.dateSection) {
      datePicker.dateSection.style.display = 'none';
    }
    return; // Not ready yet
  }
  
  // Get destination data to estimate price
  const destData = destinationSelector.getDestinationData(destination);
  if (!destData) return;
  
  // Use average price for estimation (we'll refine with actual pricing later)
  const avgPrice = (destData.priceRange.min + destData.priceRange.max) / 2;
  
  // Calculate total package price (simplified - using average adult price)
  // In reality, this should consider seasonal pricing, but for UI purposes, we'll use average
  const childrenPrice = avgPrice * 0.25; // 25% discount for children
  const totalPrice = (adults * avgPrice) + (children * childrenPrice);
  
  // Calculate 80% savings target
  const savingsTarget = totalPrice * 0.8;
  
  // Calculate weeks to save
  const weeksToSave = Math.ceil(savingsTarget / weeklyDeposit);
  
  // Calculate earliest departure date (today + weeks to save)
  const today = new Date();
  const earliestDate = new Date(today);
  earliestDate.setDate(earliestDate.getDate() + (weeksToSave * 7));
  
  // Show date picker with calculated earliest date
  if (datePicker) {
    datePicker.showDatePicker(earliestDate);
  }
}

// Language Toggle Handler
function initializeLanguageToggle() {
  const langButtons = document.querySelectorAll('.lang-btn');
  
  // Set active button based on current language
  const currentLang = window.i18n?.getLanguage() || 'es-MX';
  langButtons.forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Handle language toggle clicks
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const newLang = btn.getAttribute('data-lang');
      if (window.i18n) {
        window.i18n.setLanguage(newLang);
        
        // Update active button
        langButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update HTML lang attribute
        document.documentElement.lang = newLang === 'es-MX' ? 'es-MX' : 'en-US';
      }
    });
  });
}

// Simulation Form Handler
function initializeFormSubmission() {
  const simulationForm = document.getElementById('simulation-form');
  if (!simulationForm) return;
  
  simulationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const destination = destinationSelector?.getSelectedDestination();
    const dates = datePicker?.getDates();
    const adults = parseInt(document.getElementById('adults')?.value || '1');
    const children = parseInt(document.getElementById('children')?.value || '0');
    const salary = parseFloat(document.getElementById('salary')?.value || '0');
    const weeklyDeposit = parseFloat(document.getElementById('deposit-amount')?.value || '0');
    const lang = window.i18n?.getLanguage() || 'es-MX';
    
    // Validate
    if (!destination) {
      alert(window.i18n?.t('validation.required') || 'Por favor selecciona un destino');
      return;
    }
    
    if (!dates.checkIn || !dates.checkOut) {
      alert(window.i18n?.t('validation.datesRequired') || 'Por favor selecciona fechas de entrada y salida');
      return;
    }
    
    if (!financialCalculator?.validate()) {
      return;
    }
    
    // Track family composition
    trackEvent('family_composition_set', {
      adults,
      children
    });
    
    // Prepare form data
    const formData = {
      destination,
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
      adults,
      children,
      monthlySalary: salary,
      weeklyDeposit,
      language: lang,
      userId: getUserId(),
      sessionId: getSessionId(),
      experimentVariantId: getExperimentVariantId()
    };
    
    // Track search submission
    trackEvent('search_submission', {
      destination,
      adults,
      children
    });
    
    // Show loading state
    const submitBtn = document.getElementById('submit-simulation-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = window.i18n?.t('simulator.submitting') || 'Calculando...';
    
    try {
      const response = await fetch(`${FUNCTIONS_BASE_URL}/simulateVacationCredit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        displaySimulationResults(data.simulation, lang);
        
        // Track simulation completion
        trackEvent('simulation_viewed', {
          destination,
          loan_term: data.simulation.loanTerm,
          payment_percentage: data.simulation.paymentPercentage,
          dates_viable: data.simulation.selectedDatesViable
        });
        
        if (data.simulation.selectedDatesViable) {
          trackEvent('dates_guaranteed', { destination });
        } else {
          trackEvent('dates_not_guaranteed', { destination });
        }
      } else {
        const errorMsg = lang === 'es-MX' 
          ? 'Error: ' + (data.error || 'No se pudo calcular el crédito de vacaciones')
          : 'Error: ' + (data.error || 'Failed to calculate vacation credit');
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = lang === 'es-MX'
        ? 'Ocurrió un error. Por favor intenta de nuevo.'
        : 'An error occurred. Please try again.';
      alert(errorMsg);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Display simulation results with enhanced dashboard
function displaySimulationResults(simulation, lang) {
  const resultsDiv = document.getElementById('simulation-results');
  const resultsContent = document.getElementById('results-content');
  
  if (!resultsDiv || !resultsContent) return;
  
  const i18n = window.i18n;
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Determine payment indicator color
  let paymentIndicatorClass = 'green';
  if (simulation.paymentPercentage > 15) {
    paymentIndicatorClass = 'red';
  } else if (simulation.paymentPercentage > 12) {
    paymentIndicatorClass = 'yellow';
  }
  
  // Format dates
  const checkInDate = new Date(simulation.checkIn);
  const guaranteedDate = new Date(simulation.guaranteedDepartureDate);
  const formattedGuaranteedDate = guaranteedDate.toLocaleDateString(lang === 'es-MX' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  resultsContent.innerHTML = `
    <div class="results-grid">
      <div class="result-card">
        <h4>${i18n?.t('results.totalPrice') || 'Precio Total del Paquete'}</h4>
        <div class="value">${formatCurrency(simulation.totalPrice)}</div>
      </div>
      
      <div class="result-card">
        <h4>${i18n?.t('results.savingsTarget') || 'Meta de Ahorro (80%)'}</h4>
        <div class="value">${formatCurrency(simulation.savingsTarget)}</div>
      </div>
      
      <div class="result-card">
        <h4>${i18n?.t('results.weeksToSave') || 'Semanas para ahorrar 80%'}</h4>
        <div class="value">${simulation.weeksToSave}</div>
      </div>
      
      <div class="result-card zero-interest">
        <h4>${i18n?.t('results.loanAmount') || 'Monto del préstamo (hasta 20%)'}</h4>
        <div class="value">${formatCurrency(simulation.loanAmount)}</div>
        <div style="margin-top: 0.5rem; font-size: 0.9rem;">
          ${i18n?.t('results.zeroInterest') || '(0% de interés)'}
        </div>
      </div>
      
      <div class="result-card">
        <h4>${i18n?.t('results.loanTerm') || 'Plazo del préstamo'}</h4>
        <div class="value">${simulation.loanTerm} ${lang === 'es-MX' ? 'meses' : 'months'}</div>
      </div>
      
      <div class="result-card">
        <h4>${i18n?.t('results.monthlyPayment') || 'Tu pago mensual será'}</h4>
        <div class="value">${formatCurrency(simulation.monthlyPayment)}</div>
        <div class="payment-indicator ${paymentIndicatorClass}">
          ${simulation.paymentPercentage.toFixed(1)}% ${i18n?.t('results.monthlyPaymentOf') || 'de tu salario de'} ${formatCurrency(simulation.monthlySalary)}
        </div>
      </div>
      
      <div class="result-card zero-interest">
        <h4>${i18n?.t('results.totalToPay') || 'Total a pagar'}</h4>
        <div class="value">${formatCurrency(simulation.loanAmount)}</div>
        <div style="margin-top: 0.5rem; font-size: 0.9rem;">
          ${i18n?.t('results.zeroInterest') || '(0% de interés)'}
        </div>
      </div>
      
      <div class="result-card">
        <h4>${i18n?.t('results.guaranteedDate') || 'Fecha de salida garantizada'}</h4>
        <div class="value">${formattedGuaranteedDate}</div>
      </div>
    </div>
    
    <div class="feasibility-status ${simulation.selectedDatesViable ? 'guaranteed' : 'not-guaranteed'}">
      ${simulation.selectedDatesViable 
        ? (i18n?.t('results.datesGuaranteed') || 'Tus fechas seleccionadas son viables')
        : (i18n?.t('results.datesNotGuaranteed') || 'Tus fechas seleccionadas no son viables. Fecha garantizada:') + ' ' + formattedGuaranteedDate
      }
      ${!simulation.selectedDatesViable 
        ? '<div style="margin-top: 0.5rem; font-size: 0.9rem;">' + (i18n?.t('results.suggestIncreaseDeposit') || 'Sugerencia: Aumenta tu depósito semanal o elige un destino más económico') + '</div>'
        : ''
      }
    </div>
  `;
  
  resultsDiv.style.display = 'block';
  resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Chat Section Handler
function initializeChatSection() {
  const chatInput = document.getElementById('chat-input');
  const sendChatBtn = document.getElementById('send-chat-btn');
  const chatMessages = document.getElementById('chat-messages');
  
  if (!chatInput || !sendChatBtn || !chatMessages) return;
  
  let conversationHistory = [];
  
  // Show welcome message
  const welcomeMsg = window.i18n?.t('chat.welcome') || 
                    '¡Hola! Estoy aquí para ayudarte a planear tus vacaciones con el programa 0% interés de VIDA';
  addChatMessage('assistant', welcomeMsg);
  
  sendChatBtn.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  });
  
  async function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    const lang = window.i18n?.getLanguage() || 'es-MX';
    
    // Display user message
    addChatMessage('user', message);
    chatInput.value = '';
    
    // Track chat message
    trackEvent('chat_message_sent', {
      source: 'section',
      language: lang
    });
    
    try {
      const response = await fetch(`${FUNCTIONS_BASE_URL}/chatAgent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          conversationHistory,
          userId: getUserId(),
          sessionId: getSessionId(),
          language: lang
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        addChatMessage('assistant', data.message);
        conversationHistory.push(
          { role: 'user', content: message },
          { role: 'assistant', content: data.message }
        );
      } else {
        const errorMsg = lang === 'es-MX'
          ? 'Lo siento, encontré un error. Por favor intenta de nuevo.'
          : 'I apologize, but I encountered an error. Please try again.';
        addChatMessage('assistant', errorMsg);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = lang === 'es-MX'
        ? 'Lo siento, encontré un error. Por favor intenta de nuevo.'
        : 'I apologize, but I encountered an error. Please try again.';
      addChatMessage('assistant', errorMsg);
    }
  }
  
  function addChatMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

// Enrollment Button Handler
function initializeEnrollmentButton() {
  const enrollBtn = document.getElementById('enroll-btn');
  if (!enrollBtn) return;
  
  enrollBtn.addEventListener('click', () => {
    const lang = window.i18n?.getLanguage() || 'es-MX';
    
    // Track "Pay my enrolment fee" click
    trackEvent('enrollment_fee_click', {
      experiment_variant_id: getExperimentVariantId(),
      language: lang
    });
    
    // Redirect to enrollment page or handle enrollment
    const msg = lang === 'es-MX'
      ? 'Redirigiendo a la página de inscripción...'
      : 'Redirecting to enrollment page...';
    alert(msg);
    // window.location.href = '/enroll';
  });
}

// Hero CTA Button Handler
function initializeHeroCTA() {
  const startSimulationBtn = document.getElementById('start-simulation-btn');
  if (!startSimulationBtn) return;
  
  startSimulationBtn.addEventListener('click', () => {
    document.getElementById('simulator').scrollIntoView({ behavior: 'smooth' });
  });
}

// Helper Functions
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
  if (window.firebaseRemoteConfig) {
    return sessionStorage.getItem('experiment_variant_id') || 'control';
  }
  return 'control';
}

// Initialize experiment variant assignment
document.addEventListener('DOMContentLoaded', async () => {
  // Remote Config is already fetched and activated in index.html
  // Just assign variant and apply it
  const variantId = assignExperimentVariant();
  sessionStorage.setItem('experiment_variant_id', variantId);
  applyExperimentVariant(variantId);
});

function assignExperimentVariant() {
  const variants = ['control', 'variant_a', 'variant_b'];
  const random = Math.random();
  if (random < 0.33) return 'control';
  if (random < 0.66) return 'variant_a';
  return 'variant_b';
}

function applyExperimentVariant(variantId) {
  // Remote Config is optional - use default headlines for now
  // Can be enhanced later when Remote Config is properly configured
  const lang = window.i18n?.getLanguage() || 'es-MX';
  const headlineElement = document.getElementById('main-headline');
  if (headlineElement) {
    // Use default headline based on language
    const defaultHeadline = lang === 'es-MX' 
      ? '0% de Interés Garantizado en tu Crédito de Viaje'
      : '0% Interest Guaranteed on Travel Credit';
    headlineElement.textContent = defaultHeadline;
  }
}

// Listen for language changes to update variant messaging
window.addEventListener('languageChanged', (e) => {
  applyExperimentVariant(getExperimentVariantId());
});
