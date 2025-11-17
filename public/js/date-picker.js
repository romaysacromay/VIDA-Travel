// Date Picker Component - Booking.com-style check-in/check-out
// Bilingual support

class DatePicker {
  constructor(checkInId, checkOutId, onDateChangeCallback) {
    this.checkInInput = document.getElementById(checkInId);
    this.checkOutInput = document.getElementById(checkOutId);
    this.onDateChangeCallback = onDateChangeCallback;
    this.lang = window.i18n?.getLanguage() || 'es-MX';
    this.earliestDate = null;
    this.dateSection = null;
    
    // Hide date picker initially
    this.hideDatePicker();
    
    this.init();
  }
  
  init() {
    this.setupInputs();
    this.attachEventListeners();
    
    // Listen for language changes
    window.addEventListener('languageChanged', () => {
      this.lang = window.i18n?.getLanguage() || 'es-MX';
      this.setupInputs();
    });
  }
  
  hideDatePicker() {
    // Find the date picker section in the form
    this.dateSection = document.getElementById('date-picker-group');
    if (!this.dateSection && this.checkInInput) {
      this.dateSection = this.checkInInput.closest('.form-group');
    }
    if (this.dateSection) {
      this.dateSection.style.display = 'none';
    }
  }
  
  showDatePicker(earliestDate) {
    if (this.dateSection) {
      this.dateSection.style.display = 'block';
      this.earliestDate = earliestDate;
      this.updateMinDates(earliestDate);
    }
  }
  
  updateMinDates(earliestDate) {
    const earliestDateStr = earliestDate.toISOString().split('T')[0];
    
    if (this.checkInInput) {
      this.checkInInput.min = earliestDateStr;
      this.checkInInput.setAttribute('data-i18n-title', 'simulator.checkIn');
      
      // Show helper text with earliest date
      this.showEarliestDateHelper(earliestDate);
    }
    
    if (this.checkOutInput) {
      // Check-out can be at least 1 day after check-in
      const nextDay = new Date(earliestDate);
      nextDay.setDate(nextDay.getDate() + 1);
      this.checkOutInput.min = nextDay.toISOString().split('T')[0];
      this.checkOutInput.setAttribute('data-i18n-title', 'simulator.checkOut');
    }
    
    // Update labels if they exist
    const checkInLabel = document.querySelector(`label[for="${this.checkInInput?.id}"]`);
    const checkOutLabel = document.querySelector(`label[for="${this.checkOutInput?.id}"]`);
    
    if (checkInLabel) {
      checkInLabel.setAttribute('data-i18n', 'simulator.checkIn');
    }
    if (checkOutLabel) {
      checkOutLabel.setAttribute('data-i18n', 'simulator.checkOut');
    }
    
    if (window.i18n) {
      window.i18n.applyTranslations();
    }
  }
  
  showEarliestDateHelper(earliestDate) {
    // Remove existing helper if any
    const existingHelper = this.dateSection?.querySelector('.earliest-date-helper');
    if (existingHelper) {
      existingHelper.remove();
    }
    
    // Create helper text
    const helper = document.createElement('div');
    helper.className = 'earliest-date-helper';
    helper.style.cssText = 'margin-top: 0.5rem; font-size: 0.9rem; color: #666; font-style: italic;';
    
    const lang = this.lang;
    const formattedDate = earliestDate.toLocaleDateString(lang === 'es-MX' ? 'es-MX' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    helper.textContent = lang === 'es-MX' 
      ? `Fecha de salida más temprana: ${formattedDate}`
      : `Earliest departure date: ${formattedDate}`;
    
    if (this.dateSection) {
      this.dateSection.appendChild(helper);
    }
  }
  
  setupInputs() {
    // If earliest date is set, use it, otherwise use today
    const minDate = this.earliestDate || new Date();
    const today = minDate.toISOString().split('T')[0];
    
    if (this.checkInInput) {
      this.checkInInput.min = today;
      this.checkInInput.setAttribute('data-i18n-title', 'simulator.checkIn');
    }
    
    if (this.checkOutInput) {
      this.checkOutInput.min = today;
      this.checkOutInput.setAttribute('data-i18n-title', 'simulator.checkOut');
    }
    
    // Update labels if they exist
    const checkInLabel = document.querySelector(`label[for="${this.checkInInput?.id}"]`);
    const checkOutLabel = document.querySelector(`label[for="${this.checkOutInput?.id}"]`);
    
    if (checkInLabel) {
      checkInLabel.setAttribute('data-i18n', 'simulator.checkIn');
    }
    if (checkOutLabel) {
      checkOutLabel.setAttribute('data-i18n', 'simulator.checkOut');
    }
    
    if (window.i18n) {
      window.i18n.applyTranslations();
    }
  }
  
  attachEventListeners() {
    // Check-in date change
    if (this.checkInInput) {
      this.checkInInput.addEventListener('change', (e) => {
        const checkInDate = new Date(e.target.value);
        const nextDay = new Date(checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        // Update check-out minimum date
        if (this.checkOutInput) {
          this.checkOutInput.min = nextDay.toISOString().split('T')[0];
          
          // If check-out is before new minimum, clear it
          if (this.checkOutInput.value && new Date(this.checkOutInput.value) < nextDay) {
            this.checkOutInput.value = '';
          }
        }
        
        this.validateDates();
        this.trackDateSelection();
      });
    }
    
    // Check-out date change
    if (this.checkOutInput) {
      this.checkOutInput.addEventListener('change', () => {
        this.validateDates();
        this.trackDateSelection();
      });
    }
  }
  
  validateDates() {
    const checkIn = this.checkInInput?.value ? new Date(this.checkInInput.value) : null;
    const checkOut = this.checkOutInput?.value ? new Date(this.checkOutInput.value) : null;
    
    // Remove previous error messages
    this.removeErrorMessages();
    
    if (checkIn && checkOut) {
      if (checkOut <= checkIn) {
        this.showError(this.checkOutInput, window.i18n?.t('validation.checkOutAfterCheckIn') || 
                      'La fecha de salida debe ser después de la fecha de entrada');
        return false;
      }
    }
    
    return true;
  }
  
  showError(input, message) {
    if (!input) return;
    
    input.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.setAttribute('data-field', input.id);
    input.parentNode.appendChild(errorDiv);
  }
  
  removeErrorMessages() {
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  }
  
  trackDateSelection() {
    if (this.checkInInput?.value && this.checkOutInput?.value) {
      if (window.trackEvent) {
        trackEvent('dates_selected', {
          checkIn: this.checkInInput.value,
          checkOut: this.checkOutInput.value,
          language: this.lang
        });
      }
      
      if (this.onDateChangeCallback) {
        this.onDateChangeCallback({
          checkIn: this.checkInInput.value,
          checkOut: this.checkOutInput.value
        });
      }
    }
  }
  
  getDates() {
    return {
      checkIn: this.checkInInput?.value || null,
      checkOut: this.checkOutInput?.value || null
    };
  }
  
  setDates(checkIn, checkOut) {
    if (this.checkInInput && checkIn) {
      this.checkInInput.value = checkIn;
    }
    if (this.checkOutInput && checkOut) {
      this.checkOutInput.value = checkOut;
    }
    this.validateDates();
  }
}

// Export for global use
window.DatePicker = DatePicker;

