// Enhanced Financial Visualizer Component - Gamified Real-time Progress
// Shows interactive progress, goals, and savings timeline with animations

class FinancialVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.lang = window.i18n?.getLanguage() || 'es-MX';
    this.currentData = {
      destination: null,
      salary: 0,
      weeklyDeposit: 0,
      adults: 2,
      children: 0
    };
    
    this.metrics = {
      totalPrice: 0,
      savingsTarget: 0,
      weeksToSave: 0,
      loanAmount: 0,
      monthlyPayment: 0,
      loanTerm: 0
    };
    
    this.init();
  }
  
  init() {
    if (!this.container) return;
    
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
      this.container.style.display = 'none';
      return;
    }
    
    // Get destination data
    let destData = destination;
    if (typeof destination === 'string') {
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
    
    if (!destData || !destData.priceRange) return;
    
    // Calculate metrics
    const avgPrice = (destData.priceRange.min + destData.priceRange.max) / 2;
    const totalPrice = (adults * avgPrice) + (children * avgPrice * 0.25);
    const savingsTarget = totalPrice * 0.8;
    const loanAmount = totalPrice * 0.2;
    const weeksToSave = Math.ceil(savingsTarget / weeklyDeposit);
    
    // Calculate loan repayment
    const maxMonthlyPayment = salary * 0.15;
    let loanTerm = Math.ceil(loanAmount / maxMonthlyPayment);
    loanTerm = Math.max(6, Math.min(12, loanTerm));
    const monthlyPayment = loanAmount / loanTerm;
    
    this.metrics = {
      totalPrice,
      savingsTarget,
      weeksToSave,
      loanAmount,
      monthlyPayment,
      loanTerm
    };
  }
  
  render() {
    if (!this.container) return;
    
    const { salary, weeklyDeposit } = this.currentData;
    
    if (salary <= 0 || weeklyDeposit <= 0 || this.metrics.totalPrice <= 0) {
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
    
    const savingsProgress = Math.min(100, (weeklyDeposit / (this.metrics.savingsTarget / this.metrics.weeksToSave)) * 100);
    const isOnTrack = savingsProgress >= 80;
    
    this.container.innerHTML = `
      <div class="financial-visualizer-card">
        <h4 class="visualizer-title">
          ${isOnTrack ? '🎯' : '⚡'} Tu Plan de Ahorro en Tiempo Real
        </h4>
        
        <div class="visualizer-metrics">
          <!-- Progress Circle -->
          <div class="progress-circle-container">
            <svg class="progress-circle" width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="#E5E7EB" stroke-width="10"/>
              <circle cx="80" cy="80" r="70" fill="none" 
                      stroke="${isOnTrack ? '#10B981' : '#F59E0B'}" 
                      stroke-width="10" 
                      stroke-dasharray="${2 * Math.PI * 70}" 
                      stroke-dashoffset="${2 * Math.PI * 70 * (1 - savingsProgress / 100)}"
                      stroke-linecap="round"
                      transform="rotate(-90 80 80)"
                      style="transition: stroke-dashoffset 1s ease-in-out"/>
            </svg>
            <div class="progress-text">
              <div class="progress-percentage">${Math.round(savingsProgress)}%</div>
              <div class="progress-label">${isOnTrack ? '¡Excelente!' : 'En progreso'}</div>
            </div>
          </div>
          
          <!-- Metrics Grid -->
          <div class="metrics-cards">
            <div class="metric-card highlight">
              <div class="metric-icon">💰</div>
              <div class="metric-value">${formatCurrency(this.metrics.totalPrice)}</div>
              <div class="metric-label">Precio Total</div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">🏦</div>
              <div class="metric-value">${formatCurrency(this.metrics.savingsTarget)}</div>
              <div class="metric-label">Tu Ahorro (80%)</div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">📅</div>
              <div class="metric-value">${this.metrics.weeksToSave}</div>
              <div class="metric-label">Semanas ahorrando</div>
            </div>
            
            <div class="metric-card highlight">
              <div class="metric-icon">🎁</div>
              <div class="metric-value">${formatCurrency(this.metrics.loanAmount)}</div>
              <div class="metric-label">Préstamo VIDA (20%)</div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">💳</div>
              <div class="metric-value">${formatCurrency(this.metrics.monthlyPayment)}</div>
              <div class="metric-label">Pago mensual</div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">⏱️</div>
              <div class="metric-value">${this.metrics.loanTerm} meses</div>
              <div class="metric-label">Plazo del préstamo</div>
            </div>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="savings-progress-bar">
          <div class="progress-bar-header">
            <span>Progreso de ahorro</span>
            <span class="progress-percentage-text">${Math.round(savingsProgress)}%</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${savingsProgress}%; background: ${isOnTrack ? 'linear-gradient(90deg, #10B981, #34D399)' : 'linear-gradient(90deg, #F59E0B, #FBBF24)'};">
              <div class="progress-bar-shimmer"></div>
            </div>
          </div>
        </div>
        
        <!-- Encouragement Message -->
        <div class="encouragement-message ${isOnTrack ? 'success' : 'info'}">
          ${isOnTrack 
            ? '🎉 ¡Vas muy bien! Tu depósito semanal te permite ahorrar rápidamente.'
            : '💪 Puedes aumentar tu depósito semanal para viajar más pronto.'
          }
        </div>
      </div>
    `;
    
    // Trigger animations
    this.animateProgressCircle();
  }
  
  animateProgressCircle() {
    const circles = this.container.querySelectorAll('.progress-circle circle:last-child');
    circles.forEach(circle => {
      const dashoffset = circle.getAttribute('stroke-dashoffset');
      circle.style.strokeDashoffset = 2 * Math.PI * 70;
      setTimeout(() => {
        circle.style.strokeDashoffset = dashoffset;
      }, 100);
    });
  }
}

// Export for global use
window.FinancialVisualizer = FinancialVisualizer;

// Add additional CSS for the enhanced visualizer
const visualizerStyle = document.createElement('style');
visualizerStyle.textContent = `
  .financial-visualizer-card {
    background: linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%);
    border-radius: 1.5rem;
    padding: 2rem;
    margin: 2rem 0;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    animation: fade-in-up 0.5s ease-out;
  }
  
  .visualizer-title {
    font-family: 'Poppins', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .visualizer-metrics {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2rem;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .progress-circle-container {
    position: relative;
    width: 160px;
    height: 160px;
  }
  
  .progress-circle {
    transform: rotate(-90deg);
  }
  
  .progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  
  .progress-percentage {
    font-family: 'Poppins', sans-serif;
    font-size: 2.5rem;
    font-weight: 800;
    color: #0066FF;
    line-height: 1;
  }
  
  .progress-label {
    font-size: 0.875rem;
    color: #6B7280;
    margin-top: 0.25rem;
  }
  
  .metrics-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
  }
  
  .metric-card {
    background: white;
    padding: 1.25rem;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }
  
  .metric-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .metric-card.highlight {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: transparent;
  }
  
  .metric-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .metric-value {
    font-family: 'Poppins', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.25rem;
  }
  
  .metric-card.highlight .metric-value {
    color: white;
  }
  
  .metric-label {
    font-size: 0.75rem;
    color: #6B7280;
    line-height: 1.2;
  }
  
  .metric-card.highlight .metric-label {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .savings-progress-bar {
    margin-bottom: 1.5rem;
  }
  
  .progress-bar-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }
  
  .progress-percentage-text {
    color: #0066FF;
  }
  
  .progress-bar-track {
    height: 12px;
    background: #E5E7EB;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .progress-bar-fill {
    height: 100%;
    border-radius: 6px;
    transition: width 1s ease-in-out;
    position: relative;
    overflow: hidden;
  }
  
  .progress-bar-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    to {
      left: 100%;
    }
  }
  
  .encouragement-message {
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    font-weight: 500;
    text-align: center;
  }
  
  .encouragement-message.success {
    background: #D1FAE5;
    color: #065F46;
    border-left: 4px solid #10B981;
  }
  
  .encouragement-message.info {
    background: #DBEAFE;
    color: #1E40AF;
    border-left: 4px solid #3B82F6;
  }
  
  @media (max-width: 768px) {
    .visualizer-metrics {
      grid-template-columns: 1fr;
    }
    
    .progress-circle-container {
      margin: 0 auto;
    }
    
    .metrics-cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 480px) {
    .metrics-cards {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(visualizerStyle);
