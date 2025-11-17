// Destination Selector Component - Dual Mode (Dropdown + Visual Cards)
// Booking.com-style interface

class DestinationSelector {
  constructor(containerId, onSelectCallback) {
    this.container = document.getElementById(containerId);
    this.onSelectCallback = onSelectCallback;
    this.selectedDestination = null;
    this.mode = 'cards'; // 'dropdown' or 'cards'
    
    this.destinations = [
      { id: 'cancun', name: { 'es-MX': 'Cancún', 'en-US': 'Cancun' }, priceRange: { min: 20000, max: 25000 } },
      { id: 'puerto-vallarta', name: { 'es-MX': 'Puerto Vallarta', 'en-US': 'Puerto Vallarta' }, priceRange: { min: 15000, max: 20000 } },
      { id: 'los-cabos', name: { 'es-MX': 'Los Cabos', 'en-US': 'Los Cabos' }, priceRange: { min: 20000, max: 25000 } },
      { id: 'ciudad-de-mexico', name: { 'es-MX': 'Ciudad de México', 'en-US': 'Mexico City' }, priceRange: { min: 10000, max: 15000 } },
      { id: 'oaxaca', name: { 'es-MX': 'Oaxaca', 'en-US': 'Oaxaca' }, priceRange: { min: 10000, max: 15000 } },
      { id: 'chiapas', name: { 'es-MX': 'Chiapas', 'en-US': 'Chiapas' }, priceRange: { min: 15000, max: 20000 } }
    ];
    
    this.init();
  }
  
  init() {
    this.render();
    this.attachEventListeners();
    
    // Listen for language changes
    window.addEventListener('languageChanged', () => {
      this.render();
    });
  }
  
  render() {
    const lang = window.i18n?.getLanguage() || 'es-MX';
    
    // Render only cards mode for the new design
    this.container.innerHTML = `
      ${this.destinations.map(dest => `
        <div class="destination-card ${this.selectedDestination === dest.id ? 'selected' : ''}" 
             data-destination="${dest.id}">
          <div class="destination-card-image">
            <img src="/images/destinations/${dest.id}.jpg" 
                 alt="${dest.name[lang]}" 
                 onerror="this.src='/images/destinations/placeholder.jpg'">
          </div>
          <div class="destination-card-content">
            <h3 class="destination-card-name">${dest.name[lang]}</h3>
            <p class="destination-card-price">
              $${dest.priceRange.min.toLocaleString()} - $${dest.priceRange.max.toLocaleString()} MXN
            </p>
          </div>
          ${this.selectedDestination === dest.id ? '<div class="destination-card-check">✓</div>' : ''}
        </div>
      `).join('')}
    `;
    
    // Re-apply translations
    if (window.i18n) {
      window.i18n.applyTranslations();
    }
  }
  
  attachEventListeners() {
    // Use event delegation for card selection
    this.container.addEventListener('click', (e) => {
      const card = e.target.closest('.destination-card');
      if (card) {
        const destId = card.getAttribute('data-destination');
        if (destId) {
          this.selectDestination(destId);
        }
        return;
      }
    });
  }
  
  selectDestination(destId) {
    this.selectedDestination = destId;
    this.render();
    this.attachEventListeners();
    
    // Track analytics
    if (window.trackEvent) {
      trackEvent('destination_selected', {
        destination: destId,
        mode: this.mode,
        language: window.i18n?.getLanguage() || 'es-MX'
      });
    }
    
    // Callback
    if (this.onSelectCallback) {
      this.onSelectCallback(destId);
    }
  }
  
  getSelectedDestination() {
    return this.selectedDestination;
  }
  
  getDestinationData(destId) {
    return this.destinations.find(d => d.id === destId);
  }
}

// Export for global use
window.DestinationSelector = DestinationSelector;

