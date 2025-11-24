/**
 * VIDA Travel - Internationalization Module
 * Handles Spanish/English language switching
 */

export class I18n {
  constructor() {
    this.currentLang = 'es';
    this.storageKey = 'vida_language';
    this.translations = {
      es: {
        // Navigation
        'nav.howItWorks': 'Cómo Funciona',
        'nav.calculator': 'Calculadora',
        
        // Hero
        'hero.headline': 'Tu Viaje Soñado con 0% de Interés',
        'hero.subheadline': 'Planifica, ahorra semanalmente y viaja por México sin preocupaciones',
        'hero.cta': 'Planifica Tu Viaje',
        
        // How It Works
        'howItWorks.title': '¿Cómo Funciona?',
        'howItWorks.step1.title': 'Elige Tu Destino',
        'howItWorks.step1.description': 'Selecciona entre los mejores destinos de México y define el número de viajeros',
        'howItWorks.step2.title': 'Calcula Tu Plan',
        'howItWorks.step2.description': 'Ingresa tu salario y ahorro semanal. Calculamos tu fecha más cercana de viaje',
        'howItWorks.step3.title': '¡Viaja Sin Intereses!',
        'howItWorks.step3.description': 'Ahorra el 80%, nosotros cubrimos el 20% sin interés. Paga solo $500 de inscripción',
        
        // Common
        'simulator.continue': 'Continuar',
        'simulator.back': 'Regresar',
        'loading.processing': 'Procesando tu pago...',
        
        // Success Modal
        'successModal.title': '¡Pago Exitoso!',
        'successModal.message': 'Tu plan de ahorro ha sido activado. Recibirás un correo con todos los detalles.',
        'successModal.nextSteps': '¿Qué sigue? Comienza a hacer tus depósitos semanales y te recordaremos tu progreso.',
        'successModal.button': 'Planificar Otro Viaje',
        
        // Footer
        'footer.company': 'Empresa',
        'footer.about': 'Nosotros',
        'footer.faq': 'Preguntas Frecuentes',
        'footer.contact': 'Contacto',
        'footer.legal': 'Legal',
        'footer.terms': 'Términos y Condiciones',
        'footer.privacy': 'Política de Privacidad',
        'footer.cookies': 'Política de Cookies',
        'footer.followUs': 'Síguenos',
        'footer.copyright': 'Todos los derechos reservados.',
        
        // Form Validation
        'validation.required': 'Por favor completa este campo.',
        'validation.emailInvalid': 'Por favor ingresa un correo electrónico válido.',
        'validation.phoneInvalid': 'Por favor ingresa un número de teléfono válido.',
        'validation.phoneFormat': 'Formato: 555-123-4567',
        'validation.tooShort': 'Debe tener al menos {min} caracteres.',
        'validation.nameRequired': 'Por favor ingresa tu nombre completo',
        'validation.emailRequired': 'Por favor ingresa tu correo electrónico',
        'validation.phoneRequired': 'Por favor ingresa tu número de teléfono',
        'validation.phoneLength': 'El teléfono debe tener 10 dígitos',
        'validation.regionRequired': 'Por favor selecciona tu estado',
        'validation.otpLength': 'Por favor ingresa el código de 6 dígitos',
        
        // OTP Messages
        'otp.sending': 'Enviando código...',
        'otp.sent': 'Código enviado! Revisa tu email.',
        'otp.verifying': 'Verificando código...',
        'otp.verified': 'Email verificado! Ya puedes activar tu crédito.',
        'otp.invalid': '❌ Código incorrecto. Intenta de nuevo.',
        'otp.errorSending': 'Error al enviar código. Intenta de nuevo.',
        'otp.emailInvalid': 'Por favor ingresa un email válido',
        'otp.timeout': 'La solicitud tardó demasiado. Verifica tu conexión e intenta de nuevo.',
        'otp.networkError': 'Error de conexión. Verifica tu internet e intenta de nuevo.',
        
        // Activation Messages
        'activation.processing': 'Activando tu crédito...',
        'activation.error': '❌ Error al activar crédito. Intenta de nuevo.',
        'activation.success': '¡Registro Exitoso!',
        'activation.launching': 'Estamos en proceso de lanzamiento',
        'activation.registrationId': 'ID de registro:',
        'activation.deposit': 'Depósito:',
        'activation.email': 'Email:',
        'activation.limitedSpots': 'Actualmente estamos aceptando un número limitado de participantes para nuestra fase de lanzamiento. Te enviaremos un email en cuanto se abra espacio para activar tu crédito vacacional.',
        'activation.thanks': 'Gracias por confiar en VIDA Travel. ¡Pronto viajarás!',
        'activation.goHome': 'Ir al inicio',
        
        // Travelers
        'travelers.adult': 'adulto',
        'travelers.adults': 'adultos',
        'travelers.child': 'niño',
        'travelers.children': 'niños',
        
        // General Errors
        'error.loadForm': 'Error al cargar el formulario. Por favor intenta de nuevo.',
        
        // Enrollment Form
        'enrollment.title': 'Información Personal',
        'enrollment.subtitle': 'Completa tus datos para activar tu crédito vacacional',
        'enrollment.nameLabel': 'Nombre Completo *',
        'enrollment.namePlaceholder': 'Juan Pérez García',
        'enrollment.emailLabel': 'Correo Electrónico *',
        'enrollment.emailPlaceholder': 'tu@email.com',
        'enrollment.emailNote': 'Enviaremos un código de verificación a este email',
        'enrollment.phoneLabel': 'Teléfono (10 dígitos) *',
        'enrollment.phonePlaceholder': '555-123-4567',
        'enrollment.regionLabel': 'Estado de la República *',
        'enrollment.regionPlaceholder': 'Selecciona tu estado',
        'enrollment.continue': 'Continuar',
        
        // OTP Section
        'enrollment.otpTitle': 'Verifica tu Email',
        'enrollment.otpSent': 'Enviamos un código de 6 dígitos a:',
        'enrollment.otpLabel': 'Código de Verificación',
        'enrollment.otpPlaceholder': '000000',
        'enrollment.verifyButton': 'Verificar Código',
        'enrollment.otpNote': '¿No recibiste el código? Revisa tu carpeta de spam. Podrás reenviarlo en',
        'enrollment.otpSeconds': 'segundos',
        'enrollment.resendButton': 'Reenviar Código',
        
        // Activation Section
        'enrollment.verifiedTitle': 'Email Verificado',
        'enrollment.verifiedSubtitle': 'Tu información ha sido confirmada',
        'enrollment.summaryTitle': 'Resumen de tu Reserva',
        'enrollment.destination': 'Destino',
        'enrollment.travelDate': 'Fecha de viaje',
        'enrollment.travelers': 'Viajeros',
        'enrollment.totalCost': 'Costo total del paquete',
        'enrollment.weeklyPayment': 'Pago semanal',
        'enrollment.depositLabel': 'Depósito de activación',
        'enrollment.depositNote': 'Este monto se aplica directamente a tu paquete',
        'enrollment.benefit1': 'Fechas de viaje garantizadas',
        'enrollment.benefit2': 'Sin intereses ni cargos ocultos',
        'enrollment.benefit3': 'Pausa pagos hasta 6 meses',
        'enrollment.activateButton': 'Activar crédito ($500)',
        'enrollment.termsNote': 'Al activar, aceptas nuestros',
        'enrollment.terms': 'términos y condiciones',
        'enrollment.loading': 'Cargando...',
        
        // Phone Mockup
        'phone.myPlan': 'Mi Plan de Viaje',
        'phone.active': 'Activo',
        'phone.daysNights': 'días / 3 noches',
        'phone.adults': 'adultos',
        'phone.packageCost': 'Costo del paquete',
        'phone.weeklyPayment': 'Pago semanal',
        'phone.progress': 'Progreso',
        'phone.paid': 'pagado',
        'phone.remaining': 'restante',
        'phone.travelDate': 'Fecha de viaje',
        'phone.weeksRemaining': 'semanas restantes'
      },
      en: {
        // Navigation
        'nav.howItWorks': 'How It Works',
        'nav.calculator': 'Calculator',
        
        // Hero
        'hero.headline': 'Your Dream Vacation with 0% Interest',
        'hero.subheadline': 'Plan, save weekly, and travel across Mexico worry-free',
        'hero.cta': 'Plan Your Trip',
        
        // How It Works
        'howItWorks.title': 'How Does It Work?',
        'howItWorks.step1.title': 'Choose Your Destination',
        'howItWorks.step1.description': 'Select from Mexico\'s best destinations and define the number of travelers',
        'howItWorks.step2.title': 'Calculate Your Plan',
        'howItWorks.step2.description': 'Enter your salary and weekly savings. We calculate your earliest travel date',
        'howItWorks.step3.title': 'Travel Interest-Free!',
        'howItWorks.step3.description': 'Save 80%, we cover 20% interest-free. Pay only $500 enrollment fee',
        
        // Common
        'simulator.continue': 'Continue',
        'simulator.back': 'Back',
        'loading.processing': 'Processing your payment...',
        
        // Success Modal
        'successModal.title': 'Payment Successful!',
        'successModal.message': 'Your savings plan has been activated. You will receive an email with all the details.',
        'successModal.nextSteps': 'What\'s next? Start making your weekly deposits and we\'ll remind you of your progress.',
        'successModal.button': 'Plan Another Trip',
        
        // Footer
        'footer.company': 'Company',
        'footer.about': 'About Us',
        'footer.faq': 'FAQ',
        'footer.contact': 'Contact',
        'footer.legal': 'Legal',
        'footer.terms': 'Terms & Conditions',
        'footer.privacy': 'Privacy Policy',
        'footer.cookies': 'Cookie Policy',
        'footer.followUs': 'Follow Us',
        'footer.copyright': 'All rights reserved.',
        
        // Form Validation
        'validation.required': 'Please complete this field.',
        'validation.emailInvalid': 'Please enter a valid email address.',
        'validation.phoneInvalid': 'Please enter a valid phone number.',
        'validation.phoneFormat': 'Format: 555-123-4567',
        'validation.tooShort': 'Must be at least {min} characters.',
        'validation.nameRequired': 'Please enter your full name',
        'validation.emailRequired': 'Please enter your email',
        'validation.phoneRequired': 'Please enter your phone number',
        'validation.phoneLength': 'Phone must be 10 digits',
        'validation.regionRequired': 'Please select your state',
        'validation.otpLength': 'Please enter the 6-digit code',
        
        // OTP Messages
        'otp.sending': 'Sending code...',
        'otp.sent': 'Code sent! Check your email.',
        'otp.verifying': 'Verifying code...',
        'otp.verified': 'Email verified! You can now activate your credit.',
        'otp.invalid': '❌ Incorrect code. Try again.',
        'otp.errorSending': 'Error sending code. Try again.',
        'otp.emailInvalid': 'Please enter a valid email',
        'otp.timeout': 'Request timed out. Check your connection and try again.',
        'otp.networkError': 'Connection error. Check your internet and try again.',
        
        // Activation Messages
        'activation.processing': 'Activating your credit...',
        'activation.error': '❌ Error activating credit. Try again.',
        'activation.success': 'Registration Successful!',
        'activation.launching': 'We are in the launch process',
        'activation.registrationId': 'Registration ID:',
        'activation.deposit': 'Deposit:',
        'activation.email': 'Email:',
        'activation.limitedSpots': 'We are currently accepting a limited number of participants for our launch phase. We will send you an email as soon as space opens up to activate your vacation credit.',
        'activation.thanks': 'Thank you for trusting VIDA Travel. You\'ll be traveling soon!',
        'activation.goHome': 'Go to home',
        
        // Travelers
        'travelers.adult': 'adult',
        'travelers.adults': 'adults',
        'travelers.child': 'child',
        'travelers.children': 'children',
        
        // General Errors
        'error.loadForm': 'Error loading form. Please try again.',
        
        // Enrollment Form
        'enrollment.title': 'Personal Information',
        'enrollment.subtitle': 'Complete your details to activate your vacation credit',
        'enrollment.nameLabel': 'Full Name *',
        'enrollment.namePlaceholder': 'John Doe',
        'enrollment.emailLabel': 'Email Address *',
        'enrollment.emailPlaceholder': 'you@email.com',
        'enrollment.emailNote': 'We will send a verification code to this email',
        'enrollment.phoneLabel': 'Phone (10 digits) *',
        'enrollment.phonePlaceholder': '555-123-4567',
        'enrollment.regionLabel': 'State *',
        'enrollment.regionPlaceholder': 'Select your state',
        'enrollment.continue': 'Continue',
        
        // OTP Section
        'enrollment.otpTitle': 'Verify Your Email',
        'enrollment.otpSent': 'We sent a 6-digit code to:',
        'enrollment.otpLabel': 'Verification Code',
        'enrollment.otpPlaceholder': '000000',
        'enrollment.verifyButton': 'Verify Code',
        'enrollment.otpNote': 'Didn\'t receive the code? Check your spam folder. You can resend it in',
        'enrollment.otpSeconds': 'seconds',
        'enrollment.resendButton': 'Resend Code',
        
        // Activation Section
        'enrollment.verifiedTitle': 'Email Verified',
        'enrollment.verifiedSubtitle': 'Your information has been confirmed',
        'enrollment.summaryTitle': 'Booking Summary',
        'enrollment.destination': 'Destination',
        'enrollment.travelDate': 'Travel date',
        'enrollment.travelers': 'Travelers',
        'enrollment.totalCost': 'Total package cost',
        'enrollment.weeklyPayment': 'Weekly payment',
        'enrollment.depositLabel': 'Activation deposit',
        'enrollment.depositNote': 'This amount is applied directly to your package',
        'enrollment.benefit1': 'Guaranteed travel dates',
        'enrollment.benefit2': 'No interest or hidden fees',
        'enrollment.benefit3': 'Pause payments up to 6 months',
        'enrollment.activateButton': 'Activate credit ($500)',
        'enrollment.termsNote': 'By activating, you accept our',
        'enrollment.terms': 'terms and conditions',
        'enrollment.loading': 'Loading...',
        
        // Phone Mockup
        'phone.myPlan': 'My Travel Plan',
        'phone.active': 'Active',
        'phone.daysNights': 'days / 3 nights',
        'phone.adults': 'adults',
        'phone.packageCost': 'Package cost',
        'phone.weeklyPayment': 'Weekly payment',
        'phone.progress': 'Progress',
        'phone.paid': 'paid',
        'phone.remaining': 'remaining',
        'phone.travelDate': 'Travel date',
        'phone.weeksRemaining': 'weeks remaining'
      }
    };
  }

  /**
   * Initialize i18n
   */
  init() {
    // Load saved language or detect from browser
    const savedLang = localStorage.getItem(this.storageKey);
    const browserLang = navigator.language.split('-')[0];
    
    this.currentLang = savedLang || (browserLang === 'en' ? 'en' : 'es');
    
    // Apply language
    this.setLanguage(this.currentLang, false);
    
    // Setup language toggle buttons
    this.setupLanguageToggle();
    
    console.log(`✅ Language initialized: ${this.currentLang}`);
  }

  /**
   * Setup language toggle buttons
   */
  setupLanguageToggle() {
    const langButtons = document.querySelectorAll('[data-lang]');
    
    langButtons.forEach(button => {
      button.addEventListener('click', () => {
        const lang = button.getAttribute('data-lang');
        this.setLanguage(lang);
      });
    });
  }

  /**
   * Set language
   */
  setLanguage(lang, save = true) {
    if (!this.translations[lang]) {
      console.warn(`Language ${lang} not supported`);
      return;
    }

    this.currentLang = lang;
    
    // Update HTML lang attribute
    document.documentElement.lang = lang === 'es' ? 'es-MX' : 'en-US';
    
    // Update all elements with data-i18n
    this.translatePage();
    
    // Update language toggle buttons
    this.updateLanguageToggle();
    
    // Save preference
    if (save) {
      localStorage.setItem(this.storageKey, lang);
    }
    
    console.log(`🌐 Language changed to: ${lang}`);
  }

  /**
   * Translate all elements on the page
   */
  translatePage() {
    // Support both data-i18n and data-lang-key attributes
    const elements = document.querySelectorAll('[data-i18n], [data-lang-key]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n') || element.getAttribute('data-lang-key');
      const translation = this.get(key);
      
      if (translation) {
        // Check if element has input/textarea/placeholder
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          if (element.hasAttribute('placeholder')) {
            element.placeholder = translation;
          } else {
            element.value = translation;
          }
        } else {
          element.textContent = translation;
        }
      }
    });
  }

  /**
   * Update language toggle button states
   */
  updateLanguageToggle() {
    const langButtons = document.querySelectorAll('[data-lang]');
    
    langButtons.forEach(button => {
      const lang = button.getAttribute('data-lang');
      if (lang === this.currentLang) {
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
      } else {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
      }
    });
  }

  /**
   * Get translation for key
   */
  get(key, fallback = null) {
    const translation = this.translations[this.currentLang]?.[key];
    return translation || fallback || key;
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLang;
  }

  /**
   * Check if current language is Spanish
   */
  isSpanish() {
    return this.currentLang === 'es';
  }

  /**
   * Check if current language is English
   */
  isEnglish() {
    return this.currentLang === 'en';
  }
}

// Initialize and export singleton
export const i18n = new I18n();

// Auto-initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
  } else {
    i18n.init();
  }
}

export default i18n;

