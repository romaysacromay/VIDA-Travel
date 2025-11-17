// Financial Calculator Component
// Validates 15% rule and calculates loan terms

class FinancialCalculator {
  constructor(salaryInputId, depositInputId, onValidationChange) {
    this.salaryInput = document.getElementById(salaryInputId);
    this.depositInput = document.getElementById(depositInputId);
    this.onValidationChange = onValidationChange;
    this.lang = window.i18n?.getLanguage() || 'es-MX';
    
    this.init();
  }
  
  init() {
    this.attachEventListeners();
    
    // Listen for language changes
    window.addEventListener('languageChanged', () => {
      this.lang = window.i18n?.getLanguage() || 'es-MX';
    });
  }
  
  attachEventListeners() {
    // Real-time validation on input
    [this.salaryInput, this.depositInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          this.validate();
          this.checkIfReadyForDates();
        });
        
        input.addEventListener('blur', () => {
          this.validate();
          this.checkIfReadyForDates();
        });
      }
    });
  }
  
  checkIfReadyForDates() {
    const salary = parseFloat(this.salaryInput?.value) || 0;
    const weeklyDeposit = parseFloat(this.depositInput?.value) || 0;
    
    // If both are valid, calculate earliest date and show date picker
    if (salary > 0 && weeklyDeposit > 0 && this.onValidationChange) {
      this.onValidationChange({
        isValid: true,
        salary,
        weeklyDeposit,
        readyForDates: true
      });
    }
  }
  
  validate() {
    const salary = parseFloat(this.salaryInput?.value) || 0;
    const weeklyDeposit = parseFloat(this.depositInput?.value) || 0;
    
    this.removeErrorMessages();
    
    // Basic validations
    if (salary <= 0) {
      this.showError(this.salaryInput, window.i18n?.t('validation.salaryMin') || 
                    'El salario debe ser mayor a 0');
      return false;
    }
    
    if (weeklyDeposit <= 0) {
      this.showError(this.depositInput, window.i18n?.t('validation.depositMin') || 
                    'El depósito debe ser mayor a 0');
      return false;
    }
    
    // Check if weekly deposit is reasonable (not more than 50% of monthly salary)
    const monthlyDeposit = weeklyDeposit * 4;
    if (monthlyDeposit > salary * 0.5) {
      this.showError(this.depositInput, window.i18n?.t('validation.depositTooHigh') || 
                    'El depósito semanal es demasiado alto para tu salario');
      return false;
    }
    
    // Track salary entry
    if (salary > 0 && window.trackEvent) {
      trackEvent('salary_entered', {
        salary: salary,
        weeklyDeposit: weeklyDeposit,
        language: this.lang
      });
    }
    
    if (this.onValidationChange) {
      this.onValidationChange({
        isValid: true,
        salary,
        weeklyDeposit
      });
    }
    
    return true;
  }
  
  calculateLoanTerms(totalPrice, monthlySalary, weeklyDeposit) {
    // Calculate 80% savings target
    const savingsTarget = totalPrice * 0.8;
    const weeksToSave = Math.ceil(savingsTarget / weeklyDeposit);
    
    // Calculate 20% loan amount
    const loanAmount = totalPrice * 0.2;
    
    // Calculate maximum monthly payment (15% of salary)
    const maxMonthlyPayment = monthlySalary * 0.15;
    
    // Calculate minimum months needed
    const minMonthsNeeded = Math.ceil(loanAmount / maxMonthlyPayment);
    
    // Set loan term between 6 and 12 months
    const loanTerm = Math.max(6, Math.min(12, minMonthsNeeded));
    
    // Actual monthly payment
    const monthlyPayment = loanAmount / loanTerm;
    const paymentPercentage = (monthlyPayment / monthlySalary) * 100;
    
    // Check if feasible
    const isFeasible = monthlyPayment <= maxMonthlyPayment;
    
    return {
      totalPrice,
      savingsTarget,
      weeksToSave,
      loanAmount,
      loanTerm,
      monthlyPayment,
      paymentPercentage,
      maxMonthlyPayment,
      isFeasible
    };
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
  
  getValues() {
    return {
      salary: parseFloat(this.salaryInput?.value) || 0,
      weeklyDeposit: parseFloat(this.depositInput?.value) || 0
    };
  }
}

// Export for global use
window.FinancialCalculator = FinancialCalculator;

