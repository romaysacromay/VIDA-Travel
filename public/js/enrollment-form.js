/**
 * VIDA Travel - Enrollment Form with Email Verification
 * Handles user information collection and OTP verification
 */

import { analytics } from './analytics.js';
import { i18n } from './i18n.js';

export class EnrollmentForm {
  constructor() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      region: ''
    };
    this.otpSent = false;
    this.verified = false;
    this.otpCode = null;
    this.resendTimer = null;
    this.resendCountdown = 60;
  }

  /**
   * Initialize form handlers
   */
  init() {
    this.setupFormHandlers();
    console.log('✅ Enrollment form initialized');
  }

  /**
   * Set custom validation messages for all form fields (bilingual)
   */
  setSpanishValidation() {
    // Get all form inputs
    const inputs = document.querySelectorAll('#user-info-form input, #user-info-form select');
    
    inputs.forEach(input => {
      input.addEventListener('invalid', (e) => {
        e.preventDefault();
        
        const input = e.target;
        let message = '';
        
        if (input.validity.valueMissing) {
          message = i18n.get('validation.required');
        } else if (input.validity.typeMismatch) {
          if (input.type === 'email') {
            message = i18n.get('validation.emailInvalid');
          } else if (input.type === 'tel') {
            message = i18n.get('validation.phoneInvalid');
          }
        } else if (input.validity.patternMismatch) {
          if (input.type === 'tel') {
            message = i18n.get('validation.phoneFormat');
          }
        } else if (input.validity.tooShort) {
          message = i18n.get('validation.tooShort').replace('{min}', input.minLength);
        }
        
        input.setCustomValidity(message);
      });
      
      // Clear custom message on input
      input.addEventListener('input', (e) => {
        e.target.setCustomValidity('');
      });
    });
  }

  /**
   * Setup all form event handlers
   */
  setupFormHandlers() {
    // Set custom Spanish validation messages
    this.setSpanishValidation();
    
    // Submit user info form
    const userInfoForm = document.getElementById('user-info-form');
    if (userInfoForm) {
      userInfoForm.addEventListener('submit', (e) => this.handleUserInfoSubmit(e));
    }

    // Send OTP button
    const sendOtpBtn = document.getElementById('send-otp-btn');
    if (sendOtpBtn) {
      sendOtpBtn.addEventListener('click', () => this.sendOTP());
    }

    // Verify OTP button
    const verifyOtpBtn = document.getElementById('verify-otp-btn');
    if (verifyOtpBtn) {
      verifyOtpBtn.addEventListener('click', () => this.verifyOTP());
    }

    // Resend OTP button
    const resendOtpBtn = document.getElementById('resend-otp-btn');
    if (resendOtpBtn) {
      resendOtpBtn.addEventListener('click', () => this.resendOTP());
    }

    // Phone number formatting
    const phoneInput = document.getElementById('user-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
    }

    // Clear errors on input
    const formInputs = document.querySelectorAll('#user-info-form input, #user-info-form select');
    formInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const field = e.target;
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (errorDiv) {
          errorDiv.remove();
          field.style.borderColor = '';
        }
      });
      
      input.addEventListener('change', (e) => {
        const field = e.target;
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (errorDiv) {
          errorDiv.remove();
          field.style.borderColor = '';
        }
      });
    });
  }

  /**
   * Handle user info form submission
   */
  async handleUserInfoSubmit(event) {
    event.preventDefault();

    // Get form values
    this.formData.name = document.getElementById('user-name').value.trim();
    this.formData.email = document.getElementById('user-email').value.trim();
    this.formData.phone = document.getElementById('user-phone').value.trim();
    this.formData.region = document.getElementById('user-region').value;

    // Validate
    if (!this.validateForm()) {
      return;
    }

    // Show OTP section
    this.showOTPSection();
  }

  /**
   * Validate form data (bilingual)
   */
  validateForm() {
    const { name, email, phone, region } = this.formData;

    // Clear previous errors
    this.clearFieldErrors();

    if (!name || name.length < 3) {
      this.showFieldError('user-name', i18n.get('validation.nameRequired'));
      return false;
    }

    if (!email) {
      this.showFieldError('user-email', i18n.get('validation.emailRequired'));
      return false;
    }

    if (!this.isValidEmail(email)) {
      this.showFieldError('user-email', i18n.get('validation.emailInvalid'));
      return false;
    }

    if (!phone) {
      this.showFieldError('user-phone', i18n.get('validation.phoneRequired'));
      return false;
    }

    if (phone.length < 10) {
      this.showFieldError('user-phone', i18n.get('validation.phoneLength'));
      return false;
    }

    if (!region) {
      this.showFieldError('user-region', i18n.get('validation.regionRequired'));
      return false;
    }

    return true;
  }

  /**
   * Show field error message
   */
  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Add error class to field
    field.style.borderColor = '#EF4444';
    
    // Create or update error message
    let errorDiv = field.parentElement.querySelector('.field-error');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'field-error';
      field.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    
    // Focus the field
    field.focus();
  }

  /**
   * Clear all field errors
   */
  clearFieldErrors() {
    const errors = document.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());
    
    const fields = document.querySelectorAll('#user-info-form input, #user-info-form select');
    fields.forEach(field => {
      field.style.borderColor = '';
    });
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Format phone number as Mexican format
   */
  formatPhoneNumber(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    // Limit to 10 digits
    value = value.slice(0, 10);
    
    // Format as XXX-XXX-XXXX
    if (value.length > 6) {
      value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
    } else if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    }
    
    event.target.value = value;
  }

  /**
   * Show OTP verification section
   */
  showOTPSection() {
    const userInfoSection = document.getElementById('user-info-section');
    const otpSection = document.getElementById('otp-section');
    
    if (userInfoSection) userInfoSection.style.display = 'none';
    if (otpSection) otpSection.style.display = 'block';

    // Show email in OTP section
    const emailDisplay = document.getElementById('otp-email-display');
    if (emailDisplay) {
      emailDisplay.textContent = this.formData.email;
    }

    // Auto-send OTP
    this.sendOTP();
  }

  /**
   * Start resend countdown timer (60 seconds)
   */
  startResendCountdown() {
    const resendBtn = document.getElementById('resend-otp-btn');
    const countdownDisplay = document.getElementById('countdown-display');
    
    console.log('🕐 Starting countdown...', { resendBtn, countdownDisplay });
    
    if (!resendBtn) {
      console.error('❌ Resend button not found!');
      return;
    }
    
    if (!countdownDisplay) {
      console.error('❌ Countdown display not found!');
      return;
    }

    // Disable button
    resendBtn.disabled = true;
    
    // Clear any existing timer
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }

    // Start at 60 seconds
    this.resendCountdown = 60;
    countdownDisplay.textContent = this.resendCountdown;
    console.log('✅ Countdown initialized at:', this.resendCountdown);

    // Update countdown every second
    this.resendTimer = setInterval(() => {
      this.resendCountdown--;
      console.log('⏱️ Countdown:', this.resendCountdown);
      
      if (this.resendCountdown > 0) {
        countdownDisplay.textContent = this.resendCountdown;
      } else {
        // Countdown finished - enable button
        clearInterval(this.resendTimer);
        this.resendTimer = null;
        resendBtn.disabled = false;
        countdownDisplay.textContent = '0';
        console.log('✅ Countdown finished, button enabled');
      }
    }, 1000);
  }

  /**
   * Send OTP to user's email (bilingual)
   */
  async sendOTP() {
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const resendOtpBtn = document.getElementById('resend-otp-btn');
    
    // Disable buttons
    if (sendOtpBtn) sendOtpBtn.disabled = true;
    if (resendOtpBtn) resendOtpBtn.disabled = true;

    try {
      this.showLoading(i18n.get('otp.sending'));

      // Validate email before sending
      const email = this.formData.email?.trim();
      if (!email || !email.includes('@')) {
        throw new Error(i18n.get('otp.emailInvalid'));
      }

      console.log('📧 Sending OTP to:', email);
      console.log('📱 User Agent:', navigator.userAgent);

      // Create abort controller for timeout (iOS compatible)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('https://us-central1-vida-travel-vacation-credit.cloudfunctions.net/sendVerificationOTP', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: email,
          name: this.formData.name?.trim() || '',
          language: i18n.getCurrentLanguage() || 'es'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Get response text first to handle both JSON and text errors
      const responseText = await response.text();
      console.log('📥 Response status:', response.status);
      console.log('📥 Response text:', responseText);

      if (!response.ok) {
        let errorMessage = i18n.get('otp.errorSending');
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If not JSON, use the text or status
          errorMessage = responseText || `Error ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = JSON.parse(responseText);
      
      if (!result.success) {
        throw new Error(result.error || result.message || i18n.get('otp.errorSending'));
      }

      this.otpSent = true;

      this.hideLoading();
      this.showMessage(i18n.get('otp.sent'), 'success');
      
      console.log('✅ OTP sent successfully to:', email);

      // Start 60-second countdown for resend button
      this.startResendCountdown();

      // Focus OTP input
      const otpInput = document.getElementById('otp-code');
      if (otpInput) otpInput.focus();

    } catch (error) {
      console.error('❌ Failed to send OTP:', error);
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      this.hideLoading();
      
      // Show more specific error message
      let errorMessage = i18n.get('otp.errorSending');
      
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        errorMessage = i18n.get('otp.timeout');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = i18n.get('otp.networkError');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      this.showMessage(errorMessage, 'error');
      
      // Re-enable buttons if error
      if (sendOtpBtn) sendOtpBtn.disabled = false;
      if (resendOtpBtn) resendOtpBtn.disabled = false;
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP() {
    // Clear any existing timer first
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = null;
    }
    
    await this.sendOTP();
  }

  /**
   * Verify OTP code (bilingual)
   */
  async verifyOTP() {
    const otpInput = document.getElementById('otp-code');
    const otpCode = otpInput?.value.trim();

    if (!otpCode || otpCode.length !== 6) {
      this.showMessage(i18n.get('validation.otpLength'), 'error');
      return;
    }

    const verifyBtn = document.getElementById('verify-otp-btn');
    if (verifyBtn) verifyBtn.disabled = true;

    try {
      this.showLoading(i18n.get('otp.verifying'));

      const response = await fetch('https://us-central1-vida-travel-vacation-credit.cloudfunctions.net/verifyOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: this.formData.email,
          otp: otpCode
        })
      });

      const result = await response.json();

      if (result.verified) {
        this.verified = true;
        this.hideLoading();
        
        // 🎯 FIRE AddPaymentInfo EVENT
        await this.trackAddPaymentInfo();
        
        console.log('🎯 About to call showActivationSection...');
        
        // Show activation section
        this.showActivationSection();
        
        console.log('✅ Email verified, AddPaymentInfo event sent');
      } else {
        throw new Error(result.error || 'Invalid OTP');
      }

    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      this.hideLoading();
      this.showMessage(i18n.get('otp.invalid'), 'error');
      
      if (verifyBtn) verifyBtn.disabled = false;
      if (otpInput) otpInput.value = '';
    }
  }

  /**
   * Track AddPaymentInfo event
   */
  async trackAddPaymentInfo() {
    // Get plan data from session
    const planData = this.getPlanData();

    // Track with analytics module
    if (analytics && analytics.trackPaymentInfoAdded) {
      await analytics.trackPaymentInfoAdded({
        ...planData,
        name: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone,
        region: this.formData.region
      });
    }

    // Also track directly with fbq
    if (typeof fbq !== 'undefined') {
      fbq('track', 'AddPaymentInfo', {
        content_name: planData?.destination || 'Vacation Package',
        content_type: 'enrollment',
        value: 500,
        currency: 'MXN'
      });
      console.log('📊 Meta Pixel: AddPaymentInfo');
    }
  }

  /**
   * Show activation section with $500 button
   */
  showActivationSection() {
    console.log('🎯 showActivationSection called');
    const otpSection = document.getElementById('otp-section');
    const activationSection = document.getElementById('activation-section');
    
    if (otpSection) otpSection.style.display = 'none';
    if (activationSection) {
      activationSection.style.display = 'block';
      console.log('✅ Activation section displayed');
    } else {
      console.error('❌ Activation section element not found!');
    }

    // Wait for DOM to be ready, then populate booking details
    console.log('⏱️ Scheduling populateBookingDetails in 100ms...');
    setTimeout(() => {
      console.log('🔄 Executing populateBookingDetails now...');
      this.populateBookingDetails();
    }, 100);

    // Setup activation button
    const activateBtn = document.getElementById('activate-credit-btn');
    if (activateBtn) {
      activateBtn.addEventListener('click', () => this.handleActivation());
      console.log('✅ Activation button handler set up');
    } else {
      console.error('❌ Activation button not found!');
    }

    this.showMessage(i18n.get('otp.verified'), 'success');
  }

  /**
   * Populate booking details from calculator data
   */
  populateBookingDetails() {
    // Get calculator data from global state (set by app.js)
    const calculationData = window.state?.calculationData;
    const selectedDestination = window.state?.selectedDestination;
    
    console.log('📊 Populating booking details:', { calculationData, selectedDestination });
    
    if (!calculationData) {
      console.error('❌ No calculation data available!');
      return;
    }

    // Destination
    const destinationEl = document.getElementById('booking-destination');
    if (destinationEl) {
      const destName = selectedDestination?.name?.es || selectedDestination?.name || 'Destino seleccionado';
      destinationEl.textContent = destName;
      console.log('✅ Destination set:', destName);
    } else {
      console.error('❌ booking-destination element not found');
    }

    // Travel date
    const travelDateEl = document.getElementById('booking-travel-date');
    if (travelDateEl) {
      // Use selected date if available, otherwise use calculated date
      if (calculationData.selectedTravelDateFormatted) {
        travelDateEl.textContent = calculationData.selectedTravelDateFormatted;
      } else if (calculationData.travelDate) {
        const date = new Date(calculationData.travelDate);
        travelDateEl.textContent = date.toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }

    // Travelers (bilingual)
    const travelersEl = document.getElementById('booking-travelers');
    if (travelersEl) {
      const adults = calculationData.adults || 0;
      const children = calculationData.children || 0;
      const parts = [];
      if (adults > 0) {
        const adultLabel = adults === 1 ? i18n.get('travelers.adult') : i18n.get('travelers.adults');
        parts.push(`${adults} ${adultLabel}`);
      }
      if (children > 0) {
        const childLabel = children === 1 ? i18n.get('travelers.child') : i18n.get('travelers.children');
        parts.push(`${children} ${childLabel}`);
      }
      travelersEl.textContent = parts.join(', ') || `1 ${i18n.get('travelers.adult')}`;
    }

    // Total price
    const totalPriceEl = document.getElementById('booking-total-price');
    if (totalPriceEl && calculationData.totalPrice) {
      totalPriceEl.textContent = `$${calculationData.totalPrice.toLocaleString('es-MX')} MXN`;
      console.log('✅ Total price set:', calculationData.totalPrice);
    } else {
      console.error('❌ booking-total-price element not found or no totalPrice data');
    }

    // Weekly payment
    const weeklyPaymentEl = document.getElementById('booking-weekly-payment');
    if (weeklyPaymentEl && calculationData.weeklyDeposit) {
      weeklyPaymentEl.textContent = `$${calculationData.weeklyDeposit.toLocaleString('es-MX')} MXN`;
      console.log('✅ Weekly payment set:', calculationData.weeklyDeposit);
    } else {
      console.error('❌ booking-weekly-payment element not found or no weeklyDeposit data');
    }
    
    console.log('✅ Booking details population complete');
  }

  /**
   * Handle credit activation ($500 payment) (bilingual)
   */
  async handleActivation() {
    const activateBtn = document.getElementById('activate-credit-btn');
    if (activateBtn) activateBtn.disabled = true;

    try {
      this.showLoading(i18n.get('activation.processing'));

      // Get plan data
      const planData = this.getPlanData();

      // Generate transaction ID
      const transactionId = `VIDA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 🎯 FIRE PURCHASE EVENT (PRIMARY CONVERSION)
      await this.trackPurchase(planData, transactionId);

      // Save user data to Firestore
      await this.saveUserEnrollment(planData, transactionId);

      this.hideLoading();

      // Show success
      this.showSuccessModal(transactionId);

    } catch (error) {
      console.error('❌ Activation failed:', error);
      this.hideLoading();
      this.showMessage(i18n.get('activation.error'), 'error');
      
      if (activateBtn) activateBtn.disabled = false;
    }
  }

  /**
   * Track Purchase event (PRIMARY CONVERSION)
   */
  async trackPurchase(planData, transactionId) {
    // Track with analytics module
    if (analytics && analytics.trackPurchaseCompleted) {
      await analytics.trackPurchaseCompleted({
        ...planData,
        ...this.formData
      }, {
        transactionId,
        paymentMethod: 'activation',
        amount: 500,
        currency: 'MXN'
      });
    }

    // Also track directly with fbq
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Purchase', {
        content_name: planData?.destination || 'Vacation Package',
        content_type: 'enrollment_fee',
        value: 500,
        currency: 'MXN',
        transaction_id: transactionId
      });
      console.log('🎉 Meta Pixel: Purchase', { value: 500, transaction_id: transactionId });
    }
  }

  /**
   * Save user enrollment to Firestore
   */
  async saveUserEnrollment(planData, transactionId) {
    try {
      const enrollmentData = {
        ...this.formData,
        planData,
        transactionId,
        amount: 500,
        currency: 'MXN',
        status: 'active',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await firebase.firestore().collection('enrollments').add(enrollmentData);
      console.log('✅ Enrollment saved to Firestore');

    } catch (error) {
      console.error('❌ Failed to save enrollment:', error);
      // Don't throw - enrollment tracking is not critical for user flow
    }
  }

  /**
   * Get plan data from session
   */
  getPlanData() {
    try {
      const planDataStr = sessionStorage.getItem('vida_vacation_plan');
      return planDataStr ? JSON.parse(planDataStr) : null;
    } catch (e) {
      console.error('Failed to parse plan data:', e);
      return null;
    }
  }

  /**
   * Show success modal (bilingual)
   */
  showSuccessModal(transactionId) {
    // Create or show success modal
    const modalHTML = `
      <div class="success-modal" id="success-modal">
        <div class="success-content">
          <div class="success-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="40" fill="#10B981"/>
              <path d="M25 40L35 50L55 30" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2>${i18n.get('activation.success')}</h2>
          <p style="font-size: 16px; color: #006B5E; font-weight: 600; margin-bottom: 20px;">
            ${i18n.get('activation.launching')}
          </p>
          <div class="success-details">
            <p><strong>${i18n.get('activation.registrationId')}</strong> ${transactionId}</p>
            <p><strong>${i18n.get('activation.deposit')}</strong> $500 MXN</p>
            <p><strong>${i18n.get('activation.email')}</strong> ${this.formData.email}</p>
          </div>
          <p class="success-note" style="font-size: 15px; line-height: 1.6; color: #333;">
            ${i18n.get('activation.limitedSpots')}
          </p>
          <p class="success-note" style="font-size: 14px; margin-top: 15px;">
            ${i18n.get('activation.thanks')}
          </p>
          <button class="btn-primary" onclick="window.location.href='/'">
            ${i18n.get('activation.goHome')}
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  /**
   * Show loading indicator
   */
  showLoading(message) {
    const loadingEl = document.getElementById('loading-indicator');
    if (loadingEl) {
      loadingEl.textContent = message;
      loadingEl.style.display = 'block';
    }
  }

  /**
   * Hide loading indicator
   */
  hideLoading() {
    const loadingEl = document.getElementById('loading-indicator');
    if (loadingEl) {
      loadingEl.style.display = 'none';
    }
  }

  /**
   * Show message to user
   */
  showMessage(message, type = 'info') {
    const messageEl = document.getElementById('form-message');
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.className = `form-message ${type}`;
      messageEl.style.display = 'block';

      // Auto-hide after 5 seconds
      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 5000);
    } else {
      // Fallback to alert
      alert(message);
    }
  }

  /**
   * Get form data
   */
  getFormData() {
    return { ...this.formData };
  }

  /**
   * Check if verified
   */
  isVerified() {
    return this.verified;
  }
}

// Initialize and export singleton
export const enrollmentForm = new EnrollmentForm();

// Auto-initialize on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    enrollmentForm.init();
  });
}

export default enrollmentForm;

