/**
 * VIDA Travel - New App (Mobile-First)
 * Main application logic
 */

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXLqx9s0qv7UbQPP8Ppew0s2qUcRL4ZX0",
  authDomain: "vida-travel-vacation-credit.firebaseapp.com",
  projectId: "vida-travel-vacation-credit",
  storageBucket: "vida-travel-vacation-credit.firebasestorage.app",
  messagingSenderId: "8569596534",
  appId: "1:8569596534:web:8ef6043a23ab7288034d57",
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

// Make state globally accessible for modules
window.state = state;

// ===================================
// Internationalization
// ===================================
const translations = {
  es: {
    'nav-lang': 'EN',
    'hero-badge': '✨ Ahora disponible en México',
    'hero-title': '¡Obtén tu crédito<br>vacacional gratis!',
    'hero-subtitle': 'Reservamos tu viaje <strong>HOY</strong> desde <strong>$10,000 MXN</strong>. Pagas semanalmente, viajas cuando termines.',
    'hero-cta': 'Obtener mi crédito gratis',
    'benefit-1': 'Fechas de viaje garantizadas',
    'benefit-2': '6 destinos increíbles',
    'benefit-3': 'Pausa pagos hasta 6 meses',
    'hero-disclaimer': '*Sujeto a términos y condiciones',
    'destinations-cta': 'Haz clic en un destino para obtener tu crédito vacacional',
    'hiw-title': 'Tu viaje, tu ritmo.',
    'hiw-subtitle': 'Empieza en 2 minutos.<br>Activa desde cualquier lugar.',
    'pricing-label': 'Precio del paquete',
    'pricing-free-credit': 'Crédito gratis sin comisiones ni intereses',
    'pricing-weekly-payment': 'Pagos semanales pequeños y flexibles',
    'pricing-timeline': 'Tiempo estimado: 10-20 semanas',
    'package-includes-title': '¿Qué incluye tu paquete?',
    'package-flight': 'Vuelo',
    'package-flight-desc': 'Ida y vuelta',
    'package-hotel': 'Hotel 4 estrellas',
    'package-hotel-desc': 'Alojamiento premium',
    'package-meals': '2 comidas diarias',
    'package-meals-desc': 'Para 2 viajeros',
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
    'testimonial-2-quote': '"Sin más estrés por planificar. Todo está asegurado"',
    'testimonial-2-author': 'Carlos R.',
    'testimonial-3-quote': '"Legítimamente la mejor experiencia de crédito"',
    'testimonial-3-author': 'Ana L.',
    'faq-eyebrow': 'Preguntas',
    'faq-title': '¿Tienes preguntas? Aquí las respuestas.',
    'faq-1-q': '¿Qué es VIDA?',
    'faq-1-a': 'VIDA es un plan de crédito vacacional que te garantiza tus fechas de viaje. Nosotros reservamos y pagamos tus vuelos, hotel y tours mientras tú pagas. Viaja tranquilo con todo asegurado desde el inicio.',
    'faq-2-q': '¿A qué destinos puedo viajar?',
    'faq-2-a': 'Estamos activos en 6 destinos premium de México: Cancún, Playa del Carmen, Tulum, Cabo San Lucas, Puerto Vallarta y Ciudad de México.',
    'faq-3-q': '¿Puedo cambiar mi plan de pago?',
    'faq-3-a': 'Sí, puedes ajustar tus depósitos semanales en cualquier momento. El sistema recalculará automáticamente tu fecha de viaje disponible.',
    'faq-4-q': '¿Necesito historial crediticio?',
    'faq-4-a': 'No. VIDA está diseñado para ser accesible para todos. Solo necesitas tu compromiso de pago y un depósito de activación de $500 MXN.',
    'faq-5-q': '¿Cuánto cuesta?',
    'faq-5-a': 'Los paquetes empiezan desde $10,000 MXN. Pagas solo el costo del viaje + $500 MXN de activación (que ya se aplican a tu paquete). Sin intereses, sin mensualidades.',
    'faq-6-q': '¿Puedo cambiar o pausar mi plan?',
    'faq-6-a': 'Puedes mover tus fechas hasta 1 mes antes del viaje. También puedes pausar pagos hasta 6 meses. A partir de 1 mes antes del viaje se aplican cargos por cambios menores. Si no completas el pago final 1 semana antes, el monto no es reembolsable.',
    'steps-title': 'Empieza en 2 minutos',
    'step-1': 'Elige destino',
    'step-2': 'Planifica pagos',
    'step-3': '¡A viajar!',
    'steps-note': 'Sí, lo cronometramos.',
    'cta-title': 'Un plan,<br>un precio.',
    'cta-period': 'Activación (aplicado al paquete)',
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
    'footer-cta-period': 'Activación',
    'phone-myPlan': 'Mi Plan de Viaje',
    'phone-active': 'Activo',
    'phone-daysNights': 'días / 3 noches',
    'phone-adults': 'adultos',
    'phone-packageCost': 'Costo del paquete',
    'phone-weeklyPayment': 'Pago semanal',
    'phone-progress': 'Progreso',
    'phone-paid': 'pagado',
    'phone-remaining': 'restante',
    'phone-travelDate': 'Fecha de viaje',
    'phone-weeksRemaining': 'semanas restantes'
  },
  en: {
    'nav-lang': 'ES',
    'hero-badge': '✨ Now available in Mexico',
    'hero-title': 'Get your free<br>travel credit!',
    'hero-subtitle': 'We book your trip <strong>TODAY</strong> from <strong>$10,000 MXN</strong>. Pay weekly, travel when done.',
    'hero-cta': 'Get my free credit',
    'benefit-1': 'Guaranteed travel dates',
    'benefit-2': '6 incredible destinations',
    'benefit-3': 'Pause payments up to 6 months',
    'hero-disclaimer': '*Subject to terms and conditions',
    'destinations-cta': 'Click on a destination to get your vacation credit',
    'hiw-title': 'Your trip, your pace.',
    'hiw-subtitle': 'Get started in 2 minutes.<br>Activate from anywhere.',
    'pricing-label': 'Package price',
    'pricing-free-credit': 'Free credit with no fees or interest',
    'pricing-weekly-payment': 'Small and flexible weekly payments',
    'pricing-timeline': 'Estimated time: 10-20 weeks',
    'package-includes-title': 'What does your package include?',
    'package-flight': 'Flight',
    'package-flight-desc': 'Round trip',
    'package-hotel': '4-star hotel',
    'package-hotel-desc': 'Premium accommodation',
    'package-meals': '2 daily meals',
    'package-meals-desc': 'For 2 travelers',
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
    'faq-1-a': 'VIDA is a vacation credit plan that guarantees your travel dates. We book and pay for your flights, hotel, and tours while you save. Travel worry-free with everything secured from the start.',
    'faq-2-q': 'Where can I travel?',
    'faq-2-a': 'We operate in 6 premium destinations in Mexico: Cancun, Playa del Carmen, Tulum, Cabo San Lucas, Puerto Vallarta, and Mexico City.',
    'faq-3-q': 'Can I change my savings plan?',
    'faq-3-a': 'Yes, you can adjust your weekly deposits anytime. The system will automatically recalculate your available travel date.',
    'faq-4-q': 'Do I need credit history?',
    'faq-4-a': 'No. VIDA is designed to be accessible to everyone. You only need your savings commitment and a $500 MXN activation deposit.',
    'faq-5-q': 'How much does it cost?',
    'faq-5-a': 'Packages start from $10,000 MXN. You only pay the trip cost + $500 MXN activation (already applied to your package). No interest, no monthly fees.',
    'faq-6-q': 'Can I change or pause my plan?',
    'faq-6-a': 'You can move your dates up to 1 month before the trip. You can also pause payments for up to 6 months. Starting 1 month before travel, minor change fees apply. If final payment isn\'t made 1 week before, the amount becomes non-refundable.',
    'steps-title': 'Get started in 2 minutes',
    'step-1': 'Choose destination',
    'step-2': 'Plan savings',
    'step-3': 'Start traveling!',
    'steps-note': 'Yes, we timed it.',
    'cta-title': 'One plan,<br>one price.',
    'cta-period': 'Activation (applied to package)',
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
    'footer-cta-period': 'Activation',
    'phone-myPlan': 'My Travel Plan',
    'phone-active': 'Active',
    'phone-daysNights': 'days / 3 nights',
    'phone-adults': 'adults',
    'phone-packageCost': 'Package cost',
    'phone-weeklyPayment': 'Weekly payment',
    'phone-progress': 'Progress',
    'phone-paid': 'paid',
    'phone-remaining': 'remaining',
    'phone-travelDate': 'Travel date',
    'phone-weeksRemaining': 'weeks remaining'
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
    
    console.log('✅ Loaded destinations:', state.destinations.map(d => `${d.id}: ${d.name?.es || 'no name'}`));
    
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
  
  const cacheBuster = Date.now(); // Cache busting timestamp
  
  grid.innerHTML = state.destinations.map(dest => `
    <div class="destination-card" data-dest-id="${dest.id}" onclick="selectDestination('${dest.id}')">
      <video 
        class="dest-video" 
        autoplay 
        muted 
        loop 
        playsinline
        webkit-playsinline
        x5-playsinline
        preload="auto"
        style="background: linear-gradient(135deg, var(--color-gray-200), var(--color-gray-300));">
        <source src="/destinations/${dest.id}.mp4?v=${cacheBuster}" type="video/mp4">
      </video>
      <div class="dest-info">
        <div class="dest-top-info">
          <div class="dest-name">${dest.name[state.lang]}</div>
          <div class="dest-includes">
            <div class="dest-include-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
              Vuelo
            </div>
            <div class="dest-include-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h18M3 14h18m-9-4h1v4h-1z"/><path d="M2 21h20v-8H2v8zm0-11h20V6a2 2 0 00-2-2H4a2 2 0 00-2 2v4z"/></svg>
              Hotel 4★
            </div>
            <div class="dest-include-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              2 comidas
            </div>
          </div>
        </div>
        <div class="dest-bottom-info">
          <div class="dest-price">Desde $${dest.basePrice.toLocaleString('es-MX')}</div>
        </div>
      </div>
    </div>
  `).join('');
  
  console.log('✅ Rendered', state.destinations.length, 'destination cards with cache buster:', cacheBuster);
  
  // Force video load after render
  setTimeout(() => {
    document.querySelectorAll('.dest-video').forEach((video, index) => {
      video.load();
      const destId = state.destinations[index]?.id || 'unknown';
      console.log(`Video ${index} (${destId}):`, video.src);
    });
  }, 100);
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
  
  // Clear any inline styles that might interfere
  modal.style.display = '';
  
  modalBody.innerHTML = `
    <h2 style="margin-bottom: 0.5rem; text-align: center; font-size: 1.5rem;">
      ${state.selectedDestination.name[state.lang]}
    </h2>
    
    <p style="text-align: center; font-size: 0.875rem; color: var(--color-gray-600); margin-bottom: 1rem;">
      ${state.lang === 'es' ? 
        'Ajusta los valores y verás tu plan de pago en tiempo real' : 
        'Adjust the values and see your payment plan in real time'}
    </p>
    
    <div style="background: var(--color-gray-50); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem;">
      <div style="font-size: 0.75rem; color: var(--color-gray-600); margin-bottom: 0.25rem;">
        ${state.lang === 'es' ? 'Precio base (2 personas)' : 'Base price (2 people)'}
      </div>
      <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">
        $${state.selectedDestination.basePrice.toLocaleString('es-MX')} MXN
      </div>
    </div>
    
    <!-- Package Includes -->
    <div style="margin-bottom: 1rem; padding: 1rem; background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(0, 107, 94, 0.05) 100%); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: var(--radius-md);">
      <div style="font-size: 0.8125rem; font-weight: 600; color: var(--color-gray-700); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.375rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        ${state.lang === 'es' ? 'Tu paquete incluye:' : 'Your package includes:'}
      </div>
      <div style="display: grid; gap: 0.625rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; color: var(--color-gray-700);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
          <span style="font-weight: 500;">
            ${state.lang === 'es' ? 'Vuelo redondo' : 'Round-trip flight'}
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; color: var(--color-gray-700);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span style="font-weight: 500;">
            ${state.lang === 'es' ? 'Hotel 4 estrellas' : '4-star hotel'}
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; color: var(--color-gray-700);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"></path><path d="M21 15v7"></path></svg>
          <span style="font-weight: 500;">
            ${state.lang === 'es' ? '2 comidas diarias (para 2 viajeros)' : '2 daily meals (for 2 travelers)'}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Travelers Selection -->
    <div style="margin-bottom: 1rem;">
      <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.875rem;">
        ${state.lang === 'es' ? '¿Quién viaja?' : 'Who is traveling?'}
      </label>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
        <div>
          <label style="display: block; margin-bottom: 0.25rem; font-size: 0.75rem; color: var(--color-gray-600);">
            ${state.lang === 'es' ? 'Adultos' : 'Adults'}
          </label>
          <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--color-white); border: 2px solid var(--color-gray-200); border-radius: var(--radius-md); padding: 0.5rem;">
            <button onclick="changeAdults(-1)" style="padding: 0.25rem 0.5rem; background: var(--color-gray-100); border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span id="adultsCount" style="flex: 1; text-align: center; font-weight: 600; font-size: 1rem;">2</span>
            <button onclick="changeAdults(1)" style="padding: 0.25rem 0.5rem; background: var(--color-gray-100); border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>
        <div>
          <label style="display: block; margin-bottom: 0.25rem; font-size: 0.75rem; color: var(--color-gray-600);">
            ${state.lang === 'es' ? 'Niños' : 'Children'}
          </label>
          <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--color-white); border: 2px solid var(--color-gray-200); border-radius: var(--radius-md); padding: 0.5rem;">
            <button onclick="changeChildren(-1)" style="padding: 0.25rem 0.5rem; background: var(--color-gray-100); border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span id="childrenCount" style="flex: 1; text-align: center; font-weight: 600; font-size: 1rem;">0</span>
            <button onclick="changeChildren(1)" style="padding: 0.25rem 0.5rem; background: var(--color-gray-100); border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Monthly Salary Slider -->
    <div style="margin-bottom: 1rem;">
      <label style="display: flex; align-items: center; gap: 0.375rem; margin-bottom: 0.25rem; font-weight: 600; font-size: 0.875rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        ${state.lang === 'es' ? 'Ingreso mensual del hogar' : 'Monthly household income'}
      </label>
      <p style="font-size: 0.625rem; color: var(--color-gray-500); margin-bottom: 0.5rem;">
        ${state.lang === 'es' ? 'Mueve el control para ajustar tu ingreso familiar' : 'Move the slider to adjust your household income'}
      </p>
      <input type="range" 
             id="monthlySalary" 
             min="10000" 
             max="50000" 
             step="1000" 
             value="25000"
             oninput="updateSalaryDisplay()"
             style="width: 100%; margin-bottom: 0.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.75rem; color: var(--color-gray-500);">$10k</span>
        <span id="salaryDisplay" style="font-size: 1.125rem; font-weight: 700; color: var(--color-primary);">$25,000</span>
        <span style="font-size: 0.75rem; color: var(--color-gray-500);">$50k</span>
      </div>
    </div>
    
    <!-- Weekly Payment Slider -->
    <div style="margin-bottom: 1rem;">
      <label style="display: flex; align-items: center; gap: 0.375rem; margin-bottom: 0.25rem; font-weight: 600; font-size: 0.875rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${state.lang === 'es' ? 'Pago semanal' : 'Weekly payment'}
      </label>
      <p style="font-size: 0.625rem; color: var(--color-gray-500); margin-bottom: 0.5rem;">
        ${state.lang === 'es' ? '¿Cuánto puedes pagar cada semana?' : 'How much can you pay each week?'}
      </p>
      <input type="range" 
             id="weeklyDeposit" 
             min="500" 
             max="2000" 
             step="50" 
             value="850"
             oninput="updateWeeklyDisplay()"
             style="width: 100%; margin-bottom: 0.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.75rem; color: var(--color-gray-500);">$500</span>
        <span id="weeklyDisplay" style="font-size: 1.125rem; font-weight: 700; color: var(--color-primary);">$850</span>
        <span style="font-size: 0.75rem; color: var(--color-gray-500);">$2,000</span>
      </div>
      <div id="commitmentWarning" style="display: none; margin-top: 0.75rem; padding: 0.875rem; background: linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(0, 107, 94, 0.12)); border: 2px solid var(--color-secondary); border-radius: var(--radius-md); box-shadow: 0 2px 8px rgba(212, 175, 55, 0.15);">
        <div style="display: flex; align-items: flex-start; gap: 0.625rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary-dark)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div>
            <div style="font-size: 0.8125rem; font-weight: 700; color: var(--color-primary-dark); margin-bottom: 0.25rem;">
              ${state.lang === 'es' ? 'El pago semanal excede el 15% de tu ingreso' : 'Weekly payment exceeds 15% of your income'}
            </div>
            <div style="font-size: 0.75rem; line-height: 1.5; color: var(--color-gray-700);">
              ${state.lang === 'es' ? 'Para garantizar pagos cómodos y sostenibles, recomendamos que tu compromiso mensual no supere el 15% de tu ingreso del hogar. Ajusta el pago semanal o aumenta tu ingreso para continuar.' : 'To ensure comfortable and sustainable payments, we recommend your monthly commitment not exceed 15% of your household income. Adjust your weekly payment or increase your income to continue.'}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div id="calculationResult" style="display: none; background: var(--color-primary); color: white; border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem;">
      <!-- Result will be inserted here -->
    </div>
  `;
  
  // Add active class to show modal
  modal.classList.add('active');
  
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
  
  // Reset the manual adjustment flag for new modal session
  userAdjustedWeekly = false;
  
  // Initialize displays - this will auto-set weekly to max (15%)
  updateSalaryDisplay();
  
  // Add change listeners to dropdowns
  document.getElementById('adultsCount').addEventListener('change', () => calculateSavings());
  document.getElementById('childrenCount').addEventListener('change', () => calculateSavings());
  
  // Auto-calculate on any input change
  setTimeout(() => calculateSavings(), 100);
}

function closeSimulatorModal() {
  const modal = document.getElementById('simulatorModal');
  
  // Remove active class (CSS will handle display: none)
  modal.classList.remove('active');
  
  // Ensure body overflow is restored immediately
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
  
  // Clear any inline styles on modal
  modal.style.display = '';
  
  // Reset modal body content after transition
  setTimeout(() => {
    const modalBody = document.getElementById('modalBody');
    if (modalBody) {
      modalBody.innerHTML = '';
    }
  }, 300);
}

// Helper functions for simulator
window.changeAdults = function(delta) {
  const currentValue = parseInt(document.getElementById('adultsCount').textContent);
  const newValue = Math.max(1, Math.min(2, currentValue + delta));
  document.getElementById('adultsCount').textContent = newValue;
  calculateSavings();
};

window.changeChildren = function(delta) {
  const currentValue = parseInt(document.getElementById('childrenCount').textContent);
  const newValue = Math.max(0, Math.min(4, currentValue + delta));
  document.getElementById('childrenCount').textContent = newValue;
  calculateSavings();
};

// Track if user has manually adjusted weekly payment
let userAdjustedWeekly = false;

window.updateSalaryDisplay = function() {
  const salary = parseFloat(document.getElementById('monthlySalary').value);
  document.getElementById('salaryDisplay').textContent = `$${parseInt(salary).toLocaleString('es-MX')}`;
  
  // Auto-adjust weekly payment to max (15%) when salary changes
  // UNLESS user has manually adjusted it
  if (!userAdjustedWeekly) {
    const maxWeeklyPayment = (salary * 0.15) / 4.33; // 15% of monthly / 4.33 weeks
    const weeklySlider = document.getElementById('weeklyDeposit');
    const cappedValue = Math.min(Math.max(500, Math.floor(maxWeeklyPayment / 50) * 50), 2000);
    weeklySlider.value = cappedValue;
    document.getElementById('weeklyDisplay').textContent = `$${cappedValue.toLocaleString('es-MX')}`;
  }
  
  checkCommitment();
  calculateSavings(); // Auto-calculate
};

window.updateWeeklyDisplay = function() {
  const weekly = document.getElementById('weeklyDeposit').value;
  document.getElementById('weeklyDisplay').textContent = `$${parseInt(weekly).toLocaleString('es-MX')}`;
  
  // Mark that user manually adjusted weekly payment
  userAdjustedWeekly = true;
  
  checkCommitment();
  calculateSavings(); // Auto-calculate
};

function checkCommitment() {
  const monthlySalary = parseFloat(document.getElementById('monthlySalary').value);
  const weeklyDeposit = parseFloat(document.getElementById('weeklyDeposit').value);
  const monthlyCommitment = weeklyDeposit * 4.33; // Average weeks per month
  const commitmentPercentage = (monthlyCommitment / monthlySalary) * 100;
  
  const warningDiv = document.getElementById('commitmentWarning');
  if (commitmentPercentage > 15) {
    warningDiv.style.display = 'block';
  } else {
    warningDiv.style.display = 'none';
  }
}

window.calculateSavings = function() {
  const adults = parseInt(document.getElementById('adultsCount').textContent);
  const children = parseInt(document.getElementById('childrenCount').textContent);
  const monthlySalary = parseFloat(document.getElementById('monthlySalary').value);
  const weeklyDeposit = parseFloat(document.getElementById('weeklyDeposit').value);
  
  // Calculate monthly commitment
  const monthlyCommitment = weeklyDeposit * 4.33;
  const commitmentPercentage = (monthlyCommitment / monthlySalary) * 100;
  
  // Note: We show a warning but don't block calculation
  // User can still proceed if they wish
  
  // Calculate base price with travelers
  let basePrice = state.selectedDestination.basePrice;
  
  // Add cost per additional traveler (simplified - you can adjust this logic)
  const totalTravelers = adults + children;
  if (totalTravelers > 2) {
    basePrice = basePrice + ((totalTravelers - 2) * (basePrice * 0.3)); // 30% per additional person
  }
  
  const preSaveAmount = basePrice; // 100% - Users must save FULL amount
  const weeksNeeded = Math.ceil(preSaveAmount / weeklyDeposit);
  const monthsNeeded = (weeksNeeded / 4.33).toFixed(1);
  
  // Calculate travel date
  const travelDate = new Date();
  travelDate.setDate(travelDate.getDate() + (weeksNeeded * 7));
  
  const travelDateFormatted = travelDate.toLocaleDateString(state.lang === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const resultDiv = document.getElementById('calculationResult');
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.5rem;">
        ${adults} ${state.lang === 'es' ? 'adulto(s)' : 'adult(s)'}, ${children} ${state.lang === 'es' ? 'niño(s)' : 'child(ren)'}
      </div>
      <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.5rem;">
        ${state.lang === 'es' ? 'Podrás viajar a partir de' : 'You can travel from'}
      </div>
      <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; line-height: 1.2;">
        ${travelDateFormatted}
      </div>
      <div style="font-size: 0.75rem; opacity: 0.8; margin-bottom: 0.125rem;">
        ${state.lang === 'es' ? 'En' : 'In'} ${weeksNeeded} ${state.lang === 'es' ? 'semanas' : 'weeks'} (${monthsNeeded} ${state.lang === 'es' ? 'meses' : 'months'})
      </div>
      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.3);">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">
          ${state.lang === 'es' ? 'Costo total' : 'Total cost'}
        </div>
        <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem;">
          $${basePrice.toLocaleString('es-MX')} MXN
        </div>
        <div style="font-size: 0.625rem; opacity: 0.8;">
          ${state.lang === 'es' ? 
            `Mensual: $${monthlyCommitment.toLocaleString('es-MX')} (${commitmentPercentage.toFixed(1)}%)` : 
            `Monthly: $${monthlyCommitment.toLocaleString('es-MX')} (${commitmentPercentage.toFixed(1)}%)`}
        </div>
      </div>
    </div>
    
    <button id="bookNowBtn" class="btn-primary btn-large btn-block" onclick="proceedToDateSelection()" style="margin-top: 1rem; ${commitmentPercentage > 15 ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
      ${state.lang === 'es' ? 'Reservar ahora' : 'Book now'}
    </button>
    
    ${commitmentPercentage > 15 ? `
      <p style="text-align: center; color: var(--color-secondary-dark); font-size: 0.75rem; margin-top: 0.5rem; font-weight: 600;">
        ${state.lang === 'es' ? 
          'Ajusta tu pago semanal' : 
          'Adjust your weekly payment'}
      </p>
    ` : ''}
  `;
  
  // Store calculation data in state for next step
  state.calculationData = {
    adults,
    children,
    monthlySalary,
    weeklyDeposit,
    weeksNeeded,
    totalPrice: basePrice,
    commitmentPercentage,
    travelDate,
    monthlyCommitment
  };
  
  // Disable button if over 15%
  setTimeout(() => {
    const bookBtn = document.getElementById('bookNowBtn');
    if (bookBtn && commitmentPercentage > 15) {
      bookBtn.disabled = true;
    }
  }, 10);
  
  // Track calculation
  analytics.logEvent('calculate_savings', {
    destination: state.selectedDestination.id,
    adults: adults,
    children: children,
    monthly_salary: monthlySalary,
    weekly_deposit: weeklyDeposit,
    weeks_needed: weeksNeeded,
    total_price: basePrice,
    commitment_percentage: commitmentPercentage
  });
  
  fbq('track', 'AddToCart', {
    content_name: state.selectedDestination.name[state.lang],
    content_type: 'destination',
    value: basePrice,
    currency: 'MXN',
    num_items: totalTravelers
  });
  
  // Store in Firestore
  db.collection('simulator_sessions').add({
    destination: state.selectedDestination.id,
    adults: adults,
    children: children,
    monthlySalary: monthlySalary,
    weeklyDeposit: weeklyDeposit,
    weeksNeeded: weeksNeeded,
    totalPrice: basePrice,
    commitmentPercentage: commitmentPercentage,
    variant: state.variant,
    utm: state.userSession.utm,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
};

window.selectDestination = selectDestination;

// ===================================
// Date Selection & Activation Flow
// ===================================
window.proceedToDateSelection = async function() {
  const modalBody = document.getElementById('modalBody');
  const data = state.calculationData;
  
  // Check if commitment exceeds 15%
  if (data.commitmentPercentage > 15) {
    alert(state.lang === 'es' ? 
      'Tu compromiso mensual no debe exceder el 15% de tu ingreso. Por favor ajusta tu pago semanal antes de continuar.' : 
      'Your monthly commitment should not exceed 15% of your income. Please adjust your weekly payment before continuing.');
    return;
  }
  
  // Track InitiateCheckout event
  fbq('track', 'InitiateCheckout', {
    content_name: state.selectedDestination.name[state.lang],
    content_type: 'vacation_package',
    value: data.totalCost,
    currency: 'MXN'
  });
  console.log('📊 Meta Pixel: InitiateCheckout');
  
  // Get travel date from calculation (it's already a Date object)
  const travelDate = data.travelDate;
  const travelDateFormatted = travelDate.toLocaleDateString(state.lang === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Store the formatted travel date in state
  state.calculationData.travelDateFormatted = travelDateFormatted;
  
  // Calculate minimum date string for date picker (use local time components)
  const minDateStr = `${travelDate.getFullYear()}-${String(travelDate.getMonth() + 1).padStart(2, '0')}-${String(travelDate.getDate()).padStart(2, '0')}`;
  
  // Calculate maximum date (1 year from min date)
  const maxDate = new Date(travelDate);
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = `${maxDate.getFullYear()}-${String(maxDate.getMonth() + 1).padStart(2, '0')}-${String(maxDate.getDate()).padStart(2, '0')}`;
  
  modalBody.innerHTML = `
    <h2 style="margin-bottom: 0.5rem; text-align: center; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      ${state.lang === 'es' ? 'Selecciona tus fechas' : 'Select your dates'}
    </h2>
    
    <p style="text-align: center; font-size: 0.875rem; color: var(--color-gray-600); margin-bottom: 0.5rem;">
      ${state.lang === 'es' ? 
        'Elige cuándo quieres viajar. Nosotros garantizamos tu reserva mientras pagas.' : 
        'Choose when you want to travel. We guarantee your booking while you pay.'}
    </p>
    <p style="text-align: center; font-size: 0.8125rem; color: var(--color-primary); font-weight: 600; margin-bottom: 1.5rem;">
      ${state.lang === 'es' ? 
        '👇 Selecciona cualquier fecha disponible que prefieras' : 
        '👇 Select any available date you prefer'}
    </p>
    
    <div style="background: var(--color-gray-50); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem;">
      <div style="text-align: center; margin-bottom: 1rem;">
        <div style="font-size: 0.875rem; color: var(--color-gray-600); margin-bottom: 0.5rem;">
          ${state.lang === 'es' ? 'Destino' : 'Destination'}
        </div>
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">
          ${state.selectedDestination.name[state.lang]}
        </div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 0.875rem; color: var(--color-gray-600);">
          ${state.lang === 'es' ? 'Paquete: 4 días / 3 noches' : 'Package: 4 days / 3 nights'}
        </div>
      </div>
    </div>
    
    <div style="margin-bottom: 1.5rem;">
      <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
        ${state.lang === 'es' ? 'Fecha de check-in' : 'Check-in date'}
      </label>
      <p style="font-size: 0.75rem; color: var(--color-gray-600); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.375rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ${state.lang === 'es' ? 
          `Disponible desde: ${travelDateFormatted}` : 
          `Available from: ${travelDateFormatted}`}
      </p>
      <input type="date" 
             id="checkInDate" 
             min="${minDateStr}" 
             max="${maxDateStr}"
             value="${minDateStr}"
             style="width: 100%; padding: 0.875rem; border: 2px solid var(--color-gray-200); border-radius: var(--radius-md); font-size: 1rem;">
      <p style="font-size: 0.75rem; color: var(--color-gray-500); margin-top: 0.5rem;">
        ${state.lang === 'es' ? 
          'Solo puedes viajar después de completar tus pagos' : 
          'You can only travel after completing your payments'}
      </p>
    </div>
    
    <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(0, 107, 94, 0.12)); border: 2px solid var(--color-secondary); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(212, 175, 55, 0.15);">
      <div style="display: flex; gap: 0.75rem; align-items: start;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary-dark)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <div style="font-size: 0.875rem; color: var(--color-primary-dark); line-height: 1.5;">
          ${state.lang === 'es' ? 
            'Reservamos tu paquete y garantizamos estas fechas mientras pagas. Puedes cambiar las fechas hasta 1 mes antes del viaje.' : 
            'We book your package and guarantee these dates while you pay. You can change dates up to 1 month before travel.'}
        </div>
      </div>
    </div>
    
    <button class="btn-primary btn-large btn-block" onclick="proceedToEnrollment()">
      ${state.lang === 'es' ? 'Continuar' : 'Continue'}
    </button>
    
    <button onclick="openSimulatorModal()" style="width: 100%; padding: 0.75rem; margin-top: 0.75rem; background: none; border: none; color: var(--color-gray-600); cursor: pointer;">
      ${state.lang === 'es' ? '← Volver al calculador' : '← Back to calculator'}
    </button>
  `;
};

window.proceedToEnrollment = async function() {
  const checkInDate = document.getElementById('checkInDate').value;
  
  if (!checkInDate) {
    alert(state.lang === 'es' ? 'Por favor selecciona una fecha' : 'Please select a date');
    return;
  }
  
  const data = state.calculationData;
  
  // Parse date correctly to avoid timezone issues
  const [year, month, day] = checkInDate.split('-').map(Number);
  const checkInDateObj = new Date(year, month - 1, day); // month is 0-indexed
  
  // Validate that selected date is not before minimum date (compare date strings, not Date objects)
  const minTravelDate = data.travelDate;
  const minDateStr = `${minTravelDate.getFullYear()}-${String(minTravelDate.getMonth() + 1).padStart(2, '0')}-${String(minTravelDate.getDate()).padStart(2, '0')}`;
  
  if (checkInDate < minDateStr) {
    alert(state.lang === 'es' ? 
      `La fecha mínima disponible es ${minTravelDate.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}. Por favor selecciona una fecha válida.` : 
      `The minimum available date is ${minTravelDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. Please select a valid date.`
    );
    return;
  }
  
  const checkOutDate = new Date(year, month - 1, day + 3); // Add 3 days for checkout
  
  // Store selected date in state
  state.calculationData.selectedTravelDate = checkInDateObj;
  state.calculationData.selectedTravelDateFormatted = checkInDateObj.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Load enrollment form
  const modalBody = document.getElementById('modalBody');
  
  try {
    const response = await fetch('/enrollment-form.html?v=' + Date.now());
    const html = await response.text();
    modalBody.innerHTML = html;
    
    // Import i18n and translate the enrollment form
    const { i18n } = await import('./i18n.js');
    i18n.translatePage();
    
    // Dynamically import and initialize enrollment form
    const { enrollmentForm } = await import('./enrollment-form.js');
    enrollmentForm.init();
    
    console.log('✅ Enrollment form loaded and translated');
  } catch (error) {
    console.error('❌ Failed to load enrollment form:', error);
    alert(state.lang === 'es' ? 
      'Error al cargar el formulario. Por favor intenta de nuevo.' : 
      'Error loading form. Please try again.');
  }
  
  return; // Skip the old summary HTML below
  
  const modalBody2 = document.getElementById('modalBody');
  
  modalBody.innerHTML = `
    <h2 style="margin-bottom: 0.5rem; text-align: center; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      ${state.lang === 'es' ? 'Resumen de tu viaje' : 'Your trip summary'}
    </h2>
    
    <p style="text-align: center; font-size: 0.875rem; color: var(--color-gray-600); margin-bottom: 1rem;">
      ${state.lang === 'es' ? 
        'Revisa los detalles y activa tu crédito vacacional' : 
        'Review the details and activate your vacation credit'}
    </p>
    
    <div style="background: var(--color-gray-50); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--color-gray-200);">
        <span style="color: var(--color-gray-600);">${state.lang === 'es' ? 'Destino' : 'Destination'}</span>
        <span style="font-weight: 600;">${state.selectedDestination.name[state.lang]}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--color-gray-200);">
        <span style="color: var(--color-gray-600);">${state.lang === 'es' ? 'Check-in' : 'Check-in'}</span>
        <span style="font-weight: 600;">${checkInDateObj.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--color-gray-200);">
        <span style="color: var(--color-gray-600);">${state.lang === 'es' ? 'Check-out' : 'Check-out'}</span>
        <span style="font-weight: 600;">${checkOutDate.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--color-gray-200);">
        <span style="color: var(--color-gray-600);">${state.lang === 'es' ? 'Viajeros' : 'Travelers'}</span>
        <span style="font-weight: 600;">${data.adults} ${state.lang === 'es' ? 'adulto(s)' : 'adult(s)'}, ${data.children} ${state.lang === 'es' ? 'niño(s)' : 'child(ren)'}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--color-gray-200);">
        <span style="color: var(--color-gray-600);">${state.lang === 'es' ? 'Paquete' : 'Package'}</span>
        <span style="font-weight: 600;">${state.lang === 'es' ? '4 días / 3 noches' : '4 days / 3 nights'}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--color-gray-200);">
        <span style="color: var(--color-gray-600);">${state.lang === 'es' ? 'Costo total' : 'Total cost'}</span>
        <span style="font-weight: 700; color: var(--color-primary);">$${data.totalPrice.toLocaleString('es-MX')} MXN</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.75rem 0;">
        <span style="color: var(--color-gray-600);">${state.lang === 'es' ? 'Pago semanal' : 'Weekly payment'}</span>
        <span style="font-weight: 600;">$${data.weeklyDeposit.toLocaleString('es-MX')} MXN</span>
      </div>
    </div>
    
    <div style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%); color: white; border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
      <div style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 0.5rem;">
        ${state.lang === 'es' ? 'Para activar tu crédito vacacional' : 'To activate your vacation credit'}
      </div>
      <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">
        $500 MXN
      </div>
      <div style="font-size: 0.875rem; opacity: 0.9;">
        ${state.lang === 'es' ? 'Depósito de activación' : 'Activation deposit'}
      </div>
      <div style="font-size: 0.75rem; opacity: 0.8; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.3);">
        ${state.lang === 'es' ? 
          'Este monto se aplica directamente a tu paquete' : 
          'This amount is applied directly to your package'}
      </div>
    </div>
    
    <button class="btn-primary btn-large btn-block" onclick="activateCredit()">
      ${state.lang === 'es' ? 'Activar crédito ($500)' : 'Activate credit ($500)'}
    </button>
    
    <button onclick="proceedToDateSelection()" style="width: 100%; padding: 0.75rem; margin-top: 0.75rem; background: none; border: none; color: var(--color-gray-600); cursor: pointer;">
      ${state.lang === 'es' ? '← Cambiar fechas' : '← Change dates'}
    </button>
  `;
  
  // Store check-in date
  state.calculationData.checkInDate = checkInDate;
  state.calculationData.checkOutDate = checkOutDate.toISOString().split('T')[0];
};

window.activateCredit = function() {
  // Track conversion
  const data = state.calculationData;
  
  analytics.logEvent('begin_checkout', {
    destination: state.selectedDestination.id,
    value: data.totalPrice,
    currency: 'MXN',
    items: [{
      item_id: state.selectedDestination.id,
      item_name: state.selectedDestination.name[state.lang],
      price: data.totalPrice,
      quantity: 1
    }]
  });
  
  fbq('track', 'InitiateCheckout', {
    content_name: state.selectedDestination.name[state.lang],
    content_type: 'destination',
    value: data.totalPrice,
    currency: 'MXN',
    num_items: data.adults + data.children
  });
  
  // Store in Firestore
  db.collection('activation_payments').add({
    destination: state.selectedDestination.id,
    ...data,
    status: 'pending_payment',
    variant: state.variant,
    utm: state.userSession.utm,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  // Show payment form (simplified for now)
  const modalBody = document.getElementById('modalBody');
  
  modalBody.innerHTML = `
    <h2 style="margin-bottom: 0.5rem; text-align: center; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
      ${state.lang === 'es' ? '¡Último paso!' : 'Final step!'}
    </h2>
    
    <p style="text-align: center; font-size: 0.875rem; color: var(--color-gray-600); margin-bottom: 1.5rem;">
      ${state.lang === 'es' ? 
        'Haz clic abajo para solicitar contacto y recibir instrucciones de pago' : 
        'Click below to request contact and receive payment instructions'}
    </p>
    
    <div style="text-align: center; margin-bottom: 2rem;">
      <div style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--color-gray-700);">
        ${state.lang === 'es' ? 'Depósito de activación' : 'Activation deposit'}
      </div>
      <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">
        $500 MXN
      </div>
      <div style="font-size: 0.75rem; color: var(--color-gray-600); display: flex; align-items: center; justify-content: center; gap: 0.375rem;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ${state.lang === 'es' ? 'Se aplica a tu paquete de $' + data.totalPrice.toLocaleString('es-MX') : 'Applied to your $' + data.totalPrice.toLocaleString('es-MX') + ' package'}
      </div>
    </div>
    
    <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(0, 107, 94, 0.12)); border: 2px solid var(--color-secondary); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(212, 175, 55, 0.15);">
      <div style="display: flex; gap: 0.75rem; align-items: start;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary-dark)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 1 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
        <p style="color: var(--color-primary-dark); line-height: 1.5; font-size: 0.875rem; margin: 0;">
          ${state.lang === 'es' ? 
            'Un asesor te contactará para completar tu activación y responder cualquier pregunta.' : 
            'An advisor will contact you to complete your activation and answer any questions.'}
        </p>
      </div>
    </div>
    
    <button class="btn-primary btn-large btn-block" onclick="submitLead()">
      ${state.lang === 'es' ? 'Solicitar contacto' : 'Request contact'}
    </button>
  `;
};

window.submitLead = function() {
  alert(state.lang === 'es' ? 
    '¡Gracias! Un asesor se pondrá en contacto contigo pronto.' : 
    'Thank you! An advisor will contact you soon.');
  
  // Track purchase intent
  fbq('track', 'Purchase', {
    value: 500,
    currency: 'MXN',
    content_name: state.selectedDestination.name[state.lang]
  });
  
  closeSimulatorModal();
};

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
    
    // Initialize video autoplay for iOS
    initVideoAutoplay();
    
    console.log('✅ VIDA Travel - Ready!');
    
  } catch (error) {
    console.error('❌ Initialization error:', error);
  }
}

// ===================================
// iOS Video Autoplay Fix
// ===================================
function initVideoAutoplay() {
  // Force all videos to play (iOS compatible)
  const allVideos = document.querySelectorAll('video');
  
  // Intersection Observer to play videos when visible
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        // Try to play video when it comes into view
        video.play().catch(err => {
          console.log('Video autoplay prevented (user interaction needed):', err);
        });
      } else {
        // Pause video when not visible (save battery)
        video.pause();
      }
    });
  }, { threshold: 0.25 });
  
  allVideos.forEach(video => {
    // Set iOS-specific attributes
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('x5-playsinline', '');
    video.muted = true; // Must be muted for autoplay on iOS
    
    // Observe video
    videoObserver.observe(video);
    
    // Try to play immediately
    video.play().catch(err => {
      console.log('Initial video autoplay prevented:', err);
      
      // If autoplay fails, try on first user interaction
      const playOnInteraction = () => {
        video.play();
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('click', playOnInteraction);
      };
      
      document.addEventListener('touchstart', playOnInteraction, { once: true });
      document.addEventListener('click', playOnInteraction, { once: true });
    });
  });
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

