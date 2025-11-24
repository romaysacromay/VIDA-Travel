/**
 * VIDA Travel - Financial Visualizer Module
 * Handles gamified visualizations and animations for the calculator results
 */

import { calculator } from './financial-calculator.js';

export class FinancialVisualizer {
  constructor() {
    this.animationDuration = 1500; // ms
    this.confettiColors = ['#004E50', '#C3A574', '#84C6C1', '#FAF9F6'];
  }

  /**
   * Update package price preview on Step 1
   */
  updatePackagePricePreview(packagePrice) {
    const previewCard = document.getElementById('package-price-preview');
    const amountElement = document.getElementById('package-price-amount');

    if (previewCard && amountElement) {
      amountElement.textContent = calculator.formatCurrency(packagePrice);
      previewCard.style.display = 'block';
      
      // Animate the card appearance
      previewCard.style.opacity = '0';
      previewCard.style.transform = 'translateY(20px)';
      
      requestAnimationFrame(() => {
        previewCard.style.transition = 'all 0.5s ease-out';
        previewCard.style.opacity = '1';
        previewCard.style.transform = 'translateY(0)';
      });
    }
  }

  /**
   * Display complete vacation plan on Step 3
   */
  displayVacationPlan(plan) {
    // Update savings breakdown
    document.getElementById('user-savings-amount').textContent = 
      calculator.formatCurrency(plan.savings.required);
    
    document.getElementById('loan-amount').textContent = 
      calculator.formatCurrency(plan.loan.amount);
    
    document.getElementById('total-package-amount').textContent = 
      calculator.formatCurrency(plan.pricing.totalPrice);

    // Update timeline
    document.getElementById('savings-weeks').textContent = plan.timeline.savingsWeeks;
    document.getElementById('weekly-savings-display').textContent = 
      calculator.formatCurrency(plan.savings.weeklyDeposit);
    
    const earliestDate = calculator.formatDate(plan.timeline.earliestCheckIn);
    document.getElementById('earliest-checkin-date').textContent = earliestDate;

    // Update monthly payments
    document.getElementById('monthly-deposits-amount').textContent = 
      calculator.formatCurrency(plan.payments.monthlyDeposit);
    
    document.getElementById('monthly-loan-payment').textContent = 
      calculator.formatCurrency(plan.payments.monthlyLoan);
    
    document.getElementById('total-monthly-payment').textContent = 
      calculator.formatCurrency(plan.payments.totalMonthly);
    
    document.getElementById('payment-percentage').textContent = 
      `${plan.payments.percentageOfSalary}%`;

    // Animate progress bar
    this.animateProgressBar(plan.savings.percentage);

    // Animate numbers counting up
    this.animateCountUp('user-savings-amount', plan.savings.required);
    this.animateCountUp('loan-amount', plan.loan.amount);
    this.animateCountUp('total-monthly-payment', plan.payments.totalMonthly);
  }

  /**
   * Animate progress bar fill
   */
  animateProgressBar(targetPercentage) {
    const progressFill = document.getElementById('savings-progress-fill');
    const percentageDisplay = document.getElementById('savings-percentage');
    
    if (!progressFill) return;

    // Reset
    progressFill.style.width = '0%';
    progressFill.setAttribute('aria-valuenow', '0');

    // Animate
    requestAnimationFrame(() => {
      setTimeout(() => {
        progressFill.style.width = `${targetPercentage}%`;
        progressFill.setAttribute('aria-valuenow', targetPercentage);
        
        if (percentageDisplay) {
          percentageDisplay.textContent = `${targetPercentage}%`;
        }

        // Animate milestones
        this.animateMilestones(targetPercentage);
      }, 100);
    });
  }

  /**
   * Animate milestone markers
   */
  animateMilestones(targetPercentage) {
    const milestones = document.querySelectorAll('.progress-milestone');
    
    milestones.forEach((milestone, index) => {
      const milestoneValue = parseInt(milestone.getAttribute('data-milestone'));
      
      if (milestoneValue <= targetPercentage) {
        setTimeout(() => {
          milestone.classList.add('reached');
        }, (index + 1) * 300);
      } else {
        milestone.classList.remove('reached');
      }
    });
  }

  /**
   * Animate number counting up
   */
  animateCountUp(elementId, targetValue, duration = 1500) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startValue = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);

      element.textContent = calculator.formatCurrency(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = calculator.formatCurrency(targetValue);
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Display payment cap information on Step 2
   */
  displayPaymentCapInfo(monthlySalary) {
    const capInfoCard = document.getElementById('payment-cap-info');
    const limitAmount = document.getElementById('monthly-limit-amount');

    if (capInfoCard && limitAmount && monthlySalary > 0) {
      const maxAllowed = Math.round(monthlySalary * 0.15);
      limitAmount.textContent = calculator.formatCurrency(maxAllowed);
      capInfoCard.style.display = 'block';

      // Animate appearance
      capInfoCard.style.opacity = '0';
      requestAnimationFrame(() => {
        capInfoCard.style.transition = 'opacity 0.3s ease-out';
        capInfoCard.style.opacity = '1';
      });
    }
  }

  /**
   * Display validation error
   */
  displayValidationError(message, elementId = 'deposit-error') {
    const errorElement = document.getElementById(elementId);
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      
      // Shake animation
      errorElement.style.animation = 'shake 0.5s';
      setTimeout(() => {
        errorElement.style.animation = '';
      }, 500);
    }
  }

  /**
   * Clear validation error
   */
  clearValidationError(elementId = 'deposit-error') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.style.display = 'none';
      errorElement.textContent = '';
    }
  }

  /**
   * Update trip summary on Step 4
   */
  updateTripSummary(data) {
    const summaryCard = document.getElementById('trip-summary');
    
    if (summaryCard) {
      document.getElementById('summary-destination').textContent = data.destination || '--';
      document.getElementById('summary-travelers').textContent = 
        `${data.adults} ${data.adults === 1 ? 'adulto' : 'adultos'}${data.children > 0 ? `, ${data.children} ${data.children === 1 ? 'niño' : 'niños'}` : ''}`;
      
      if (data.checkIn && data.checkOut) {
        const checkInFormatted = calculator.formatDate(data.checkIn);
        const checkOutFormatted = calculator.formatDate(data.checkOut);
        document.getElementById('summary-dates').textContent = 
          `${checkInFormatted} a ${checkOutFormatted}`;
        document.getElementById('summary-nights').textContent = 
          `${data.nights} ${data.nights === 1 ? 'noche' : 'noches'}`;
      }

      summaryCard.style.display = 'block';
      
      // Animate appearance
      summaryCard.style.opacity = '0';
      summaryCard.style.transform = 'translateY(20px)';
      requestAnimationFrame(() => {
        summaryCard.style.transition = 'all 0.5s ease-out';
        summaryCard.style.opacity = '1';
        summaryCard.style.transform = 'translateY(0)';
      });
    }
  }

  /**
   * Show loading state
   */
  showLoading(message = 'Calculando...') {
    const overlay = document.getElementById('loading-overlay');
    const messageElement = document.getElementById('loading-message');
    
    if (overlay) {
      if (messageElement) {
        messageElement.textContent = message;
      }
      overlay.style.display = 'flex';
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  /**
   * Show success modal
   */
  showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
      modal.classList.add('active');
      
      // Trigger confetti
      this.triggerConfetti();
      
      // Close on backdrop click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideSuccessModal();
        }
      });

      // Close button
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.hideSuccessModal());
      }
    }
  }

  /**
   * Hide success modal
   */
  hideSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  /**
   * Trigger confetti celebration (simplified canvas-based)
   */
  triggerConfetti() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Simplified confetti effect using DOM elements
      for (let i = 0; i < particleCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        confetti.style.transition = 'all 3s ease-out';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '10000';
        
        document.body.appendChild(confetti);

        setTimeout(() => {
          confetti.style.top = window.innerHeight + 'px';
          confetti.style.opacity = '0';
          confetti.style.transform = 'rotate(' + (Math.random() * 720) + 'deg)';
        }, 50);

        setTimeout(() => {
          document.body.removeChild(confetti);
        }, 3100);
      }
    }, 250);
  }

  /**
   * Update top progress bar
   */
  updateTopProgressBar(step, totalSteps = 5) {
    const progressFill = document.getElementById('top-progress-fill');
    if (progressFill) {
      const percentage = (step / totalSteps) * 100;
      progressFill.style.width = `${percentage}%`;
    }
  }

  /**
   * Add shake animation to element
   */
  shakeElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.animation = 'shake 0.5s';
      setTimeout(() => {
        element.style.animation = '';
      }, 500);
    }
  }

  /**
   * Highlight element temporarily
   */
  highlightElement(elementId, duration = 2000) {
    const element = document.getElementById(elementId);
    if (element) {
      const originalBackground = element.style.backgroundColor;
      element.style.transition = 'background-color 0.3s';
      element.style.backgroundColor = 'rgba(132, 198, 193, 0.2)';
      
      setTimeout(() => {
        element.style.backgroundColor = originalBackground;
      }, duration);
    }
  }
}

// Add shake animation to CSS if not exists
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;
document.head.appendChild(style);

// Export singleton instance
export const visualizer = new FinancialVisualizer();
export default visualizer;

