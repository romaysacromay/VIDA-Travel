/**
 * VIDA Travel - Date Picker Module
 * Handles date selection with restrictions based on savings calculation
 */

import { calculator } from './financial-calculator.js';

export class DatePicker {
  constructor() {
    this.checkInInput = null;
    this.checkOutInput = null;
    this.earliestCheckIn = null;
    this.minNights = 3;
    this.maxNights = 14;
    this.initialized = false;
  }

  /**
   * Initialize date picker with earliest check-in date
   */
  initialize(earliestCheckInDate) {
    this.checkInInput = document.getElementById('checkin-date');
    this.checkOutInput = document.getElementById('checkout-date');
    this.earliestCheckIn = new Date(earliestCheckInDate);

    if (!this.checkInInput || !this.checkOutInput) {
      console.error('Date picker inputs not found');
      return;
    }

    // Set minimum date for check-in
    const minDateStr = calculator.formatDateForInput(this.earliestCheckIn);
    this.checkInInput.min = minDateStr;

    // Enable check-in input
    this.checkInInput.disabled = false;
    this.checkInInput.value = minDateStr; // Pre-fill with earliest date

    // Set up event listeners
    this.setupEventListeners();

    // Update restriction display
    this.updateRestrictionDisplay();

    // Trigger check-in change to enable check-out
    this.handleCheckInChange();

    this.initialized = true;
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    this.checkInInput.addEventListener('change', () => this.handleCheckInChange());
    this.checkInInput.addEventListener('input', () => this.validateCheckInDate());
    
    this.checkOutInput.addEventListener('change', () => this.handleCheckOutChange());
    this.checkOutInput.addEventListener('input', () => this.validateCheckOutDate());
  }

  /**
   * Handle check-in date change
   */
  handleCheckInChange() {
    const checkInDate = new Date(this.checkInInput.value);
    
    if (!this.checkInInput.value || isNaN(checkInDate.getTime())) {
      this.checkOutInput.disabled = true;
      return;
    }

    // Validate check-in is not before earliest date
    if (checkInDate < this.earliestCheckIn) {
      this.checkInInput.value = calculator.formatDateForInput(this.earliestCheckIn);
      return;
    }

    // Calculate min and max check-out dates
    const minCheckOut = new Date(checkInDate);
    minCheckOut.setDate(minCheckOut.getDate() + this.minNights);

    const maxCheckOut = new Date(checkInDate);
    maxCheckOut.setDate(maxCheckOut.getDate() + this.maxNights);

    // Set check-out constraints
    this.checkOutInput.min = calculator.formatDateForInput(minCheckOut);
    this.checkOutInput.max = calculator.formatDateForInput(maxCheckOut);

    // Pre-fill check-out with 7 nights (default)
    if (!this.checkOutInput.value) {
      const defaultCheckOut = new Date(checkInDate);
      defaultCheckOut.setDate(defaultCheckOut.getDate() + 7);
      this.checkOutInput.value = calculator.formatDateForInput(defaultCheckOut);
    }

    // Enable check-out
    this.checkOutInput.disabled = false;

    // Trigger change event on check-out to validate
    this.checkOutInput.dispatchEvent(new Event('change'));
  }

  /**
   * Handle check-out date change
   */
  handleCheckOutChange() {
    if (!this.checkInInput.value || !this.checkOutInput.value) {
      return;
    }

    const validation = this.validateDates();
    
    if (!validation.valid) {
      // Show error but don't reset (let user correct)
      this.displayError(validation.message);
    } else {
      this.clearError();
      this.displayNightsCount(validation.nights);
    }
  }

  /**
   * Validate check-in date
   */
  validateCheckInDate() {
    const checkInDate = new Date(this.checkInInput.value);
    const earliest = new Date(this.earliestCheckIn);

    // Reset times for comparison
    checkInDate.setHours(0, 0, 0, 0);
    earliest.setHours(0, 0, 0, 0);

    if (checkInDate < earliest) {
      this.checkInInput.setCustomValidity(
        `La fecha mínima es ${calculator.formatDate(earliest, 'es')}`
      );
      return false;
    }

    this.checkInInput.setCustomValidity('');
    return true;
  }

  /**
   * Validate check-out date
   */
  validateCheckOutDate() {
    if (!this.checkInInput.value || !this.checkOutInput.value) {
      return false;
    }

    const validation = this.validateDates();
    
    if (!validation.valid) {
      this.checkOutInput.setCustomValidity(validation.message);
      return false;
    }

    this.checkOutInput.setCustomValidity('');
    return true;
  }

  /**
   * Validate both dates together
   */
  validateDates() {
    const checkInValue = this.checkInInput.value;
    const checkOutValue = this.checkOutInput.value;

    if (!checkInValue || !checkOutValue) {
      return {
        valid: false,
        message: 'Por favor selecciona ambas fechas'
      };
    }

    return calculator.validateDateSelection(
      checkInValue,
      checkOutValue,
      this.earliestCheckIn
    );
  }

  /**
   * Get selected dates and nights
   */
  getSelectedDates() {
    const validation = this.validateDates();
    
    if (!validation.valid) {
      return null;
    }

    return {
      checkIn: this.checkInInput.value,
      checkOut: this.checkOutInput.value,
      checkInFormatted: calculator.formatDate(this.checkInInput.value, 'es'),
      checkOutFormatted: calculator.formatDate(this.checkOutInput.value, 'es'),
      nights: validation.nights
    };
  }

  /**
   * Update date restriction display
   */
  updateRestrictionDisplay() {
    const display = document.getElementById('date-restriction-display');
    if (display && this.earliestCheckIn) {
      display.textContent = calculator.formatDate(this.earliestCheckIn, 'es');
    }
  }

  /**
   * Display validation error
   */
  displayError(message) {
    // Add error class to inputs
    this.checkInInput.classList.add('error');
    this.checkOutInput.classList.add('error');

    // Show error message (could be enhanced with a dedicated error element)
    console.warn('Date validation error:', message);
  }

  /**
   * Clear validation error
   */
  clearError() {
    this.checkInInput.classList.remove('error');
    this.checkOutInput.classList.remove('error');
  }

  /**
   * Display nights count
   */
  displayNightsCount(nights) {
    // This could be displayed in a helper text element
    const helper = this.checkOutInput.parentElement.querySelector('.form-help');
    if (helper) {
      const originalText = helper.getAttribute('data-original-text') || helper.textContent;
      helper.setAttribute('data-original-text', originalText);
      helper.textContent = `${nights} ${nights === 1 ? 'noche' : 'noches'} seleccionadas`;
      helper.style.color = 'var(--vida-light-teal)';
    }
  }

  /**
   * Check if dates are valid and selected
   */
  areDatesValid() {
    if (!this.initialized || !this.checkInInput.value || !this.checkOutInput.value) {
      return false;
    }

    const validation = this.validateDates();
    return validation.valid;
  }

  /**
   * Reset date picker
   */
  reset() {
    if (this.checkInInput) {
      this.checkInInput.value = '';
      this.checkInInput.disabled = true;
      this.checkInInput.min = '';
    }

    if (this.checkOutInput) {
      this.checkOutInput.value = '';
      this.checkOutInput.disabled = true;
      this.checkOutInput.min = '';
      this.checkOutInput.max = '';
    }

    this.earliestCheckIn = null;
    this.initialized = false;
    this.clearError();
  }

  /**
   * Get earliest check-in date
   */
  getEarliestCheckIn() {
    return this.earliestCheckIn;
  }

  /**
   * Disable date inputs
   */
  disable() {
    if (this.checkInInput) this.checkInInput.disabled = true;
    if (this.checkOutInput) this.checkOutInput.disabled = true;
  }

  /**
   * Enable date inputs
   */
  enable() {
    if (this.checkInInput && this.earliestCheckIn) {
      this.checkInInput.disabled = false;
    }
    // Check-out is enabled after check-in is selected
  }
}

// Export singleton instance
export const datePicker = new DatePicker();
export default datePicker;

