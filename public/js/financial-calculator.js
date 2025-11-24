/**
 * VIDA Travel - Financial Calculator Module
 * Handles all vacation credit calculations and validations
 */

export class FinancialCalculator {
  constructor() {
    this.CHILD_PRICE_MULTIPLIER = 0.25;
    this.DEFAULT_LOAN_PERCENTAGE = 0.20;
    this.SALARY_CAP_PERCENTAGE = 0.15;
    this.MIN_SALARY = 8000;
    this.WEEKS_PER_MONTH = 4.33;
    this.LOAN_REPAYMENT_MONTHS = 12;
    this.BUFFER_WEEKS = 1;
    this.MIN_VACATION_NIGHTS = 3;
    this.MAX_VACATION_NIGHTS = 14;
  }

  /**
   * Calculate total package price
   */
  calculatePackagePrice(destinationPrice, adults, children, priceMultiplier = 1.0) {
    if (!destinationPrice || adults < 1) {
      throw new Error('Invalid destination price or adult count');
    }

    const adultCost = destinationPrice * adults * priceMultiplier;
    const childCost = destinationPrice * children * this.CHILD_PRICE_MULTIPLIER * priceMultiplier;
    const totalPrice = adultCost + childCost;

    return {
      adultCost,
      childCost,
      totalPrice: Math.round(totalPrice),
      pricePerPerson: Math.round(totalPrice / (adults + children))
    };
  }

  /**
   * Calculate savings required (80% of package)
   */
  calculateSavingsRequired(packagePrice) {
    return Math.round(packagePrice * 0.8);
  }

  /**
   * Calculate loan amount
   */
  calculateLoanAmount(packagePrice, loanPercentage = this.DEFAULT_LOAN_PERCENTAGE) {
    return Math.round(packagePrice * loanPercentage);
  }

  /**
   * Calculate how many weeks needed to save 80% of package
   */
  calculateSavingsWeeks(packagePrice, weeklyDeposit) {
    if (weeklyDeposit <= 0) {
      throw new Error('Weekly deposit must be greater than 0');
    }

    const savingsRequired = this.calculateSavingsRequired(packagePrice);
    return Math.ceil(savingsRequired / weeklyDeposit);
  }

  /**
   * Calculate earliest check-in date
   */
  calculateEarliestCheckIn(packagePrice, weeklyDeposit) {
    const savingsWeeks = this.calculateSavingsWeeks(packagePrice, weeklyDeposit);
    const totalWeeks = savingsWeeks + this.BUFFER_WEEKS;
    
    const today = new Date();
    const earliestDate = new Date(today);
    earliestDate.setDate(earliestDate.getDate() + (totalWeeks * 7));

    return {
      earliestDate,
      savingsWeeks,
      bufferWeeks: this.BUFFER_WEEKS,
      totalWeeks
    };
  }

  /**
   * Calculate monthly deposit amount
   */
  calculateMonthlyDeposit(weeklyDeposit) {
    return Math.round(weeklyDeposit * this.WEEKS_PER_MONTH);
  }

  /**
   * Calculate monthly loan repayment
   */
  calculateMonthlyLoanPayment(loanAmount) {
    return Math.round(loanAmount / this.LOAN_REPAYMENT_MONTHS);
  }

  /**
   * Calculate total monthly payment (deposits + loan)
   */
  calculateTotalMonthlyPayment(weeklyDeposit, loanAmount) {
    const monthlyDeposit = this.calculateMonthlyDeposit(weeklyDeposit);
    const monthlyLoan = this.calculateMonthlyLoanPayment(loanAmount);
    return monthlyDeposit + monthlyLoan;
  }

  /**
   * Validate that monthly payment doesn't exceed salary cap (15%)
   */
  validatePaymentCap(monthlySalary, weeklyDeposit, loanAmount) {
    if (monthlySalary < this.MIN_SALARY) {
      return {
        valid: false,
        message: `El salario mínimo requerido es $${this.MIN_SALARY.toLocaleString('es-MX')} MXN`,
        exceedsBy: 0
      };
    }

    const totalMonthly = this.calculateTotalMonthlyPayment(weeklyDeposit, loanAmount);
    const maxAllowed = Math.round(monthlySalary * this.SALARY_CAP_PERCENTAGE);

    if (totalMonthly > maxAllowed) {
      const exceedsBy = totalMonthly - maxAllowed;
      return {
        valid: false,
        message: `Tu pago mensual ($${totalMonthly.toLocaleString('es-MX')}) excede el 15% de tu salario ($${maxAllowed.toLocaleString('es-MX')}). Reduce tu ahorro semanal en aproximadamente $${Math.ceil(exceedsBy / this.WEEKS_PER_MONTH).toLocaleString('es-MX')} por semana.`,
        totalMonthly,
        maxAllowed,
        exceedsBy
      };
    }

    const percentageUsed = ((totalMonthly / monthlySalary) * 100).toFixed(1);
    
    return {
      valid: true,
      totalMonthly,
      maxAllowed,
      percentageUsed,
      remainingCapacity: maxAllowed - totalMonthly
    };
  }

  /**
   * Validate date selection
   */
  validateDateSelection(checkInDate, checkOutDate, earliestCheckIn) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const earliest = new Date(earliestCheckIn);

    // Reset times to compare dates only
    checkIn.setHours(0, 0, 0, 0);
    checkOut.setHours(0, 0, 0, 0);
    earliest.setHours(0, 0, 0, 0);

    // Check-in must be on or after earliest date
    if (checkIn < earliest) {
      return {
        valid: false,
        message: `La fecha de check-in debe ser a partir del ${this.formatDate(earliest, 'es')}`
      };
    }

    // Check-out must be after check-in
    if (checkOut <= checkIn) {
      return {
        valid: false,
        message: 'La fecha de check-out debe ser posterior a la de check-in'
      };
    }

    // Calculate nights
    const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    // Validate vacation length
    if (nights < this.MIN_VACATION_NIGHTS) {
      return {
        valid: false,
        message: `La estadía mínima es de ${this.MIN_VACATION_NIGHTS} noches`
      };
    }

    if (nights > this.MAX_VACATION_NIGHTS) {
      return {
        valid: false,
        message: `La estadía máxima es de ${this.MAX_VACATION_NIGHTS} noches`
      };
    }

    return {
      valid: true,
      nights,
      checkIn,
      checkOut
    };
  }

  /**
   * Calculate complete vacation plan
   */
  calculateVacationPlan(params) {
    const {
      destinationPrice,
      adults,
      children,
      monthlySalary,
      weeklyDeposit,
      priceMultiplier = 1.0,
      loanPercentage = this.DEFAULT_LOAN_PERCENTAGE
    } = params;

    // 1. Calculate package price
    const pricing = this.calculatePackagePrice(
      destinationPrice,
      adults,
      children,
      priceMultiplier
    );

    // 2. Calculate loan and savings
    const loanAmount = this.calculateLoanAmount(pricing.totalPrice, loanPercentage);
    const savingsRequired = this.calculateSavingsRequired(pricing.totalPrice);

    // 3. Calculate timeline
    const timeline = this.calculateEarliestCheckIn(pricing.totalPrice, weeklyDeposit);

    // 4. Calculate monthly payments
    const monthlyDeposit = this.calculateMonthlyDeposit(weeklyDeposit);
    const monthlyLoan = this.calculateMonthlyLoanPayment(loanAmount);
    const totalMonthly = monthlyDeposit + monthlyLoan;

    // 5. Validate payment cap
    const validation = this.validatePaymentCap(monthlySalary, weeklyDeposit, loanAmount);

    return {
      pricing,
      savings: {
        required: savingsRequired,
        percentage: 80,
        weeklyDeposit,
        monthlyDeposit
      },
      loan: {
        amount: loanAmount,
        percentage: loanPercentage * 100,
        monthlyPayment: monthlyLoan,
        totalMonths: this.LOAN_REPAYMENT_MONTHS,
        interestRate: 0
      },
      timeline: {
        savingsWeeks: timeline.savingsWeeks,
        bufferWeeks: timeline.bufferWeeks,
        totalWeeks: timeline.totalWeeks,
        earliestCheckIn: timeline.earliestDate
      },
      payments: {
        weeklyDeposit,
        monthlyDeposit,
        monthlyLoan,
        totalMonthly,
        percentageOfSalary: ((totalMonthly / monthlySalary) * 100).toFixed(1)
      },
      validation
    };
  }

  /**
   * Format currency (MXN)
   */
  formatCurrency(amount, locale = 'es-MX') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Format date
   */
  formatDate(date, locale = 'es-MX') {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }

  /**
   * Format date for input (YYYY-MM-DD)
   */
  formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Calculate savings progress percentage
   */
  calculateSavingsProgress(weeksPassed, totalWeeks) {
    if (totalWeeks === 0) return 0;
    return Math.min(100, Math.round((weeksPassed / totalWeeks) * 100));
  }
}

// Export singleton instance
export const calculator = new FinancialCalculator();
export default calculator;

