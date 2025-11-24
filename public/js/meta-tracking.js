/**
 * VIDA Travel - Meta Pixel Tracking Module
 * Handles Facebook/Meta Pixel events and Conversion API integration
 */

import { utmTracker } from './utm-tracker.js';
import { variantManager } from './variant-manager.js';

export class MetaTracking {
  constructor() {
    this.pixelId = '872606122006111';
    this.initialized = false;
    this.eventQueue = [];
  }

  /**
   * Initialize Meta Pixel tracking
   */
  init() {
    // Check if fbq is available
    if (typeof fbq !== 'undefined') {
      this.initialized = true;
      console.log('✅ Meta Pixel initialized');
      
      // Process queued events
      this.processQueuedEvents();
    } else {
      console.warn('⚠️ Meta Pixel (fbq) not found');
      
      // Retry after a delay
      setTimeout(() => this.init(), 1000);
    }
  }

  /**
   * Track standard event
   */
  trackEvent(eventName, eventData = {}, eventId = null) {
    const enrichedData = this.enrichEventData(eventData);
    const finalEventId = eventId || this.generateEventId();

    if (this.initialized && typeof fbq !== 'undefined') {
      fbq('track', eventName, enrichedData, { eventID: finalEventId });
      console.log(`📊 Meta Pixel: ${eventName}`, enrichedData);

      // Send to Conversion API for server-side tracking (with deduplication)
      this.sendToConversionAPI(eventName, enrichedData, finalEventId);
    } else {
      // Queue for later
      this.eventQueue.push({ eventName, eventData: enrichedData, eventId: finalEventId });
    }

    return finalEventId;
  }

  /**
   * Track custom event
   */
  trackCustomEvent(eventName, eventData = {}) {
    const enrichedData = this.enrichEventData(eventData);

    if (this.initialized && typeof fbq !== 'undefined') {
      fbq('trackCustom', eventName, enrichedData);
      console.log(`📊 Meta Pixel Custom: ${eventName}`, enrichedData);
    } else {
      this.eventQueue.push({ eventName, eventData: enrichedData, custom: true });
    }
  }

  /**
   * Track PageView (automatically called by Meta Pixel script)
   */
  trackPageView() {
    return this.trackEvent('PageView', {
      page_url: window.location.href,
      page_title: document.title
    });
  }

  /**
   * Track ViewContent (destination selected)
   */
  trackViewContent(destination, packagePrice) {
    return this.trackEvent('ViewContent', {
      content_name: destination,
      content_type: 'destination',
      content_ids: [destination],
      value: packagePrice,
      currency: 'MXN'
    });
  }

  /**
   * Track AddToCart (simulator completed)
   */
  trackAddToCart(planData) {
    return this.trackEvent('AddToCart', {
      content_name: planData.destination,
      content_type: 'vacation_package',
      content_ids: [planData.destination],
      value: planData.packagePrice,
      currency: 'MXN',
      num_items: 1,
      adults: planData.adults,
      children: planData.children
    });
  }

  /**
   * Track InitiateCheckout (enrollment clicked)
   */
  trackInitiateCheckout(planData) {
    return this.trackEvent('InitiateCheckout', {
      content_name: planData.destination,
      content_type: 'vacation_package',
      content_ids: [planData.destination],
      value: planData.packagePrice,
      currency: 'MXN',
      num_items: 1
    });
  }

  /**
   * Track AddPaymentInfo (payment method selected)
   */
  trackAddPaymentInfo(planData) {
    return this.trackEvent('AddPaymentInfo', {
      content_name: planData.destination,
      content_type: 'vacation_package',
      value: 500, // Enrollment fee
      currency: 'MXN'
    });
  }

  /**
   * Track Purchase (PRIMARY CONVERSION)
   */
  trackPurchase(planData, paymentData, eventId = null) {
    return this.trackEvent('Purchase', {
      content_name: planData.destination,
      content_type: 'enrollment_fee',
      content_ids: [planData.destination],
      value: 500, // Enrollment fee amount
      currency: 'MXN',
      transaction_id: paymentData.transactionId,
      num_items: 1,
      // Additional data for analysis
      package_total: planData.packagePrice,
      savings_weeks: planData.savingsWeeks,
      loan_amount: planData.loanAmount
    }, eventId);
  }

  /**
   * Track Lead (form submission)
   */
  trackLead(userData) {
    return this.trackEvent('Lead', {
      content_name: 'enrollment_form',
      value: 0,
      currency: 'MXN'
    });
  }

  /**
   * Enrich event data with UTM and variant information
   */
  enrichEventData(eventData) {
    const utmParams = utmTracker.getUTMParams();
    const variantData = variantManager.exportForAnalytics();

    return {
      ...eventData,
      // Variant information
      variant_id: variantData.variant_id,
      // Session information
      session_id: utmTracker.getSessionId(),
      // UTM parameters
      utm_source: utmParams?.utm_source,
      utm_medium: utmParams?.utm_medium,
      utm_campaign: utmParams?.utm_campaign,
      utm_content: utmParams?.utm_content,
      utm_term: utmParams?.utm_term,
      // Timestamp
      event_time: Math.floor(Date.now() / 1000)
    };
  }

  /**
   * Generate unique event ID for deduplication
   */
  generateEventId() {
    return `vida_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log event to Firestore for server-side tracking
   */
  async logToFirestore(eventName, eventData, eventId) {
    if (!window.firebaseDb) return;

    try {
      const { collection, addDoc, serverTimestamp } = await import(
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
      );

      const logData = {
        event_name: eventName,
        event_id: eventId,
        event_data: eventData,
        session_id: utmTracker.getSessionId(),
        timestamp: serverTimestamp(),
        user_agent: navigator.userAgent,
        page_url: window.location.href
      };

      await addDoc(collection(window.firebaseDb, 'meta_pixel_events'), logData);
    } catch (error) {
      console.error('❌ Failed to log Meta Pixel event to Firestore:', error);
    }
  }

  /**
   * Process queued events
   */
  processQueuedEvents() {
    if (this.eventQueue.length === 0) return;

    console.log(`📊 Processing ${this.eventQueue.length} queued Meta Pixel events`);

    this.eventQueue.forEach(({ eventName, eventData, eventId, custom }) => {
      if (custom) {
        this.trackCustomEvent(eventName, eventData);
      } else {
        this.trackEvent(eventName, eventData, eventId);
      }
    });

    this.eventQueue = [];
  }

  /**
   * Send event to Conversion API (via Cloud Function)
   */
  async sendToConversionAPI(eventName, eventData, eventId) {
    try {
      // Get Firebase Functions URL (adjust based on your deployment)
      const functionsUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5001/vida-travel-vacation-credit/us-central1/metaConversionAPI'
        : 'https://us-central1-vida-travel-vacation-credit.cloudfunctions.net/metaConversionAPI';

      const response = await fetch(functionsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventName,
          eventId,
          eventData: {
            ...eventData,
            page_url: window.location.href
          },
          userData: {
            client_user_agent: navigator.userAgent,
            fbc: this.getFbc(),
            fbp: this.getFbp()
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Event sent to Conversion API:', eventName, result);
      } else {
        const errorText = await response.text();
        console.error('❌ Conversion API request failed:', errorText);
      }
    } catch (error) {
      console.error('❌ Failed to send to Conversion API:', error);
      // Don't throw - we don't want to break the user experience
    }
  }

  /**
   * Get Facebook Click ID (fbc) from URL or cookie
   */
  getFbc() {
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    
    if (fbclid) {
      return `fb.1.${Date.now()}.${fbclid}`;
    }

    // Try to get from cookie
    const fbcCookie = document.cookie.split('; ').find(row => row.startsWith('_fbc='));
    return fbcCookie ? fbcCookie.split('=')[1] : null;
  }

  /**
   * Get Facebook Browser ID (fbp) from cookie
   */
  getFbp() {
    const fbpCookie = document.cookie.split('; ').find(row => row.startsWith('_fbp='));
    return fbpCookie ? fbpCookie.split('=')[1] : null;
  }

  /**
   * Check if user has opted out of tracking
   */
  hasOptedOut() {
    return localStorage.getItem('vida_tracking_opt_out') === 'true';
  }

  /**
   * Opt out of tracking
   */
  optOut() {
    localStorage.setItem('vida_tracking_opt_out', 'true');
    
    if (typeof fbq !== 'undefined') {
      fbq('consent', 'revoke');
    }
    
    console.log('✅ User opted out of Meta Pixel tracking');
  }

  /**
   * Opt in to tracking
   */
  optIn() {
    localStorage.removeItem('vida_tracking_opt_out');
    
    if (typeof fbq !== 'undefined') {
      fbq('consent', 'grant');
    }
    
    console.log('✅ User opted in to Meta Pixel tracking');
  }

  /**
   * Update consent status
   */
  updateConsent(hasConsent) {
    if (hasConsent) {
      this.optIn();
    } else {
      this.optOut();
    }
  }

  /**
   * Get tracking status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      pixelId: this.pixelId,
      optedOut: this.hasOptedOut(),
      queuedEvents: this.eventQueue.length
    };
  }
}

// Initialize and export singleton
export const metaTracking = new MetaTracking();

// Auto-initialize on load
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => metaTracking.init());
  } else {
    metaTracking.init();
  }
}

export default metaTracking;

