/**
 * VIDA Travel - Cloud Functions
 * Main entry point for all Cloud Functions
 */

import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions/v2";

// Initialize Firebase Admin
admin.initializeApp();

// Set global options
setGlobalOptions({
  maxInstances: 10,
  region: "us-central1",
});

// Export individual functions
export { geminiChatAgent } from "./geminiChatAgent";
export { processActivationPayment } from "./processActivationPayment";
export { metaConversionAPI } from "./metaConversionAPI";
export { exportToBigQuery } from "./bigqueryExport";

// Export RAG context function
export { getRagContext } from "./ragContext";

// Export OTP verification functions
export { sendVerificationOTP } from "./sendVerificationOTP";
export { verifyOTP } from "./verifyOTP";

