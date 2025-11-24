/**
 * VIDA Travel - Chat Widget Module
 * Gemini-powered AI chat assistant
 */

import { analytics } from './analytics.js';
import { utmTracker } from './utm-tracker.js';

export class ChatWidget {
  constructor() {
    this.isOpen = false;
    this.chatContainer = null;
    this.toggleButton = null;
    this.messagesContainer = null;
    this.inputField = null;
    this.sendButton = null;
    this.chatHistory = [];
  }

  /**
   * Initialize chat widget
   */
  init() {
    this.toggleButton = document.getElementById('chat-toggle');
    
    if (!this.toggleButton) {
      console.warn('⚠️ Chat toggle button not found');
      return;
    }

    // Create chat interface
    this.createChatInterface();

    // Setup event listeners
    this.toggleButton.addEventListener('click', () => this.toggle());

    console.log('✅ Chat widget initialized');
  }

  /**
   * Create chat interface
   */
  createChatInterface() {
    // Create chat container
    this.chatContainer = document.createElement('div');
    this.chatContainer.id = 'chat-container';
    this.chatContainer.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 380px;
      max-width: calc(100vw - 48px);
      height: 500px;
      max-height: calc(100vh - 150px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 78, 80, 0.15);
      display: none;
      flex-direction: column;
      z-index: 999;
      overflow: hidden;
    `;

    // Chat header
    const header = document.createElement('div');
    header.style.cssText = `
      background: var(--vida-gradient-teal-gold);
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    header.innerHTML = `
      <div>
        <strong style="font-size: 1.125rem;">Asistente VIDA</strong>
        <div style="font-size: 0.875rem; opacity: 0.9;">Estoy aquí para ayudarte</div>
      </div>
      <button id="chat-close" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; transition: background 0.2s;" aria-label="Cerrar chat">×</button>
    `;

    // Messages container
    this.messagesContainer = document.createElement('div');
    this.messagesContainer.id = 'chat-messages';
    this.messagesContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: var(--vida-off-white);
    `;

    // Welcome message
    this.addBotMessage('¡Hola! 👋 Soy tu asistente virtual de VIDA. ¿En qué puedo ayudarte hoy?');

    // Quick replies
    const quickReplies = document.createElement('div');
    quickReplies.style.cssText = `
      padding: 12px 16px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      border-top: 1px solid #E5E7EB;
    `;
    
    const quickReplyButtons = [
      '¿Cómo funciona el crédito?',
      '¿Cuándo puedo viajar?',
      '¿Hay cargos ocultos?'
    ];

    quickReplyButtons.forEach(text => {
      const btn = document.createElement('button');
      btn.textContent = text;
      btn.style.cssText = `
        background: white;
        border: 1px solid var(--vida-light-teal);
        color: var(--vida-deep-teal);
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;
      `;
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'var(--vida-light-teal)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'white';
      });
      btn.addEventListener('click', () => {
        this.sendMessage(text);
        quickReplies.style.display = 'none';
      });
      quickReplies.appendChild(btn);
    });

    // Input container
    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
      padding: 16px;
      border-top: 1px solid #E5E7EB;
      display: flex;
      gap: 8px;
      background: white;
    `;

    this.inputField = document.createElement('input');
    this.inputField.type = 'text';
    this.inputField.placeholder = 'Escribe tu pregunta...';
    this.inputField.style.cssText = `
      flex: 1;
      padding: 12px;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      font-size: 1rem;
      outline: none;
    `;
    this.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage(this.inputField.value);
      }
    });

    this.sendButton = document.createElement('button');
    this.sendButton.innerHTML = '→';
    this.sendButton.style.cssText = `
      background: var(--vida-deep-teal);
      color: white;
      border: none;
      border-radius: 8px;
      width: 44px;
      height: 44px;
      font-size: 1.5rem;
      cursor: pointer;
      transition: background 0.2s;
    `;
    this.sendButton.addEventListener('click', () => {
      this.sendMessage(this.inputField.value);
    });

    inputContainer.appendChild(this.inputField);
    inputContainer.appendChild(this.sendButton);

    // Assemble chat container
    this.chatContainer.appendChild(header);
    this.chatContainer.appendChild(this.messagesContainer);
    this.chatContainer.appendChild(quickReplies);
    this.chatContainer.appendChild(inputContainer);

    document.body.appendChild(this.chatContainer);

    // Close button handler
    document.getElementById('chat-close').addEventListener('click', () => this.close());
  }

  /**
   * Toggle chat visibility
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open chat
   */
  open() {
    this.isOpen = true;
    this.chatContainer.style.display = 'flex';
    this.toggleButton.style.display = 'none';
    this.inputField.focus();

    // Track chat opened
    analytics.trackChatOpened();
  }

  /**
   * Close chat
   */
  close() {
    this.isOpen = false;
    this.chatContainer.style.display = 'none';
    this.toggleButton.style.display = 'flex';
  }

  /**
   * Send message
   */
  async sendMessage(text) {
    if (!text || !text.trim()) return;

    const message = text.trim();
    this.inputField.value = '';

    // Add user message to UI
    this.addUserMessage(message);

    // Track chat message
    analytics.trackChatMessage(message.length);

    // Show typing indicator
    const typingIndicator = this.addTypingIndicator();

    try {
      // Get response from Gemini (via Cloud Function)
      const response = await this.getAIResponse(message);

      // Remove typing indicator
      typingIndicator.remove();

      // Add bot response
      this.addBotMessage(response);

      // Store in history
      this.chatHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: response }
      );

    } catch (error) {
      console.error('❌ Chat error:', error);
      typingIndicator.remove();
      this.addBotMessage('Lo siento, tuve un problema al procesar tu mensaje. ¿Puedes intentar de nuevo?');
    }
  }

  /**
   * Add user message to chat
   */
  addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      align-self: flex-end;
      background: var(--vida-deep-teal);
      color: white;
      padding: 12px;
      border-radius: 12px 12px 0 12px;
      max-width: 75%;
      word-wrap: break-word;
    `;
    messageDiv.textContent = text;
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  /**
   * Add bot message to chat
   */
  addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      align-self: flex-start;
      background: white;
      color: var(--vida-charcoal);
      padding: 12px;
      border-radius: 12px 12px 12px 0;
      max-width: 75%;
      word-wrap: break-word;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    `;
    messageDiv.textContent = text;
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
  }

  /**
   * Add typing indicator
   */
  addTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      align-self: flex-start;
      background: white;
      padding: 12px;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    `;
    indicator.innerHTML = `
      <div style="display: flex; gap: 4px;">
        <div style="width: 8px; height: 8px; background: var(--vida-light-teal); border-radius: 50%; animation: bounce 0.6s infinite alternate;"></div>
        <div style="width: 8px; height: 8px; background: var(--vida-light-teal); border-radius: 50%; animation: bounce 0.6s 0.2s infinite alternate;"></div>
        <div style="width: 8px; height: 8px; background: var(--vida-light-teal); border-radius: 50%; animation: bounce 0.6s 0.4s infinite alternate;"></div>
      </div>
    `;
    
    // Add bounce animation if not exists
    if (!document.getElementById('chat-animations')) {
      const style = document.createElement('style');
      style.id = 'chat-animations';
      style.textContent = `
        @keyframes bounce {
          to { transform: translateY(-4px); opacity: 0.6; }
        }
      `;
      document.head.appendChild(style);
    }

    this.messagesContainer.appendChild(indicator);
    this.scrollToBottom();
    return indicator;
  }

  /**
   * Scroll messages to bottom
   */
  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  /**
   * Get AI response from Gemini (via Cloud Function)
   */
  async getAIResponse(userMessage) {
    // Get session context
    const sessionContext = this.getSessionContext();

    // In production, call Cloud Function
    // For now, return simulated responses
    return this.getSimulatedResponse(userMessage);

    /* Production code:
    try {
      const response = await fetch('/api/geminiChatAgent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          history: this.chatHistory,
          sessionContext
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      throw error;
    }
    */
  }

  /**
   * Get session context for AI
   */
  getSessionContext() {
    try {
      const planData = sessionStorage.getItem('vida_vacation_plan');
      return planData ? JSON.parse(planData) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Simulated responses (placeholder)
   */
  getSimulatedResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('crédito') || lowerMessage.includes('préstamo') || lowerMessage.includes('interés')) {
      return 'El crédito VIDA es 100% sin intereses. Nosotros cubrimos hasta el 20% del costo de tu viaje y lo pagas en 12 meses sin cargos adicionales. Es completamente transparente.';
    }

    if (lowerMessage.includes('viajar') || lowerMessage.includes('fecha') || lowerMessage.includes('cuándo')) {
      return 'Puedes viajar a partir de la fecha que calculamos en el simulador. Esta fecha se basa en cuánto tiempo necesitas para ahorrar el 80% del costo del viaje. Una vez que alcances esa fecha, puedes seleccionar tu check-in.';
    }

    if (lowerMessage.includes('cargo') || lowerMessage.includes('oculto') || lowerMessage.includes('costo')) {
      return 'No hay cargos ocultos. Solo pagas $500 MXN de inscripción para activar tu plan. El resto es tu ahorro semanal y el reembolso del crédito sin intereses. Todo está claramente explicado en el simulador.';
    }

    if (lowerMessage.includes('pago') || lowerMessage.includes('mensual') || lowerMessage.includes('semanal')) {
      return 'Tu plan de pagos incluye depósitos semanales que tú decides y el pago mensual del crédito. El total mensual nunca excede el 15% de tu salario para proteger tu economía familiar.';
    }

    if (lowerMessage.includes('destino') || lowerMessage.includes('cancún') || lowerMessage.includes('playa')) {
      return 'Ofrecemos 6 increíbles destinos en México: Cancún, Playa del Carmen, Tulum, Cabo San Lucas, Puerto Vallarta y Ciudad de México. Cada uno con experiencias únicas y paquetes personalizados.';
    }

    // Default response
    return 'Entiendo tu pregunta. Te recomiendo completar el simulador para ver cómo funciona tu plan personalizado. Si tienes dudas específicas, puedo ayudarte con información sobre créditos, fechas de viaje, costos o destinos. ¿Sobre qué te gustaría saber más?';
  }
}

// Initialize and export singleton
export const chatWidget = new ChatWidget();

// Auto-initialize on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    chatWidget.init();
  });
}

export default chatWidget;

