import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {onRequest} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2";
import {getPricingConfig, getDestinationPrice} from "./pricingEngine";
import {getRagContext} from "./ragContext";

// Initialize Firebase Admin
admin.initializeApp();

// Set global options for Cloud Functions
setGlobalOptions({
  maxInstances: 10,
  region: "us-central1",
});

// Enhanced Vacation Credit Simulator Function
export const simulateVacationCredit = onRequest(
  {
    cors: true,
    maxInstances: 10,
  },
  async (request, response) => {
    try {
      const {
        destination,
        checkIn,
        checkOut,
        adults,
        children,
        monthlySalary,
        weeklyDeposit,
        language = "es-MX",
        userId,
        sessionId,
        experimentVariantId,
      } = request.body;

      // Validate required fields
      if (!destination || !checkIn || !checkOut || !adults || children === undefined || 
          !monthlySalary || !weeklyDeposit) {
        const errorMsg = language === "es-MX" 
          ? "Faltan campos requeridos"
          : "Missing required fields";
        response.status(400).json({
          error: errorMsg,
        });
        return;
      }

      // Validate adults (max 2)
      if (adults < 1 || adults > 2) {
        const errorMsg = language === "es-MX"
          ? "Debe haber entre 1 y 2 adultos"
          : "Must have between 1 and 2 adults";
        response.status(400).json({
          error: errorMsg,
        });
        return;
      }

      // Get pricing config
      const pricingConfig = await getPricingConfig();
      
      // Calculate destination price (with seasonal adjustment)
      const adultPrice = getDestinationPrice(pricingConfig, destination, checkIn);
      
      // Calculate total package price
      const childrenPrice = adultPrice * pricingConfig.childrenDiscount;
      const totalPrice = (adults * adultPrice) + (children * childrenPrice);
      
      // Calculate 80% savings target
      const savingsTarget = totalPrice * pricingConfig.savingsTargetPercentage;
      
      // Calculate weeks to save
      const weeksToSave = Math.ceil(savingsTarget / weeklyDeposit);
      
      // Calculate earliest start date (today + weeks to save)
      const today = new Date();
      const earliestStartDate = new Date(today);
      earliestStartDate.setDate(earliestStartDate.getDate() + (weeksToSave * 7));
      
      // Check if selected dates are viable
      const checkInDate = new Date(checkIn);
      const selectedDatesViable = checkInDate >= earliestStartDate;
      
      // Calculate guaranteed departure date
      const guaranteedDepartureDate = selectedDatesViable ? checkInDate : earliestStartDate;
      
      // Calculate 20% loan amount
      const loanAmount = totalPrice * pricingConfig.loanPercentage;
      
      // Calculate maximum monthly payment (15% of salary)
      const maxMonthlyPayment = monthlySalary * pricingConfig.maxMonthlyPaymentPercentage;
      
      // Calculate minimum months needed
      const minMonthsNeeded = Math.ceil(loanAmount / maxMonthlyPayment);
      
      // Set loan term between 6 and 12 months
      const loanTerm = Math.max(
        pricingConfig.loanTermRange.min,
        Math.min(pricingConfig.loanTermRange.max, minMonthsNeeded)
      );
      
      // Actual monthly payment
      const monthlyPayment = loanAmount / loanTerm;
      const paymentPercentage = (monthlyPayment / monthlySalary) * 100;
      
      // Check if feasible
      const isFeasible = monthlyPayment <= maxMonthlyPayment;
      
      // Prepare messages based on language
      const messages: Record<string, {datesViable: string; datesNotViable: string; suggestIncreaseDeposit: string}> = {
        "es-MX": {
          datesViable: "Tus fechas seleccionadas son viables",
          datesNotViable: "Tus fechas seleccionadas no son viables. Fecha garantizada:",
          suggestIncreaseDeposit: "Sugerencia: Aumenta tu depósito semanal o elige un destino más económico"
        },
        "en-US": {
          datesViable: "Your selected dates are viable",
          datesNotViable: "Your selected dates are not viable. Guaranteed date:",
          suggestIncreaseDeposit: "Suggestion: Increase your weekly deposit or choose a cheaper destination"
        }
      };

      const simulationResult = {
        destination,
        checkIn,
        checkOut,
        adults,
        children,
        monthlySalary,
        weeklyDeposit,
        totalPrice,
        savingsTarget,
        weeksToSave,
        loanAmount,
        loanTerm,
        monthlyPayment,
        paymentPercentage,
        maxMonthlyPayment,
        isFeasible,
        guaranteedDepartureDate: guaranteedDepartureDate.toISOString(),
        selectedDatesViable,
        language,
        messages: messages[language] || messages["es-MX"],
        experimentVariantId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Store simulation result in Firestore
      if (userId && sessionId) {
        await admin.firestore()
          .collection("simulatorSessions")
          .doc(sessionId)
          .set({
            ...simulationResult,
            userId,
            sessionId,
          });
      }

      // Log analytics event
      await admin.firestore()
        .collection("analyticsEvents")
        .add({
          eventName: "simulation_completed",
          userId,
          sessionId,
          experimentVariantId,
          language,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          simulationResult: {
            destination,
            totalPrice,
            loanTerm,
            paymentPercentage,
            selectedDatesViable
          },
        });

      response.json({
        success: true,
        simulation: simulationResult,
      });
    } catch (error) {
      console.error("Error in simulateVacationCredit:", error);
      response.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Enhanced Gemini LLM Chat Agent Function with RAG Context
export const chatAgent = onRequest(
  {
    cors: true,
    maxInstances: 10,
  },
  async (request, response) => {
    try {
      const {message, conversationHistory, userId, sessionId, language = "es-MX"} = request.body;

      if (!message) {
        const errorMsg = language === "es-MX"
          ? "El mensaje es requerido"
          : "Message is required";
        response.status(400).json({
          error: errorMsg,
        });
        return;
      }

      // Get Gemini API key from environment
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (!geminiApiKey) {
        response.status(500).json({
          error: "Gemini API key not configured",
        });
        return;
      }

      // Load RAG context
      const ragContext = await getRagContext(language);

      // Prepare system prompt with RAG context
      const systemPrompt = language === "es-MX"
        ? `Eres un asistente de viajes útil para el programa de crédito de vacaciones de VIDA Travel. 
        Responde SIEMPRE en español (es-MX). Sé amigable, informativo y alentador.
        
        CONTEXTO DE VIDA TRAVEL:
        ${ragContext}
        
        Instrucciones:
        - Responde todas las preguntas basándote en el contexto proporcionado
        - Explica el programa de crédito sin intereses (0%)
        - Ayuda a los usuarios a entender cómo funciona el simulador
        - Proporciona información sobre destinos mexicanos
        - Explica la regla del 15% del salario
        - Sé claro sobre los términos del préstamo (6-12 meses)
        - Si no sabes algo, admítelo y ofrece ayudar de otra manera`
        : `You are a helpful travel assistant for VIDA Travel's vacation credit program.
        Always respond in English (en-US). Be friendly, informative, and encouraging.
        
        VIDA TRAVEL CONTEXT:
        ${ragContext}
        
        Instructions:
        - Answer all questions based on the provided context
        - Explain the interest-free (0%) credit program
        - Help users understand how the simulator works
        - Provide information about Mexican destinations
        - Explain the 15% salary rule
        - Be clear about loan terms (6-12 months)
        - If you don't know something, admit it and offer to help in another way`;

      const messages = [
        {role: "user", parts: [{text: systemPrompt}]},
      ];

      // Add conversation history if provided
      if (conversationHistory && Array.isArray(conversationHistory)) {
        conversationHistory.forEach((msg: {role: string; content: string}) => {
          messages.push({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{text: msg.content}],
          });
        });
      }

      // Add current message
      messages.push({
        role: "user",
        parts: [{text: message}],
      });

      // Call Gemini API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`;

      const geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        throw new Error(`Gemini API error: ${errorText}`);
      }

      const geminiData = await geminiResponse.json();
      const assistantMessage = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 
        (language === "es-MX"
          ? "Lo siento, estoy teniendo problemas para procesar tu solicitud en este momento."
          : "I apologize, but I'm having trouble processing your request right now.");

      // Store conversation in Firestore
      if (userId && sessionId) {
        await admin.firestore()
          .collection("chatSessions")
          .doc(sessionId)
          .collection("messages")
          .add({
            userMessage: message,
            assistantMessage,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            userId,
            language,
            ragContextUsed: true,
          });
      }

      // Log analytics event
      await admin.firestore()
        .collection("analyticsEvents")
        .add({
          eventName: "chat_message_sent",
          userId,
          sessionId,
          language,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

      response.json({
        success: true,
        message: assistantMessage,
      });
    } catch (error) {
      console.error("Error in chatAgent:", error);
      response.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Scheduled function to export analytics to BigQuery (runs daily)
export const exportToBigQuery = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (_context) => {
    try {
      console.log("BigQuery export triggered at:", new Date().toISOString());
      return null;
    } catch (error) {
      console.error("Error in exportToBigQuery:", error);
      return null;
    }
  });
