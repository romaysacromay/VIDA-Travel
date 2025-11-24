/**
 * VIDA Travel - Variant Manager Module
 * Handles A/B testing variant assignment and application
 */

import { utmTracker } from './utm-tracker.js';

export class VariantManager {
  constructor() {
    this.storageKey = 'vida_variant_assignment';
    this.currentVariant = null;
    this.variants = {
      control: {
        variant_id: 'control',
        distribution: 0.34,
        package_price_multiplier: 1.0,
        loan_percentage: 0.20,
        theme_color: '#2563eb',
        messaging_headline_es: '0% de Interés Garantizado',
        messaging_headline_en: '0% Interest Guaranteed',
        bonus_incentive: 0
      },
      pricing_high: {
        variant_id: 'pricing_high',
        distribution: 0.22,
        package_price_multiplier: 1.15,
        loan_percentage: 0.20,
        theme_color: '#7c3aed',
        messaging_headline_es: 'Viaja Ahora + $500 de Bonificación',
        messaging_headline_en: 'Travel Now + $500 Bonus',
        bonus_incentive: 500
      },
      pricing_low: {
        variant_id: 'pricing_low',
        distribution: 0.22,
        package_price_multiplier: 0.85,
        loan_percentage: 0.20,
        theme_color: '#059669',
        messaging_headline_es: 'Precio Especial - 15% de Descuento',
        messaging_headline_en: 'Special Price - 15% Off',
        bonus_incentive: 0
      },
      loan_30: {
        variant_id: 'loan_30',
        distribution: 0.22,
        package_price_multiplier: 1.0,
        loan_percentage: 0.30,
        theme_color: '#dc2626',
        messaging_headline_es: '¡30% de Crédito Sin Interés!',
        messaging_headline_en: '30% Interest-Free Credit!',
        bonus_incentive: 0
      }
    };
  }

  /**
   * Initialize variant assignment
   */
  async init() {
    // Check if already assigned
    this.currentVariant = this.getStoredVariant();

    if (this.currentVariant) {
      console.log('✅ Existing variant loaded:', this.currentVariant.variant_id);
      this.applyVariant(this.currentVariant);
      return this.currentVariant;
    }

    // Try to fetch from Firebase Remote Config
    try {
      await this.fetchRemoteConfig();
    } catch (error) {
      console.warn('⚠️ Remote Config fetch failed, using default variants:', error.message);
    }

    // Assign new variant
    this.currentVariant = this.assignVariant();
    this.storeVariant(this.currentVariant);
    this.applyVariant(this.currentVariant);
    
    // Track assignment
    await this.trackVariantAssignment();

    console.log('✅ New variant assigned:', this.currentVariant.variant_id);
    return this.currentVariant;
  }

  /**
   * Fetch variants from Firebase Remote Config
   */
  async fetchRemoteConfig() {
    if (!window.firebaseRemoteConfig) {
      throw new Error('Firebase Remote Config not initialized');
    }

    const remoteConfig = window.firebaseRemoteConfig;
    
    try {
      // Fetch and activate
      const { fetchAndActivate, getValue } = await import(
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-remote-config.js'
      );

      await fetchAndActivate(remoteConfig);

      // Update variants from Remote Config
      Object.keys(this.variants).forEach(variantId => {
        try {
          const configValue = getValue(remoteConfig, `variant_${variantId}`);
          if (configValue && configValue._value) {
            const remoteVariant = JSON.parse(configValue._value);
            this.variants[variantId] = { ...this.variants[variantId], ...remoteVariant };
          }
        } catch (e) {
          console.warn(`Could not parse variant ${variantId} from Remote Config`);
        }
      });

      console.log('✅ Remote Config loaded successfully');
    } catch (error) {
      console.warn('⚠️ Remote Config fetch failed:', error.message);
    }
  }

  /**
   * Assign variant based on distribution
   */
  assignVariant() {
    const random = Math.random();
    let cumulative = 0;

    for (const [variantId, variant] of Object.entries(this.variants)) {
      cumulative += variant.distribution;
      if (random < cumulative) {
        return { ...variant, assigned_at: new Date().toISOString() };
      }
    }

    // Fallback to control
    return { ...this.variants.control, assigned_at: new Date().toISOString() };
  }

  /**
   * Apply variant settings to the page
   */
  applyVariant(variant) {
    // Apply theme color
    document.documentElement.style.setProperty('--variant-primary', variant.theme_color);
    document.body.setAttribute('data-variant', variant.variant_id);

    // Update hero headline
    const heroHeadline = document.getElementById('hero-headline');
    if (heroHeadline) {
      const currentLang = document.documentElement.lang.startsWith('es') ? 'es' : 'en';
      const headlineKey = currentLang === 'es' ? 'messaging_headline_es' : 'messaging_headline_en';
      heroHeadline.textContent = variant[headlineKey];
    }

    // Apply variant-specific styles
    this.applyVariantStyles(variant);
  }

  /**
   * Apply variant-specific CSS
   */
  applyVariantStyles(variant) {
    // Create or update variant style tag
    let styleTag = document.getElementById('variant-styles');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'variant-styles';
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = `
      .btn-primary {
        background-color: ${variant.theme_color} !important;
      }
      
      .btn-primary:hover:not(:disabled) {
        background-color: ${this.adjustColorBrightness(variant.theme_color, 20)} !important;
      }

      .step-number {
        background: linear-gradient(135deg, ${variant.theme_color} 0%, #C3A574 100%);
      }
    `;
  }

  /**
   * Adjust color brightness
   */
  adjustColorBrightness(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
      0x1000000 + 
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  }

  /**
   * Get stored variant
   */
  getStoredVariant() {
    const stored = sessionStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Store variant assignment
   */
  storeVariant(variant) {
    sessionStorage.setItem(this.storageKey, JSON.stringify(variant));
  }

  /**
   * Track variant assignment in Firestore
   */
  async trackVariantAssignment() {
    if (!window.firebaseDb) return;

    try {
      const { collection, addDoc, serverTimestamp } = await import(
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
      );

      const assignmentData = {
        variant_id: this.currentVariant.variant_id,
        session_id: utmTracker.getSessionId(),
        assigned_at: serverTimestamp(),
        variant_config: this.currentVariant,
        utm_params: utmTracker.getUTMParams(),
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`
      };

      await addDoc(collection(window.firebaseDb, 'variant_assignments'), assignmentData);
      console.log('✅ Variant assignment tracked in Firestore');
    } catch (error) {
      console.error('❌ Failed to track variant assignment:', error);
    }
  }

  /**
   * Get current variant
   */
  getCurrentVariant() {
    return this.currentVariant || this.getStoredVariant();
  }

  /**
   * Get variant configuration value
   */
  getVariantConfig(key, defaultValue = null) {
    const variant = this.getCurrentVariant();
    return variant ? (variant[key] ?? defaultValue) : defaultValue;
  }

  /**
   * Get price multiplier for current variant
   */
  getPriceMultiplier() {
    return this.getVariantConfig('package_price_multiplier', 1.0);
  }

  /**
   * Get loan percentage for current variant
   */
  getLoanPercentage() {
    return this.getVariantConfig('loan_percentage', 0.20);
  }

  /**
   * Get bonus incentive for current variant
   */
  getBonusIncentive() {
    return this.getVariantConfig('bonus_incentive', 0);
  }

  /**
   * Get variant ID
   */
  getVariantId() {
    const variant = this.getCurrentVariant();
    return variant ? variant.variant_id : 'control';
  }

  /**
   * Clear variant assignment (for testing)
   */
  clear() {
    sessionStorage.removeItem(this.storageKey);
    this.currentVariant = null;
  }

  /**
   * Force assign specific variant (for testing)
   */
  forceVariant(variantId) {
    if (this.variants[variantId]) {
      this.currentVariant = { 
        ...this.variants[variantId], 
        assigned_at: new Date().toISOString(),
        forced: true
      };
      this.storeVariant(this.currentVariant);
      this.applyVariant(this.currentVariant);
      console.log(`✅ Forced variant: ${variantId}`);
      return this.currentVariant;
    } else {
      console.error(`❌ Unknown variant: ${variantId}`);
      return null;
    }
  }

  /**
   * Export variant data for analytics
   */
  exportForAnalytics() {
    const variant = this.getCurrentVariant();
    return {
      variant_id: variant ? variant.variant_id : 'unknown',
      variant_config: variant,
      price_multiplier: this.getPriceMultiplier(),
      loan_percentage: this.getLoanPercentage(),
      bonus_incentive: this.getBonusIncentive()
    };
  }
}

// Initialize and export singleton
export const variantManager = new VariantManager();

// Auto-initialize on load (async)
if (typeof window !== 'undefined') {
  variantManager.init().catch(err => {
    console.error('Variant initialization failed:', err);
  });
}

export default variantManager;

