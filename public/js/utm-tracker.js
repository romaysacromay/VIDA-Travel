/**
 * VIDA Travel - UTM Tracker Module
 * Captures and persists UTM parameters for campaign attribution
 */

export class UTMTracker {
  constructor() {
    this.storageKey = 'vida_utm_params';
    this.sessionKey = 'vida_session_id';
    this.utmParams = null;
    this.sessionId = null;
  }

  /**
   * Initialize and capture UTM parameters
   */
  init() {
    // Generate or retrieve session ID
    this.sessionId = this.getOrCreateSessionId();

    // Capture UTM parameters from URL
    this.utmParams = this.captureUTMParams();

    // Store in sessionStorage
    if (this.utmParams) {
      sessionStorage.setItem(this.storageKey, JSON.stringify(this.utmParams));
      console.log('✅ UTM parameters captured:', this.utmParams);
    }

    return this.utmParams;
  }

  /**
   * Capture UTM parameters from URL
   */
  captureUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const utmParams = {
      utm_source: urlParams.get('utm_source') || this.getStoredParam('utm_source'),
      utm_medium: urlParams.get('utm_medium') || this.getStoredParam('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign') || this.getStoredParam('utm_campaign'),
      utm_content: urlParams.get('utm_content') || this.getStoredParam('utm_content'),
      utm_term: urlParams.get('utm_term') || this.getStoredParam('utm_term'),
      referrer: document.referrer || this.getStoredParam('referrer'),
      landing_page: window.location.href,
      timestamp: new Date().toISOString()
    };

    // Only return if at least one UTM parameter exists
    const hasUTM = Object.entries(utmParams).some(([key, value]) => 
      key.startsWith('utm_') && value
    );

    return hasUTM ? utmParams : this.getStoredParams();
  }

  /**
   * Get stored UTM parameter
   */
  getStoredParam(key) {
    const stored = sessionStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const params = JSON.parse(stored);
        return params[key] || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Get all stored UTM parameters
   */
  getStoredParams() {
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
   * Get or create session ID
   */
  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem(this.sessionKey);
    
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem(this.sessionKey, sessionId);
    }

    return sessionId;
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `vida_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current session ID
   */
  getSessionId() {
    return this.sessionId || this.getOrCreateSessionId();
  }

  /**
   * Get current UTM parameters
   */
  getUTMParams() {
    return this.utmParams || this.getStoredParams();
  }

  /**
   * Attach UTM parameters to event data
   */
  enrichEventData(eventData) {
    return {
      ...eventData,
      ...this.getUTMParams(),
      session_id: this.getSessionId()
    };
  }

  /**
   * Build UTM query string for URLs
   */
  getUTMQueryString() {
    const params = this.getUTMParams();
    if (!params) return '';

    const queryParams = new URLSearchParams();
    
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => {
      if (params[key]) {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Track page view with UTM parameters
   */
  trackPageView() {
    const pageData = {
      page_url: window.location.href,
      page_title: document.title,
      page_path: window.location.pathname,
      ...this.getUTMParams()
    };

    // Log for debugging
    console.log('📄 Page view tracked:', pageData);

    return pageData;
  }

  /**
   * Get attribution summary
   */
  getAttributionSummary() {
    const params = this.getUTMParams();
    
    if (!params) {
      return {
        source: 'Direct',
        medium: 'None',
        campaign: 'N/A'
      };
    }

    return {
      source: params.utm_source || 'Unknown',
      medium: params.utm_medium || 'Unknown',
      campaign: params.utm_campaign || 'Unknown',
      content: params.utm_content,
      term: params.utm_term
    };
  }

  /**
   * Clear UTM parameters
   */
  clear() {
    sessionStorage.removeItem(this.storageKey);
    this.utmParams = null;
  }

  /**
   * Export UTM data for analytics
   */
  exportForAnalytics() {
    return {
      session_id: this.getSessionId(),
      utm_params: this.getUTMParams(),
      attribution: this.getAttributionSummary()
    };
  }
}

// Initialize and export singleton
export const utmTracker = new UTMTracker();

// Auto-initialize on load
if (typeof window !== 'undefined') {
  utmTracker.init();
}

export default utmTracker;

