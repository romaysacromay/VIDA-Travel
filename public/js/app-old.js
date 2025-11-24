/**
 * VIDA Travel - Main Application Controller
 * Orchestrates the entire vacation credit simulator flow
 */

import { calculator } from './financial-calculator.js';
import { visualizer } from './financial-visualizer.js';
import { datePicker } from './date-picker.js';
import { analytics } from './analytics.js';
import { variantManager } from './variant-manager.js';

class VacationSimulatorApp {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.selectedDestination = null;
    this.vacationPlan = null;
    this.destinations = [
      { id: 'cancun', name: { es: 'Cancún', en: 'Cancun' }, basePrice: 15000, imageUrl: '/assets/destinations/cancun.jpg' },
      { id: 'playadelcarmen', name: { es: 'Playa del Carmen', en: 'Playa del Carmen' }, basePrice: 13000, imageUrl: '/assets/destinations/playa.jpg' },
      { id: 'tulum', name: { es: 'Tulum', en: 'Tulum' }, basePrice: 16000, imageUrl: '/assets/destinations/tulum.jpg' },
      { id: 'cabo', name: { es: 'Cabo San Lucas', en: 'Cabo San Lucas' }, basePrice: 18000, imageUrl: '/assets/destinations/cabo.jpg' },
      { id: 'puertovallarta', name: { es: 'Puerto Vallarta', en: 'Puerto Vallarta' }, basePrice: 14000, imageUrl: '/assets/destinations/vallarta.jpg' },
      { id: 'cdmx', name: { es: 'Ciudad de México', en: 'Mexico City' }, basePrice: 10000, imageUrl: '/assets/destinations/cdmx.jpg' }
    ];
  }

  /**
   * Initialize application
   */
  async init() {
    console.log('🚀 Initializing VIDA Travel Simulator...');

    // Wait for variant manager to initialize
    await variantManager.init();

    // Load destinations
    this.loadDestinations();

    // Setup step navigation
    this.setupStepNavigation();

    // Setup form handlers
    this.setupStep1Handlers();
    this.setupStep2Handlers();
    this.setupStep3Handlers();
    this.setupStep4Handlers();

    console.log('✅ Application initialized');
  }

  /**
   * Load destination cards
   */
  loadDestinations() {
    const grid = document.getElementById('destinations-grid');
    if (!grid) return;

    grid.innerHTML = '';

    this.destinations.forEach(dest => {
      const card = this.createDestinationCard(dest);
      grid.appendChild(card);
    });
  }

  /**
   * Create destination card
   */
  createDestinationCard(destination) {
    const card = document.createElement('div');
    card.className = 'destination-card card';
    card.setAttribute('data-destination-id', destination.id);
    
    // Apply variant price multiplier
    const priceMultiplier = variantManager.getPriceMultiplier();
    const displayPrice = Math.round(destination.basePrice * priceMultiplier);

    card.innerHTML = `
      <img src="${destination.imageUrl}" alt="${destination.name.es}" class="destination-card-image" 
           onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect width=%22400%22 height=%22200%22 fill=%22%23004E50%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2224%22%3E${destination.name.es}%3C/text%3E%3C/svg%3E';">
      <div class="destination-card-checkmark">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="destination-card-content">
        <h3 class="destination-card-name">${destination.name.es}</h3>
        <p class="destination-card-price">Desde ${calculator.formatCurrency(displayPrice)}</p>
      </div>
    `;

    card.addEventListener('click', () => this.selectDestination(destination.id));

    return card;
  }

  /**
   * Select destination
   */
  selectDestination(destinationId) {
    // Remove selection from all cards
    document.querySelectorAll('.destination-card').forEach(card => {
      card.classList.remove('selected');
    });

    // Select clicked card
    const selectedCard = document.querySelector(`[data-destination-id="${destinationId}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
    }

    this.selectedDestination = this.destinations.find(d => d.id === destinationId);

    // Update package price preview
    this.updatePackagePreview();

    // Enable continue button
    document.getElementById('step1-continue').disabled = false;

    // Track destination selected
    const priceMultiplier = variantManager.getPriceMultiplier();
    const displayPrice = Math.round(this.selectedDestination.basePrice * priceMultiplier);
    analytics.trackDestinationSelected(destinationId, displayPrice);
  }

  /**
   * Update package price preview
   */
  updatePackagePreview() {
    if (!this.selectedDestination) return;

    const adults = parseInt(document.getElementById('adults-count').value);
    const children = parseInt(document.getElementById('children-count').value);
    const priceMultiplier = variantManager.getPriceMultiplier();

    const pricing = calculator.calculatePackagePrice(
      this.selectedDestination.basePrice,
      adults,
      children,
      priceMultiplier
    );

    visualizer.updatePackagePricePreview(pricing.totalPrice);
  }

  /**
   * Setup step navigation
   */
  setupStepNavigation() {
    // Continue buttons
    document.getElementById('step1-continue').addEventListener('click', () => this.goToStep(2));
    document.getElementById('step2-continue').addEventListener('click', () => this.calculateAndShowResults());
    document.getElementById('step3-continue').addEventListener('click', () => this.goToStep(4));
    document.getElementById('step4-continue').addEventListener('click', () => this.goToStep(5));

    // Back buttons
    document.getElementById('step2-back').addEventListener('click', () => this.goToStep(1));
    document.getElementById('step3-back').addEventListener('click', () => this.goToStep(2));
    document.getElementById('step4-back').addEventListener('click', () => this.goToStep(3));
    document.getElementById('step5-back').addEventListener('click', () => this.goToStep(4));
  }

  /**
   * Navigate to step
   */
  goToStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.journey-step').forEach(step => {
      step.classList.remove('active');
    });

    // Show target step
    const targetStep = document.querySelector(`[data-step="${stepNumber}"]`);
    if (targetStep) {
      targetStep.classList.add('active');
      targetStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.currentStep = stepNumber;

      // Update progress bar
      visualizer.updateTopProgressBar(stepNumber, this.totalSteps);
    }
  }

  /**
   * Setup Step 1 handlers
   */
  setupStep1Handlers() {
    // Adult/children count changes
    document.getElementById('adults-count').addEventListener('change', () => this.updatePackagePreview());
    document.getElementById('children-count').addEventListener('change', () => this.updatePackagePreview());
  }

  /**
   * Setup Step 2 handlers
   */
  setupStep2Handlers() {
    const salaryInput = document.getElementById('monthly-salary');
    const depositInput = document.getElementById('weekly-deposit');
    const continueBtn = document.getElementById('step2-continue');

    salaryInput.addEventListener('input', () => {
      const salary = parseInt(salaryInput.value) || 0;
      if (salary >= 8000) {
        visualizer.displayPaymentCapInfo(salary);
        this.validateStep2();
      }
    });

    depositInput.addEventListener('input', () => {
      this.validateStep2();
    });
  }

  /**
   * Validate Step 2
   */
  validateStep2() {
    const salary = parseInt(document.getElementById('monthly-salary').value) || 0;
    const deposit = parseInt(document.getElementById('weekly-deposit').value) || 0;
    const continueBtn = document.getElementById('step2-continue');

    if (salary >= 8000 && deposit > 0) {
      visualizer.clearValidationError();
      continueBtn.disabled = false;

      // Track financial info entered
      analytics.trackFinancialInfoEntered({ monthlySalary: salary, weeklyDeposit: deposit });
    } else {
      continueBtn.disabled = true;
    }
  }

  /**
   * Calculate and show results (Step 3)
   */
  calculateAndShowResults() {
    const adults = parseInt(document.getElementById('adults-count').value);
    const children = parseInt(document.getElementById('children-count').value);
    const salary = parseInt(document.getElementById('monthly-salary').value);
    const deposit = parseInt(document.getElementById('weekly-deposit').value);

    const priceMultiplier = variantManager.getPriceMultiplier();
    const loanPercentage = variantManager.getLoanPercentage();

    try {
      // Calculate vacation plan
      this.vacationPlan = calculator.calculateVacationPlan({
        destinationPrice: this.selectedDestination.basePrice,
        adults,
        children,
        monthlySalary: salary,
        weeklyDeposit: deposit,
        priceMultiplier,
        loanPercentage
      });

      // Validate payment cap
      if (!this.vacationPlan.validation.valid) {
        visualizer.displayValidationError(this.vacationPlan.validation.message);
        return;
      }

      // Display results
      visualizer.displayVacationPlan(this.vacationPlan);

      // Store in session
      sessionStorage.setItem('vida_vacation_plan', JSON.stringify({
        destination: this.selectedDestination.id,
        destinationName: this.selectedDestination.name.es,
        adults,
        children,
        monthlySalary: salary,
        weeklyDeposit: deposit,
        ...this.vacationPlan
      }));

      // Track simulator completed
      analytics.trackSimulatorCompleted({
        destination: this.selectedDestination.id,
        adults,
        children,
        packagePrice: this.vacationPlan.pricing.totalPrice,
        savingsWeeks: this.vacationPlan.timeline.savingsWeeks,
        loanAmount: this.vacationPlan.loan.amount,
        totalMonthlyPayment: this.vacationPlan.payments.totalMonthly
      });

      // Go to step 3
      this.goToStep(3);

    } catch (error) {
      console.error('❌ Calculation error:', error);
      visualizer.displayValidationError('Error al calcular tu plan. Por favor verifica los datos.');
    }
  }

  /**
   * Setup Step 3 handlers
   */
  setupStep3Handlers() {
    // Continue to date selection
    document.getElementById('step3-continue').addEventListener('click', () => {
      // Initialize date picker with earliest date
      datePicker.initialize(this.vacationPlan.timeline.earliestCheckIn);
      this.goToStep(4);
    });
  }

  /**
   * Setup Step 4 handlers
   */
  setupStep4Handlers() {
    const checkinInput = document.getElementById('checkin-date');
    const checkoutInput = document.getElementById('checkout-date');
    const continueBtn = document.getElementById('step4-continue');

    const validateDates = () => {
      if (datePicker.areDatesValid()) {
        const dates = datePicker.getSelectedDates();
        
        // Update trip summary
        const planData = JSON.parse(sessionStorage.getItem('vida_vacation_plan'));
        visualizer.updateTripSummary({
          destination: planData.destinationName,
          adults: planData.adults,
          children: planData.children,
          checkIn: dates.checkIn,
          checkOut: dates.checkOut,
          nights: dates.nights
        });

        // Update session storage
        planData.selectedCheckIn = dates.checkIn;
        planData.selectedCheckOut = dates.checkOut;
        planData.nights = dates.nights;
        sessionStorage.setItem('vida_vacation_plan', JSON.stringify(planData));

        continueBtn.disabled = false;

        // Track enrollment initiated
        analytics.trackEnrollmentInitiated(planData);
      } else {
        continueBtn.disabled = true;
      }
    };

    checkinInput.addEventListener('change', validateDates);
    checkoutInput.addEventListener('change', validateDates);
  }
}

// Initialize app
const app = new VacationSimulatorApp();

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    app.init();
  });
}

export default app;

