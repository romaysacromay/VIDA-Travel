// Financial Visualizer Component - Gamified Progress Visualization
// Shows real-time progress, goals, and savings timeline

class FinancialVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.lang = window.i18n?.getLanguage() || 'es-MX';
    this.currentData = {
      destination: null,
      salary: 0,
      weeklyDeposit: 0,
      adults: 2,
      children: 0,
      totalPrice: 0,
      savingsTarget: 0,
      weeksToSave: 0,
      loanAmount: 0
    };
    
    this.init();
  }
  
  init() {
    if (!this.container) {
      // Create container if it doesn't exist
      const form = document.getElementById('simulation-form');
      if (form) {
        this.container = document.createElement('div');
        this.container.id = 'financial-visualizer-container';
        this.container.className = 'financial-visualizer';
        // Insert after destination selector
        const destGroup = form.querySelector('#destination-selector-container')?.closest('.form-group');
        if (destGroup) {
          destGroup.insertAdjacentElement('afterend', this.container);
        }
      }
    }
    
    this.render();
    
    // Listen for language changes
    window.addEventListener('languageChanged', () => {
      this.lang = window.i18n?.getLanguage() || 'es-MX';
      this.render();
    });
  }
  
  updateData(data) {
    this.currentData = { ...this.currentData, ...data };
    this.calculateMetrics();
    this.render();
  }
  
  calculateMetrics() {
    const { destination, salary, weeklyDeposit, adults, children } = this.currentData;
    
    if (!destination || salary <= 0 || weeklyDeposit <= 0) {
      return;
    }
    
    // Get destination data - try multiple ways to access it
    let destData = null;
    if (window.destinationSelector && typeof window.destinationSelector.getDestinationData === 'function') {
      destData = window.destinationSelector.getDestinationData(destination);
    }
    
    // Fallback: hardcoded destination data if selector not available
    if (!destData) {
      const destinations = {
        'cancun': { priceRange: { min: 20000, max: 25000 } },
        'puerto-vallarta': { priceRange: { min: 15000, max: 20000 } },
        'los-cabos': { priceRange: { min: 20000, max: 25000 } },
        'ciudad-de-mexico': { priceRange: { min: 10000, max: 15000 } },
        'oaxaca': { priceRange: { min: 10000, max: 15000 } },
        'chiapas': { priceRange: { min: 15000, max: 20000 } }
      };
      destData = destinations[destination];
    }
    
    if (!destData) return;
    
    // Calculate total price
    const avgPrice = (destData.priceRange.min + destData.priceRange.max) / 2;
    const childrenPrice = avgPrice * 0.25;
    const calculatedTotalPrice = (adults * avgPrice) + (children * childrenPrice);
    
    // Calculate savings target (80%)
    const savingsTarget = calculatedTotalPrice * 0.8;
    const loanAmount = calculatedTotalPrice * 0.2;
    
    // Calculate weeks to save
    const weeksToSave = Math.ceil(savingsTarget / weeklyDeposit);
    
    // Calculate monthly savings
    const monthlySavings = weeklyDeposit * 4;
    const monthsToSave = Math.ceil(savingsTarget / monthlySavings);
    
    // Calculate progress percentage based on weekly deposit vs required weekly amount
    const requiredWeeklyAmount = savingsTarget / weeksToSave;
    const progressPercentage = Math.min(100, (weeklyDeposit / requiredWeeklyAmount) * 100);
    
    // Calculate earliest date
    const today = new Date();
    const earliestDate = new Date(today);
    earliestDate.setDate(earliestDate.getDate() + (weeksToSave * 7));
    
    this.currentData = {
      ...this.currentData,
      totalPrice: calculatedTotalPrice,
      savingsTarget,
      loanAmount,
      weeksToSave,
      monthsToSave,
      monthlySavings,
      progressPercentage: isNaN(progressPercentage) ? 0 : progressPercentage,
      earliestDate
    };
  }
  
  render() {
    if (!this.container) return;
    
    const { destination, salary, weeklyDeposit, totalPrice, savingsTarget, weeksToSave, loanAmount, progressPercentage, earliestDate } = this.currentData;
    
    // Don't show if no data
    if (!destination || salary <= 0 || weeklyDeposit <= 0) {
      this.container.style.display = 'none';
      return;
    }
    
    this.container.style.display = 'block';
    
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-MX', { 
        style: 'currency', 
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };
    
    const formatDate = (date) => {
      if (!date) return '';
      return date.toLocaleDateString(this.lang === 'es-MX' ? 'es-MX' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    // Calculate circular progress (0-100%)
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (progressPercentage / 100) * circumference;
    
    this.container.innerHTML = `
      <div class="visualizer-header">
        <h3>${this.lang === 'es-MX' ? 'Tu Progreso de Ahorro' : 'Your Savings Progress'}</h3>
      </div>
      
      <div class="visualizer-content">
        <!-- Circular Progress Indicator -->
        <div class="circular-progress-container">
          <svg class="circular-progress" width="120" height="120">
            <circle
              class="progress-ring-background"
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#e0e0e0"
              stroke-width="8"
            />
            <circle
              class="progress-ring"
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#4CAF50"
              stroke-width="8"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${offset}"
              stroke-linecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div class="progress-text">
            <div class="progress-percentage">${Math.round(progressPercentage)}%</div>
            <div class="progress-label">${this.lang === 'es-MX' ? 'del objetivo' : 'of goal'}</div>
          </div>
        </div>
        
        <!-- Key Metrics -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">💰</div>
            <div class="metric-value">${formatCurrency(weeklyDeposit)}</div>
            <div class="metric-label">${this.lang === 'es-MX' ? 'Depósito Semanal' : 'Weekly Deposit'}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">🎯</div>
            <div class="metric-value">${formatCurrency(savingsTarget)}</div>
            <div class="metric-label">${this.lang === 'es-MX' ? 'Meta de Ahorro (80%)' : 'Savings Goal (80%)'}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon">📅</div>
            <div class="metric-value">${weeksToSave}</div>
            <div class="metric-label">${this.lang === 'es-MX' ? 'Semanas para Ahorrar' : 'Weeks to Save'}</div>
          </div>
          
          <div class="metric-card highlight">
            <div class="metric-icon">✈️</div>
            <div class="metric-value">${formatDate(earliestDate)}</div>
            <div class="metric-label">${this.lang === 'es-MX' ? 'Fecha Más Temprana' : 'Earliest Date'}</div>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="progress-bar-container">
          <div class="progress-bar-label">
            <span>${this.lang === 'es-MX' ? 'Progreso hacia tu meta' : 'Progress to Goal'}</span>
            <span class="progress-bar-percentage">${Math.round(progressPercentage)}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width: ${progressPercentage}%"></div>
          </div>
        </div>
        
        <!-- Savings Timeline Visualization -->
        <div class="timeline-container">
          <h4>${this.lang === 'es-MX' ? 'Línea de Tiempo de Ahorro' : 'Savings Timeline'}</h4>
          <div class="timeline-visualization">
            ${this.renderTimeline()}
          </div>
        </div>
        
        <!-- Weekly Payment Visualization -->
        <div class="weekly-payments-visualization">
          <h4>${this.lang === 'es-MX' ? 'Acumulación Semanal' : 'Weekly Accumulation'}</h4>
          <div class="payment-circles">
            ${this.renderPaymentCircles()}
          </div>
        </div>
      </div>
    `;
    
    // Animate progress
    this.animateProgress();
  }
  
  renderTimeline() {
    const { weeksToSave, weeklyDeposit, savingsTarget } = this.currentData;
    const milestones = [0.25, 0.5, 0.75, 1.0];
    
    const weekLabel = this.lang === 'es-MX' ? 'Semana' : 'Week';
    
    return `
      <div class="timeline-bar">
        ${milestones.map((milestone, index) => {
          const week = Math.floor(weeksToSave * milestone);
          const amount = savingsTarget * milestone;
          return `
            <div class="timeline-milestone" style="left: ${milestone * 100}%">
              <div class="milestone-marker"></div>
              <div class="milestone-label">
                <div class="milestone-week">${weekLabel} ${week}</div>
                <div class="milestone-amount">${this.formatCurrency(amount)}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  
  renderPaymentCircles() {
    const { weeksToSave, weeklyDeposit } = this.currentData;
    const maxCircles = Math.min(weeksToSave, 20); // Show max 20 circles
    const circles = [];
    
    for (let i = 0; i < maxCircles; i++) {
      const isFilled = i < Math.min(weeksToSave, 10); // Fill first 10 or all if less
      circles.push(`
        <div class="payment-circle ${isFilled ? 'filled' : ''}" style="animation-delay: ${i * 0.1}s">
          <span>${this.formatCurrency(weeklyDeposit)}</span>
        </div>
      `);
    }
    
    if (weeksToSave > maxCircles) {
      circles.push(`
        <div class="payment-circle-more">
          +${weeksToSave - maxCircles} ${this.lang === 'es-MX' ? 'más' : 'more'}
        </div>
      `);
    }
    
    if (circles.length === 0) {
      circles.push(`
        <div class="payment-circle-more">
          ${this.lang === 'es-MX' ? 'Ingresa tus datos para ver el progreso' : 'Enter your data to see progress'}
        </div>
      `);
    }
    
    return circles.join('');
  }
  
  formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  animateProgress() {
    // Animate circular progress
    const progressRing = this.container.querySelector('.progress-ring');
    if (progressRing) {
      progressRing.style.transition = 'stroke-dashoffset 1s ease-in-out';
    }
    
    // Animate progress bar
    const progressBarFill = this.container.querySelector('.progress-bar-fill');
    if (progressBarFill) {
      progressBarFill.style.transition = 'width 1s ease-in-out';
    }
    
    // Animate payment circles
    const circles = this.container.querySelectorAll('.payment-circle');
    circles.forEach((circle, index) => {
      circle.style.animation = `fadeInScale 0.5s ease-out ${index * 0.1}s both`;
    });
  }
}

// Export for global use
window.FinancialVisualizer = FinancialVisualizer;

