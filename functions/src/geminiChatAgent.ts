/**
 * VIDA Travel - Gemini Chat Agent Cloud Function
 * RAG-powered AI assistant for customer support
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRagContext } from "./ragContext";
import * as admin from "firebase-admin";

export const geminiChatAgent = onCall(async (request) => {
  try {
    const { message, history = [], sessionContext = {} } = request.data;

    if (!message || typeof message !== "string") {
      throw new HttpsError("invalid-argument", "Message is required");
    }

    // Get Gemini API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY not configured");
      throw new HttpsError(
        "failed-precondition",
        "AI service not configured"
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build system prompt with RAG context
    const ragContext = getRagContext();
    const systemPrompt = `
${ragContext}

## Current User Context:
${sessionContext.destination ? `- Selected destination: ${sessionContext.destination}` : "- No destination selected yet"}
${sessionContext.packagePrice ? `- Package price: $${sessionContext.packagePrice.toLocaleString()} MXN` : ""}
${sessionContext.savingsWeeks ? `- Savings period: ${sessionContext.savingsWeeks} weeks` : ""}
${sessionContext.earliestCheckIn ? `- Earliest check-in: ${sessionContext.earliestCheckIn}` : ""}

## Instructions:
- Respond in Spanish by default (user can request English)
- Be warm, helpful, and encouraging
- Use the user's context to provide personalized answers
- If you don't know something, be honest and suggest contacting support
- Keep responses concise but complete (2-4 sentences usually)
`;

    // Convert history to Gemini format
    const geminiHistory = history.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Start chat with history
    const chat = model.startChat({
      history: geminiHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    // Send message with system prompt prepended to first message
    const promptMessage =
      history.length === 0
        ? `${systemPrompt}\n\nUser: ${message}`
        : message;
    const result = await chat.sendMessage(promptMessage);
    const response = result.response.text();

    // Log conversation to Firestore
    try {
      await admin.firestore().collection("chat_logs").add({
        session_id: sessionContext.session_id || "unknown",
        user_message: message,
        ai_response: response,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        context: sessionContext,
      });
    } catch (logError) {
      console.error("Failed to log chat:", logError);
      // Don't fail the request if logging fails
    }

    return { response };
  } catch (error: any) {
    console.error("❌ Gemini Chat Agent error:", error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError(
      "internal",
      "Failed to process chat message",
      error.message
    );
  }
});

