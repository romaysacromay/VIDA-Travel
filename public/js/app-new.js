/**
 * VIDA Travel - New App (Mobile-First)
 * Main application logic
 */

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjpPEHQ7Y_vXKZ0YqW8uJ5zGxJ_8nN9xM",
  authDomain: "vida-travel-vacation-credit.firebaseapp.com",
  projectId: "vida-travel-vacation-credit",
  storageBucket: "vida-travel-vacation-credit.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const analytics = firebase.analytics();
const remoteConfig = firebase.remoteConfig();

// Remote Config Settings
remoteConfig.settings = {
  minimumFetchIntervalMillis: 3600000, // 1 hour
  fetchTimeoutMillis: 60000
};

remoteConfig.defaultConfig = {
  package_price_base: 15000,
  loan_size_base: 20,
  savings_period_base: 15,
  bonus_incentive_base: 0,
  headline_primary: "Un plan simple. Sin sorpresas.",
  headline_secondary: "Viaja por México desde $10,000 MXN. Sin intereses, sin trampas.",
  theme_color: "#006B5E"
};

// ===================================
// Global State
// ===================================
const state = {
  variant: 'control',
  lang: 'es',
  destinations: [],
  selectedDestination: null,
  userSession: {
    utm: {},
    variant: 'control',
    startTime: Date.now()
  }
};

// ===================================
// Internationalization
// ===================================
const translations = {
  es: {
    'nav-lang': 'EN',
    'hero-badge': '✨ Ahora disponible en México',
    'hero-title': 'Un plan simple.<br>Sin sorpresas.',
    'hero-subtitle': 'Viaja por México desde <strong>$10,000 MXN</strong>. Sin intereses, sin trampas.',
    'hero-cta': 'Planifica tu viaje',
    'benefit-1': 'Ahorra 100% antes de viajar',
    'benefit-2': '6 destinos increíbles',
    'benefit-3': 'Cancela cuando quieras',
    'hero-disclaimer': '*Sujeto a términos y condiciones',
    'hiw-title': 'Tu viaje, tu ritmo.',
    'hiw-subtitle': 'Empieza en 2 minutos.<br>Activa desde cualquier lugar.',
    'pricing-label': 'Precio del paquete',
    'pricing-savings': 'Ahorro semanal',
    'pricing-deposit': 'Tú decides',
    'pricing-timeline': 'Tiempo estimado',
    'pricing-weeks': '10-20 semanas',
    'pricing-credit': 'Crédito post-viaje',
    'pricing-optional': 'Opcional 20%',
    'pricing-all': 'Todo incluido',
    'feature-1-title': 'Simple',
    'feature-1-desc': 'Un plan transparente sin cargos ocultos ni intereses complicados.',
    'feature-2-title': 'Rápido y fácil',
    'feature-2-desc': 'Comienza en minutos. Solo necesitas tu información básica.',
    'feature-3-title': 'Para todos',
    'feature-3-desc': 'Sin score de crédito. Sin trámites complicados. Solo tu compromiso.',
    'dest-eyebrow': 'El mundo es tuyo',
    'dest-title': '¿Nuestros destinos?<br>Nos alegra que preguntes.',
    'dest-subtitle': 'Experimenta los mejores destinos de México. Desde playas caribeñas hasta ciudades coloniales.',
    'testimonials-title': 'Lo aman, tú también lo harás',
    'testimonial-1-quote': '"Un cambio total para las familias mexicanas"',
    'testimonial-1-author': 'María G.',
    'testimonial-2-quote': '"Sin más estrés por ahorrar. Todo está planificado"',
    'testimonial-2-author': 'Carlos R.',
    'testimonial-3-quote': '"Legítimamente la mejor experiencia de crédito"',
    'testimonial-3-author': 'Ana L.',
    'faq-eyebrow': 'Preguntas',
    'faq-title': '¿Tienes preguntas? Aquí las respuestas.',
    'faq-1-q': '¿Qué es VIDA?',
    'faq-1-a': 'VIDA es un plan de crédito vacacional simple y transparente. Ahorras 100% del costo antes de viajar, con opción de crédito post-viaje del 20%. Sin intereses, sin cargos ocultos.',
    'faq-2-q': '¿A qué destinos puedo viajar?',
    'faq-2-a': 'Estamos activos en 6 destinos premium de México: Cancún, Playa del Carmen, Tulum, Cabo San Lucas, Puerto Vallarta y Ciudad de México.',
    'faq-3-q': '¿Puedo cambiar mi plan de ahorro?',
    'faq-3-a': 'Sí, puedes ajustar tus depósitos semanales en cualquier momento. El sistema recalculará automáticamente tu fecha de viaje disponible.',
    'faq-4-q': '¿Necesito historial crediticio?',
    'faq-4-a': 'No. VIDA está diseñado para ser accesible para todos. Solo necesitas tu compromiso de ahorro y un depósito de activación de $50 MXN.',
    'faq-5-q': '¿Cuánto cuesta?',
    'faq-5-a': 'Los paquetes empiezan desde $10,000 MXN. Solo pagas el costo del viaje + $50 MXN de activación. Sin intereses, sin mensualidades.',
    'faq-6-q': '¿Puedo cancelar en cualquier momento?',
    'faq-6-a': 'Sí. Sin contratos, sin penalizaciones. Puedes cancelar cuando quieras y recuperar tus ahorros (menos tarifas administrativas).',
    'steps-title': 'Empieza en 2 minutos',
    'step-1': 'Elige destino',
    'step-2': 'Planifica ahorro',
    'step-3': '¡A viajar!',
    'steps-note': 'Sí, lo cronometramos.',
    'cta-title': 'Un plan,<br>un precio.',
    'cta-period': 'Activación única',
    'cta-button': 'Planifica tu viaje',
    'mobile-cta': 'Planifica tu viaje',
    'footer-heading-1': 'Lo Bueno',
    'footer-home': 'Inicio',
    'footer-about': 'Nosotros',
    'footer-destinations': 'Destinos',
    'footer-careers': 'Carreras',
    'footer-heading-2': 'Lo Legal',
    'footer-terms': 'Términos',
    'footer-rules': 'Las Reglas',
    'footer-privacy': 'Privacidad',
    'footer-heading-3': 'Lo Social',
    'footer-cta-title': 'Un plan, un precio.',
    'footer-cta-period': 'Activación'
  },
  en: {
    'nav-lang': 'ES',
    'hero-badge': '✨ Now available in Mexico',
    'hero-title': 'One simple plan.<br>No surprises.',
    'hero-subtitle': 'Travel Mexico from <strong>$10,000 MXN</strong>. No interest, no tricks.',
    'hero-cta': 'Plan your trip',
    'benefit-1': 'Save 100% before traveling',
    'benefit-2': '6 incredible destinations',
    'benefit-3': 'Cancel anytime',
    'hero-disclaimer': '*Subject to terms and conditions',
    'hiw-title': 'Your trip, your pace.',
    'hiw-subtitle': 'Get started in 2 minutes.<br>Activate from anywhere.',
    'pricing-label': 'Package price',
    'pricing-savings': 'Weekly savings',
    'pricing-deposit': 'You decide',
    'pricing-timeline': 'Estimated time',
    'pricing-weeks': '10-20 weeks',
    'pricing-credit': 'Post-trip credit',
    'pricing-optional': 'Optional 20%',
    'pricing-all': 'All inclusive',
    'feature-1-title': 'Simple',
    'feature-1-desc': 'A transparent plan without hidden charges or complicated interest.',
    'feature-2-title': 'Fast & Easy',
    'feature-2-desc': 'Get started in minutes. Just need your basic information.',
    'feature-3-title': 'For Everyone',
    'feature-3-desc': 'No credit score. No complicated paperwork. Just your commitment.',
    'dest-eyebrow': 'The world is yours',
    'dest-title': 'Our destinations?<br>Glad you asked.',
    'dest-subtitle': 'Experience the best destinations in Mexico. From Caribbean beaches to colonial cities.',
    'testimonials-title': 'They love it, so will you',
    'testimonial-1-quote': '"A total game changer for Mexican families"',
    'testimonial-1-author': 'María G.',
    'testimonial-2-quote': '"No more stress about saving. Everything is planned"',
    'testimonial-2-author': 'Carlos R.',
    'testimonial-3-quote': '"Legitimately the best credit experience"',
    'testimonial-3-author': 'Ana L.',
    'faq-eyebrow': 'Questions',
    'faq-title': 'Got questions? Here are the answers.',
    'faq-1-q': 'What is VIDA?',
    'faq-1-a': 'VIDA is a simple, transparent vacation credit plan. You save 100% of the cost before traveling, with an optional 20% post-trip credit. No interest, no hidden fees.',
    'faq-2-q': 'Where can I travel?',
    'faq-2-a': 'We operate in 6 premium destinations in Mexico: Cancun, Playa del Carmen, Tulum, Cabo San Lucas, Puerto Vallarta, and Mexico City.',
    'faq-3-q': 'Can I change my savings plan?',
    'faq-3-a': 'Yes, you can adjust your weekly deposits anytime. The system will automatically recalculate your available travel date.',
    'faq-4-q': 'Do I need credit history?',
    'faq-4-a': 'No. VIDA is designed to be accessible to everyone. You only need your savings commitment and a $50 MXN activation deposit.',
    'faq-5-q': 'How much does it cost?',
    'faq-5-a': 'Packages start from $10,000 MXN. You only pay the trip cost + $50 MXN activation. No interest, no monthly fees.',
    'faq-6-q': 'Can I cancel anytime?',
    'faq-6-a': 'Yes. No contracts, no penalties. You can cancel anytime and recover your savings (minus administrative fees).',
    'steps-title': 'Get started in 2 minutes',
    'step-1': 'Choose destination',
    'step-2': 'Plan savings',
    'step-3': 'Start traveling!',
    'steps-note': 'Yes, we timed it.',
    'cta-title': 'One plan,<br>one price.',
    'cta-period': 'One-time activation',
    'cta-button': 'Plan your trip',
    'mobile-cta': 'Plan your trip',
    'footer-heading-1': 'The Good',
    'footer-home': 'Home',
    'footer-about': 'About',
    'footer-destinations': 'Destinations',
    'footer-careers': 'Careers',
    'footer-heading-2': 'The Legal',
    'footer-terms': 'Terms',
    'footer-rules': 'The Rules',
    'footer-privacy': 'Privacy',
    'footer-heading-3': 'The Social',
    'footer-cta-title': 'One plan, one price.',
    'footer-cta-period': 'Activation'
  }
};

function updateLanguage(lang) {
  state.lang = lang;
  document.querySelectorAll('[data-lang-key]').forEach(el => {
    const key = el.getAttribute('data-lang-key');
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
  
  // Update HTML lang attribute
  document.documentElement.lang = lang;
}

// ===================================
// UTM Tracking
// ===================================
function captureUTMParameters() {
  const params = new URLSearchParams(window.location.search);
  const utm = {
    source: params.get('utm_source') || 'direct',
    medium: params.get('utm_medium') || 'none',
    campaign: params.get('utm_campaign') || 'none',
    term: params.get('utm_term') || '',
    content: params.get('utm_content') || ''
  };
  
  state.userSession.utm = utm;
  sessionStorage.setItem('vida_utm', JSON.stringify(utm));
  
  return utm;
}

// ===================================
// Remote Config & A/B Testing
// ===================================
async function fetchRemoteConfig() {
  try {
    await remoteConfig.fetchAndActivate();
    
    const variant = remoteConfig.getString('test_variant') || 'control';
    state.variant = variant;
    state.userSession.variant = variant;
    
    // Apply variant-specific settings
    const packagePrice = remoteConfig.getNumber('package_price_base');
    const loanSize = remoteConfig.getNumber('loan_size_base');
    const themeColor = remoteConfig.getString('theme_color');
    
    // Update pricing display
    document.getElementById('pricingAmount').textContent = `$${packagePrice.toLocaleString('es-MX')}`;
    
    // Apply theme color if variant has custom color
    if (themeColor && themeColor !== '#006B5E') {
      document.documentElement.style.setProperty('--color-primary', themeColor);
    }
    
    console.log('✅ Variant assigned:', variant);
    
    // Track variant assignment
    analytics.logEvent('variant_assigned', {
      variant: variant,
      package_price: packagePrice,
      loan_size: loanSize
    });
    
    // Store in Firestore
    await db.collection('variant_assignments').add({
      variant: variant,
      utm: state.userSession.utm,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userAgent: navigator.userAgent
    });
    
  } catch (error) {
    console.error('❌ Remote Config error:', error);
    state.variant = 'control';
  }
}

// ===================================
// Load Destinations
// ===================================
async function loadDestinations() {
  try {
    const snapshot = await db.collection('destinations')
      .where('active', '==', true)
      .orderBy('order')
      .get();
    
    if (snapshot.empty) {
      console.warn('⚠️ No destinations found');
      return;
    }
    
    state.destinations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    renderDestinations();
  } catch (error) {
    console.error('❌ Error loading destinations:', error);
  }
}

function renderDestinations() {
  const grid = document.getElementById('destinationsGrid');
  
  if (state.destinations.length === 0) {
    return; // Keep skeleton
  }
  
  grid.innerHTML = state.destinations.map(dest => `
    <div class="destination-card" data-dest-id="${dest.id}" onclick="selectDestination('${dest.id}')">
      <img src="${dest.imageUrl}" 
           alt="${dest.name[state.lang]}" 
           class="dest-image"
           onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 fill=%22%239ca3af%22 font-family=%22sans-serif%22 font-size=%2218%22 text-anchor=%22middle%22 dy=%22.3em%22%3E${dest.name[state.lang]}%3C/text%3E%3C/svg%3E'">
      <div class="dest-name">${dest.name[state.lang]}</div>
    </div>
  `).join('');
}

function selectDestination(destId) {
  state.selectedDestination = state.destinations.find(d => d.id === destId);
  
  // Track event
  analytics.logEvent('select_content', {
    content_type: 'destination',
    content_id: destId
  });
  
  fbq('track', 'ViewContent', {
    content_name: state.selectedDestination.name[state.lang],
    content_type: 'destination',
    value: state.selectedDestination.basePrice,
    currency: 'MXN'
  });
  
  // Open simulator modal
  openSimulatorModal();
}

// ===================================
// Simulator Modal
// ===================================
function openSimulatorModal() {
  const modal = document.getElementById('simulatorModal');
  const modalBody = document.getElementById('modalBody');
  
  modalBody.innerHTML = `
    <h2 style="margin-bottom: 1.5rem; text-align: center;">
      ${state.selectedDestination.name[state.lang]}
    </h2>
    <div style="background: var(--color-gray-50); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem;">
      <div style="font-size: 0.875rem; color: var(--color-gray-600); margin-bottom: 0.5rem;">
        ${state.lang === 'es' ? 'Precio base' : 'Base price'}
      </div>
      <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary);">
        $${state.selectedDestination.basePrice.toLocaleString('es-MX')} MXN
      </div>
    </div>
    
    <div style="margin-bottom: 1.5rem;">
      <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
        ${state.lang === 'es' ? '¿Cuánto puedes ahorrar por semana?' : 'How much can you save per week?'}
      </label>
      <input type="number" 
             id="weeklyDeposit" 
             placeholder="1000" 
             min="100" 
             max="10000"
             style="width: 100%; padding: 0.875rem; border: 2px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: 1rem;">
    </div>
    
    <div id="calculationResult" style="display: none; background: var(--color-primary); color: white; border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem;">
      <!-- Result will be inserted here -->
    </div>
    
    <button class="btn-primary btn-large btn-block" onclick="calculateSavings()">
      ${state.lang === 'es' ? 'Calcular mi plan' : 'Calculate my plan'}
    </button>
    
    <p style="text-align: center; font-size: 0.875rem; color: var(--color-gray-600); margin-top: 1rem;">
      ${state.lang === 'es' ? 'Simulación estimada. No representa un compromiso financiero.' : 'Estimated simulation. Does not represent financial commitment.'}
    </p>
  `;
  
  modal.classList.add('active');
}

function closeSimulatorModal() {
  const modal = document.getElementById('simulatorModal');
  modal.classList.remove('active');
}

window.calculateSavings = function() {
  const weeklyDeposit = parseFloat(document.getElementById('weeklyDeposit').value);
  
  if (!weeklyDeposit || weeklyDeposit < 100) {
    alert(state.lang === 'es' ? 'Por favor ingresa un monto válido (mínimo $100)' : 'Please enter a valid amount (minimum $100)');
    return;
  }
  
  const basePrice = state.selectedDestination.basePrice;
  const preSaveAmount = basePrice * 0.8; // 80% pre-save
  const weeksNeeded = Math.ceil(preSaveAmount / weeklyDeposit);
  const monthsNeeded = (weeksNeeded / 4.33).toFixed(1);
  
  const resultDiv = document.getElementById('calculationResult');
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 0.5rem;">
        ${state.lang === 'es' ? 'Podrás viajar en' : 'You can travel in'}
      </div>
      <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.25rem;">
        ${weeksNeeded} ${state.lang === 'es' ? 'semanas' : 'weeks'}
      </div>
      <div style="font-size: 1rem; opacity: 0.9;">
        (${monthsNeeded} ${state.lang === 'es' ? 'meses aprox.' : 'months approx.'})
      </div>
      <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.3);">
        <div style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 0.5rem;">
          ${state.lang === 'es' ? 'Total a ahorrar' : 'Total to save'}
        </div>
        <div style="font-size: 1.5rem; font-weight: 600;">
          $${preSaveAmount.toLocaleString('es-MX')} MXN
        </div>
      </div>
    </div>
  `;
  
  // Track calculation
  analytics.logEvent('calculate_savings', {
    destination: state.selectedDestination.id,
    weekly_deposit: weeklyDeposit,
    weeks_needed: weeksNeeded,
    base_price: basePrice
  });
  
  fbq('track', 'AddToCart', {
    content_name: state.selectedDestination.name[state.lang],
    content_type: 'destination',
    value: basePrice,
    currency: 'MXN'
  });
  
  // Store in Firestore
  db.collection('simulator_sessions').add({
    destination: state.selectedDestination.id,
    weeklyDeposit: weeklyDeposit,
    weeksNeeded: weeksNeeded,
    basePrice: basePrice,
    variant: state.variant,
    utm: state.userSession.utm,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
};

window.selectDestination = selectDestination;

// ===================================
// FAQ Accordion
// ===================================
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isActive = item.classList.contains('active');
      
      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      // Toggle current FAQ
      if (!isActive) {
        item.classList.add('active');
        
        // Track FAQ interaction
        const question = button.querySelector('[data-lang-key]').getAttribute('data-lang-key');
        analytics.logEvent('faq_click', { question });
      }
    });
  });
}

// ===================================
// CTA Buttons
// ===================================
function initCTAButtons() {
  const ctaButtons = ['heroCtaBtn', 'ctaBtn', 'mobileCtaBtn'];
  
  ctaButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        // Scroll to destinations
        document.querySelector('.destinations').scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        analytics.logEvent('cta_click', { button_id: btnId });
        fbq('track', 'Lead');
      });
    }
  });
}

// ===================================
// Language Toggle
// ===================================
function initLanguageToggle() {
  const toggle = document.getElementById('langToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const newLang = state.lang === 'es' ? 'en' : 'es';
      updateLanguage(newLang);
      
      // Re-render destinations with new language
      if (state.destinations.length > 0) {
        renderDestinations();
      }
      
      analytics.logEvent('language_change', { language: newLang });
    });
  }
}

// ===================================
// Modal Close
// ===================================
function initModalClose() {
  const closeBtn = document.getElementById('modalClose');
  const modal = document.getElementById('simulatorModal');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSimulatorModal);
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeSimulatorModal();
      }
    });
  }
}

// ===================================
// Initialize App
// ===================================
async function initApp() {
  try {
    console.log('🌴 VIDA Travel - Initializing...');
    
    // Capture UTM parameters
    captureUTMParameters();
    
    // Track page view
    analytics.logEvent('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      utm: state.userSession.utm
    });
    
    fbq('track', 'PageView');
    
    // Fetch Remote Config & Assign Variant
    await fetchRemoteConfig();
    
    // Load Destinations
    await loadDestinations();
    
    // Initialize interactions
    initFAQ();
    initCTAButtons();
    initLanguageToggle();
    initModalClose();
    
    console.log('✅ VIDA Travel - Ready!');
    
  } catch (error) {
    console.error('❌ Initialization error:', error);
  }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

