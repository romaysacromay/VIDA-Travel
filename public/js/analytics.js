/**
 * VIDA Travel - Central Analytics Module
 * Coordinates all analytics tracking: Google Analytics, Meta Pixel, and Firestore
 */

import { utmTracker } from './utm-tracker.js';
import { variantManager } from './variant-manager.js';
import { metaTracking } from './meta-tracking.js';

export class Analytics {
  constructor() {
    this.initialized = false;
    this.sessionData = {};
  }

  /**
   * Initialize analytics
   */
  async init() {
    console.log('🔧 Initializing analytics...');

    // Initialize session data
    this.sessionData = {
      session_id: utmTracker.getSessionId(),
      session_start: new Date().toISOString(),
      variant_id: variantManager.getVariantId()
    };

    this.initialized = true;
    console.log('✅ Analytics initialized');

    // Track initial page view
    this.trackPageView();
  }

  /**
   * Track page view
   */
  trackPageView() {
    const pageData = {
      page_url: window.location.href,
      page_title: document.title,
      page_path: window.location.pathname,
      referrer: document.referrer
    };

    // Google Analytics
    this.trackGA4Event('page_view', pageData);

    // Meta Pixel (handled automatically by script, but we log it)
    console.log('📄 Page view tracked');

    // Firestore
    this.logToFirestore('page_view', pageData);
  }

  /**
   * Track destination selection (ViewContent)
   */
  trackDestinationSelected(destination, packagePrice) {
    const eventData = {
      destination,
      package_price: packagePrice,
      event_category: 'engagement',
      event_label: `destination_${destination}`
    };

    // Google Analytics
    this.trackGA4Event('destination_selected', eventData);

    // Meta Pixel
    metaTracking.trackViewContent(destination, packagePrice);

    // Firestore
    this.logToFirestore('destination_selected', eventData);

    console.log('📍 Destination selected:', destination);
  }

  /**
   * Track financial info entered (Step 2 complete)
   */
  trackFinancialInfoEntered(financialData) {
    const eventData = {
      monthly_salary: financialData.monthlySalary,
      weekly_deposit: financialData.weeklyDeposit,
      event_category: 'engagement',
      event_label: 'step_2_completed'
    };

    // Google Analytics
    this.trackGA4Event('financial_info_entered', eventData);

    // Firestore
    this.logToFirestore('financial_info_entered', eventData);

    console.log('💰 Financial info entered');
  }

  /**
   * Track simulator completed (AddToCart)
   */
  trackSimulatorCompleted(planData) {
    const eventData = {
      destination: planData.destination,
      package_price: planData.packagePrice,
      savings_weeks: planData.savingsWeeks,
      loan_amount: planData.loanAmount,
      total_monthly_payment: planData.totalMonthlyPayment,
      event_category: 'conversion',
      event_label: 'simulator_completed',
      value: planData.packagePrice
    };

    // Google Analytics
    this.trackGA4Event('simulator_completed', eventData);

    // Meta Pixel
    metaTracking.trackAddToCart(planData);

    // Firestore
    this.logToFirestore('simulator_completed', eventData);

    console.log('🎯 Simulator completed');
  }

  /**
   * Track enrollment initiated (InitiateCheckout)
   */
  trackEnrollmentInitiated(planData) {
    const eventData = {
      destination: planData.destination,
      package_price: planData.packagePrice,
      enrollment_fee: 500,
      event_category: 'conversion',
      event_label: 'enrollment_initiated',
      value: 500
    };

    // Google Analytics
    this.trackGA4Event('enrollment_initiated', eventData);

    // Meta Pixel
    metaTracking.trackInitiateCheckout(planData);

    // Firestore
    this.logToFirestore('enrollment_initiated', eventData);

    console.log('🚀 Enrollment initiated');
  }

  /**
   * Track payment info added (AddPaymentInfo)
   */
  trackPaymentInfoAdded(planData) {
    const eventData = {
      destination: planData.destination,
      payment_method: 'card',
      event_category: 'conversion',
      event_label: 'payment_info_added',
      value: 500
    };

    // Google Analytics
    this.trackGA4Event('payment_info_added', eventData);

    // Meta Pixel
    metaTracking.trackAddPaymentInfo(planData);

    // Firestore
    this.logToFirestore('payment_info_added', eventData);

    console.log('💳 Payment info added');
  }

  /**
   * Track purchase completed (PRIMARY CONVERSION)
   */
  async trackPurchaseCompleted(planData, paymentData) {
    const eventId = metaTracking.generateEventId();
    
    const eventData = {
      transaction_id: paymentData.transactionId,
      destination: planData.destination,
      package_price: planData.packagePrice,
      enrollment_fee: 500,
      value: 500,
      currency: 'MXN',
      event_category: 'conversion',
      event_label: 'purchase_completed',
      // Full plan data for analysis
      adults: planData.adults,
      children: planData.children,
      savings_weeks: planData.savingsWeeks,
      loan_amount: planData.loanAmount,
      total_monthly_payment: planData.totalMonthlyPayment,
      earliest_checkin: planData.earliestCheckIn,
      selected_checkin: planData.selectedCheckIn,
      selected_checkout: planData.selectedCheckOut
    };

    // Google Analytics
    this.trackGA4Event('purchase', eventData);

    // Meta Pixel (with event ID for deduplication)
    metaTracking.trackPurchase(planData, paymentData, eventId);

    // Firestore with complete session data
    await this.saveSimulatorSession(planData, paymentData);

    console.log('🎉 Purchase completed!', eventData);

    return eventId;
  }

  /**
   * Track chat opened
   */
  trackChatOpened() {
    const eventData = {
      event_category: 'engagement',
      event_label: 'chat_opened'
    };

    // Google Analytics
    this.trackGA4Event('chat_opened', eventData);

    // Firestore
    this.logToFirestore('chat_opened', eventData);

    console.log('💬 Chat opened');
  }

  /**
   * Track chat message sent
   */
  trackChatMessage(messageLength, responseTime = null) {
    const eventData = {
      message_length: messageLength,
      response_time: responseTime,
      event_category: 'engagement',
      event_label: 'chat_message_sent'
    };

    // Google Analytics
    this.trackGA4Event('chat_message_sent', eventData);

    // Firestore
    this.logToFirestore('chat_message_sent', eventData);

    console.log('💬 Chat message sent');
  }

  /**
   * Track error
   */
  trackError(errorType, errorMessage, errorContext = {}) {
    const eventData = {
      error_type: errorType,
      error_message: errorMessage,
      ...errorContext,
      event_category: 'error',
      event_label: errorType
    };

    // Google Analytics
    this.trackGA4Event('error', eventData);

    // Firestore
    this.logToFirestore('error', eventData);

    console.error('❌ Error tracked:', errorType, errorMessage);
  }

  /**
   * Track Google Analytics 4 event
   */
  trackGA4Event(eventName, eventData = {}) {
    if (!window.firebaseAnalytics) {
      console.warn('⚠️ Google Analytics not available');
      return;
    }

    try {
      const enrichedData = this.enrichEventData(eventData);
      
      if (window.firebaseLogEvent) {
        window.firebaseLogEvent(window.firebaseAnalytics, eventName, enrichedData);
      }
    } catch (error) {
      console.error('❌ GA4 tracking failed:', error);
    }
  }

  /**
   * Log event to Firestore
   */
  async logToFirestore(eventType, eventData) {
    if (!window.firebaseDb) return;

    try {
      const { collection, addDoc, serverTimestamp } = await import(
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
      );

      const enrichedData = this.enrichEventData(eventData);

      const logData = {
        event_type: eventType,
        event_data: enrichedData,
        session_id: this.sessionData.session_id,
        timestamp: serverTimestamp(),
        page_url: window.location.href,
        user_agent: navigator.userAgent
      };

      await addDoc(collection(window.firebaseDb, 'analytics_events'), logData);
    } catch (error) {
      console.error('❌ Failed to log event to Firestore:', error);
    }
  }

  /**
   * Save complete simulator session to Firestore
   */
  async saveSimulatorSession(planData, paymentData) {
    if (!window.firebaseDb) return;

    try {
      const { collection, addDoc, serverTimestamp } = await import(
        'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
      );

      const sessionData = {
        // Session info
        session_id: this.sessionData.session_id,
        variant_id: variantManager.getVariantId(),
        
        // Destination & travelers
        destination: planData.destination,
        adults: planData.adults,
        children: planData.children,
        
        // Financial info
        monthly_salary: planData.monthlySalary,
        weekly_deposit: planData.weeklyDeposit,
        
        // Pricing
        package_price: planData.packagePrice,
        savings_required: planData.savingsRequired,
        loan_amount: planData.loanAmount,
        loan_percentage: planData.loanPercentage,
        
        // Timeline
        savings_weeks: planData.savingsWeeks,
        earliest_checkin: planData.earliestCheckIn,
        selected_checkin: planData.selectedCheckIn,
        selected_checkout: planData.selectedCheckOut,
        
        // Payments
        monthly_deposit: planData.monthlyDeposit,
        monthly_loan_payment: planData.monthlyLoanPayment,
        total_monthly_payment: planData.totalMonthlyPayment,
        
        // Conversion
        converted: true,
        transaction_id: paymentData.transactionId,
        payment_method: paymentData.paymentMethod,
        enrollment_fee: 500,
        
        // Attribution
        ...utmTracker.getUTMParams(),
        
        // Metadata
        timestamp: serverTimestamp(),
        user_agent: navigator.userAgent,
        exported: false
      };

      const docRef = await addDoc(collection(window.firebaseDb, 'simulator_sessions'), sessionData);
      console.log('✅ Simulator session saved:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('❌ Failed to save simulator session:', error);
      throw error;
    }
  }

  /**
   * Enrich event data with session and variant info
   */
  enrichEventData(eventData) {
    return {
      ...eventData,
      session_id: this.sessionData.session_id,
      variant_id: variantManager.getVariantId(),
      ...utmTracker.getUTMParams(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get session summary
   */
  getSessionSummary() {
    return {
      ...this.sessionData,
      variant: variantManager.getCurrentVariant(),
      utm: utmTracker.getUTMParams(),
      attribution: utmTracker.getAttributionSummary()
    };
  }

  /**
   * Export analytics data
   */
  exportData() {
    return {
      session: this.sessionData,
      variant: variantManager.exportForAnalytics(),
      utm: utmTracker.exportForAnalytics(),
      meta_pixel: metaTracking.getStatus()
    };
  }
}

// Initialize and export singleton
export const analytics = new Analytics();

// Auto-initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => analytics.init());
  } else {
    analytics.init();
  }
}

export default analytics;

