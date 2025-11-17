// Floating Chat Widget Component
// Bilingual support with modal interface

class ChatWidget {
  constructor() {
    this.isOpen = false;
    this.conversationHistory = [];
    this.lang = window.i18n?.getLanguage() || 'es-MX';
    this.sessionId = this.getSessionId();
    
    this.init();
  }
  
  init() {
    this.createWidget();
    this.attachEventListeners();
    
    // Listen for language changes
    window.addEventListener('languageChanged', () => {
      this.lang = window.i18n?.getLanguage() || 'es-MX';
      this.updateWidgetText();
    });
  }
  
  createWidget() {
    // Create floating button
    const widgetButton = document.createElement('div');
    widgetButton.id = 'chat-widget-button';
    widgetButton.className = 'chat-widget-button';
    widgetButton.innerHTML = `
      <span class="chat-widget-icon">💬</span>
      <span class="chat-widget-text" data-i18n="chat.widget.button">Chatea con nosotros</span>
    `;
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'chat-widget-modal';
    modal.className = 'chat-widget-modal';
    modal.innerHTML = `
      <div class="chat-widget-header">
        <h3 data-i18n="chat.title">Chatea con Nuestro Asistente de Viajes</h3>
        <button class="chat-widget-close" aria-label="Close">×</button>
      </div>
      <div class="chat-widget-messages" id="chat-widget-messages"></div>
      <div class="chat-widget-input-container">
        <input type="text" 
               id="chat-widget-input" 
               class="chat-widget-input"
               data-i18n="chat.placeholder"
               placeholder="Pregúntame sobre planificación de vacaciones...">
        <button id="chat-widget-send" class="chat-widget-send" data-i18n="chat.send">Enviar</button>
      </div>
    `;
    
    document.body.appendChild(widgetButton);
    document.body.appendChild(modal);
    
    // Apply translations
    if (window.i18n) {
      window.i18n.applyTranslations();
    }
    
    // Show welcome message
    this.showWelcomeMessage();
  }
  
  attachEventListeners() {
    const button = document.getElementById('chat-widget-button');
    const modal = document.getElementById('chat-widget-modal');
    const closeBtn = modal?.querySelector('.chat-widget-close');
    const sendBtn = document.getElementById('chat-widget-send');
    const input = document.getElementById('chat-widget-input');
    
    // Toggle modal
    button?.addEventListener('click', () => {
      this.toggle();
    });
    
    // Close button
    closeBtn?.addEventListener('click', () => {
      this.close();
    });
    
    // Click outside to close
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.close();
      }
    });
    
    // Send message
    sendBtn?.addEventListener('click', () => {
      this.sendMessage();
    });
    
    // Enter key to send
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }
  
  toggle() {
    this.isOpen = !this.isOpen;
    const modal = document.getElementById('chat-widget-modal');
    
    if (this.isOpen) {
      modal?.classList.add('open');
      document.getElementById('chat-widget-input')?.focus();
      
      // Track chat opened
      if (window.trackEvent) {
        trackEvent('chat_opened', {
          source: 'widget',
          language: this.lang
        });
      }
    } else {
      modal?.classList.remove('open');
    }
  }
  
  close() {
    this.isOpen = false;
    document.getElementById('chat-widget-modal')?.classList.remove('open');
  }
  
  showWelcomeMessage() {
    const welcomeMsg = window.i18n?.t('chat.welcome') || 
                      '¡Hola! Estoy aquí para ayudarte a planear tus vacaciones con el programa 0% interés de VIDA';
    this.addMessage('assistant', welcomeMsg);
  }
  
  async sendMessage() {
    const input = document.getElementById('chat-widget-input');
    const message = input?.value.trim();
    
    if (!message) return;
    
    // Add user message
    this.addMessage('user', message);
    input.value = '';
    
    // Track message sent
    if (window.trackEvent) {
      trackEvent('chat_message_sent', {
        language: this.lang,
        source: 'widget'
      });
    }
    
    // Show loading
    const loadingId = this.addMessage('assistant', '...', true);
    
    try {
      // Call chat agent
      const FUNCTIONS_BASE_URL = 'https://us-central1-vida-travel-vacation-credit.cloudfunctions.net';
      const response = await fetch(`${FUNCTIONS_BASE_URL}/chatAgent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          conversationHistory: this.conversationHistory,
          userId: this.getUserId(),
          sessionId: this.sessionId,
          language: this.lang
        })
      });
      
      const data = await response.json();
      
      // Remove loading message
      const loadingMsg = document.getElementById(loadingId);
      if (loadingMsg) {
        loadingMsg.remove();
      }
      
      if (data.success) {
        this.addMessage('assistant', data.message);
        this.conversationHistory.push(
          { role: 'user', content: message },
          { role: 'assistant', content: data.message }
        );
      } else {
        this.addMessage('assistant', 
          this.lang === 'es-MX' 
            ? 'Lo siento, encontré un error. Por favor intenta de nuevo.'
            : 'I apologize, but I encountered an error. Please try again.');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const loadingMsg = document.getElementById(loadingId);
      if (loadingMsg) {
        loadingMsg.remove();
      }
      this.addMessage('assistant',
        this.lang === 'es-MX'
          ? 'Lo siento, encontré un error. Por favor intenta de nuevo.'
          : 'I apologize, but I encountered an error. Please try again.');
    }
  }
  
  addMessage(role, content, isLoading = false) {
    const messagesContainer = document.getElementById('chat-widget-messages');
    if (!messagesContainer) return;
    
    const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const messageDiv = document.createElement('div');
    messageDiv.id = messageId;
    messageDiv.className = `chat-widget-message chat-widget-message-${role}`;
    
    if (isLoading) {
      messageDiv.innerHTML = '<div class="chat-loading">...</div>';
    } else {
      messageDiv.textContent = content;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageId;
  }
  
  updateWidgetText() {
    // Update widget text when language changes
    if (window.i18n) {
      window.i18n.applyTranslations();
    }
  }
  
  getSessionId() {
    let sessionId = sessionStorage.getItem('vida_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('vida_session_id', sessionId);
    }
    return sessionId;
  }
  
  getUserId() {
    if (window.firebaseAuth && window.firebaseAuth.currentUser) {
      return window.firebaseAuth.currentUser.uid;
    }
    return this.sessionId;
  }
}

// Initialize widget when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.chatWidget = new ChatWidget();
  });
} else {
  window.chatWidget = new ChatWidget();
}

// Export for global use
window.ChatWidget = ChatWidget;

