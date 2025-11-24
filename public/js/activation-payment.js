/**
 * VIDA Travel - Activation Payment Module
 * Handles enrollment fee payment processing
 */

import { analytics } from './analytics.js';
import { visualizer } from './financial-visualizer.js';

export class ActivationPayment {
  constructor() {
    this.form = null;
    this.submitButton = null;
    this.processing = false;
    this.enrollmentFee = 500; // MXN
  }

  /**
   * Initialize payment form
   */
  init() {
    this.form = document.getElementById('payment-form');
    this.submitButton = document.getElementById('payment-submit');

    if (!this.form) {
      console.warn('⚠️ Payment form not found');
      return;
    }

    // Setup form validation and submission
    this.setupFormValidation();
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    console.log('✅ Activation payment initialized');
  }

  /**
   * Setup form validation
   */
  setupFormValidation() {
    // Card number formatting
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
      cardNumber.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value;
        
        // Validate using Luhn algorithm
        const isValid = this.validateCardNumber(value.replace(/\s/g, ''));
        if (value.length >= 15) {
          cardNumber.setCustomValidity(isValid ? '' : 'Número de tarjeta inválido');
        }
      });
    }

    // Expiry date formatting
    const expiryDate = document.getElementById('expiry-date');
    if (expiryDate) {
      expiryDate.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\//g, '');
        if (value.length >= 2) {
          value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
        
        // Validate expiry
        if (value.length === 5) {
          const isValid = this.validateExpiryDate(value);
          expiryDate.setCustomValidity(isValid ? '' : 'Fecha de expiración inválida');
        }
      });
    }

    // CVV validation
    const cvv = document.getElementById('cvv');
    if (cvv) {
      cvv.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
      });
    }

    // Phone formatting
    const phone = document.getElementById('phone');
    if (phone) {
      phone.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('52')) {
          value = '+' + value.slice(0, 12);
        } else if (value.length > 0) {
          value = '+52' + value.slice(0, 10);
        }
        e.target.value = value;
      });
    }
  }

  /**
   * Validate card number using Luhn algorithm
   */
  validateCardNumber(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    
    if (digits.length < 13 || digits.length > 19) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate expiry date
   */
  validateExpiryDate(expiry) {
    const [month, year] = expiry.split('/').map(num => parseInt(num, 10));
    
    if (!month || !year || month < 1 || month > 12) {
      return false;
    }

    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Last 2 digits
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) {
      return false;
    }

    if (year === currentYear && month < currentMonth) {
      return false;
    }

    return true;
  }

  /**
   * Handle form submission
   */
  async handleSubmit(event) {
    event.preventDefault();

    if (this.processing) {
      return;
    }

    // Validate form
    if (!this.form.checkValidity()) {
      this.form.reportValidity();
      return;
    }

    this.processing = true;
    this.submitButton.disabled = true;
    visualizer.showLoading('Procesando tu pago...');

    try {
      // Get form data
      const formData = this.getFormData();
      
      // Get plan data from session
      const planData = this.getPlanDataFromSession();

      if (!planData) {
        throw new Error('No se encontraron datos del plan. Por favor completa el simulador.');
      }

      // Track payment info added
      analytics.trackPaymentInfoAdded(planData);

      // Process payment
      const result = await this.processPayment(formData, planData);

      if (result.success) {
        // Track purchase
        await analytics.trackPurchaseCompleted(planData, {
          transactionId: result.transactionId,
          paymentMethod: 'card'
        });

        // Show success
        visualizer.hideLoading();
        visualizer.showSuccessModal();

        // Clear form
        this.form.reset();
      } else {
        throw new Error(result.error || 'Pago rechazado');
      }
    } catch (error) {
      console.error('❌ Payment processing error:', error);
      visualizer.hideLoading();
      
      // Track error
      analytics.trackError('payment_failed', error.message, {
        step: 'activation_payment'
      });

      // Show error
      alert(`Error al procesar el pago: ${error.message}`);
    } finally {
      this.processing = false;
      this.submitButton.disabled = false;
    }
  }

  /**
   * Get form data
   */
  getFormData() {
    return {
      cardholderName: document.getElementById('cardholder-name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      cardNumber: document.getElementById('card-number').value.replace(/\s/g, ''),
      expiryDate: document.getElementById('expiry-date').value,
      cvv: document.getElementById('cvv').value
    };
  }

  /**
   * Get plan data from session storage
   */
  getPlanDataFromSession() {
    try {
      const planDataStr = sessionStorage.getItem('vida_vacation_plan');
      return planDataStr ? JSON.parse(planDataStr) : null;
    } catch (e) {
      console.error('Failed to parse plan data:', e);
      return null;
    }
  }

  /**
   * Process payment (calls Cloud Function)
   */
  async processPayment(formData, planData) {
    // In production, this would call a Cloud Function
    // For now, simulate payment processing
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful payment
        const transactionId = `VIDA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        resolve({
          success: true,
          transactionId,
          amount: this.enrollmentFee,
          currency: 'MXN'
        });
      }, 2000);
    });

    /* Production code would be:
    try {
      const response = await fetch('/api/processActivationPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formData,
          planData,
          amount: this.enrollmentFee
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
    */
  }

  /**
   * Get enrollment fee
   */
  getEnrollmentFee() {
    return this.enrollmentFee;
  }
}

// Initialize and export singleton
export const activationPayment = new ActivationPayment();

// Auto-initialize when Step 5 is visible
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // Delay initialization slightly to ensure DOM is ready
    setTimeout(() => activationPayment.init(), 500);
  });
}

export default activationPayment;

