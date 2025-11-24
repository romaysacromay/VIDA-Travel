/**
 * VIDA Travel - Activation Payment Processor
 * Handles enrollment fee payment processing (PRIMARY CONVERSION)
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

export const processActivationPayment = onCall(async (request) => {
  try {
    const { formData, planData, amount, eventId } = request.data;

    // Validate required fields
    if (!formData || !planData || !amount) {
      throw new HttpsError("invalid-argument", "Missing required payment data");
    }

    if (amount !== 500) {
      throw new HttpsError(
        "invalid-argument",
        "Invalid enrollment fee amount"
      );
    }

    // Validate form data
    const requiredFields = [
      "cardholderName",
      "email",
      "phone",
      "cardNumber",
      "expiryDate",
      "cvv",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        throw new HttpsError(
          "invalid-argument",
          `Missing required field: ${field}`
        );
      }
    }

    // TODO: In production, integrate with payment gateway (Stripe, Conekta, etc.)
    // For now, simulate payment processing
    const paymentResult = await simulatePaymentProcessing(formData, amount);

    if (!paymentResult.success) {
      throw new HttpsError(
        "failed-precondition",
        paymentResult.error || "Payment processing failed"
      );
    }

    // Generate transaction ID
    const transactionId = `VIDA_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Store payment record in Firestore
    const paymentDoc = await admin
      .firestore()
      .collection("activation_payments")
      .add({
        transaction_id: transactionId,
        session_id: planData.session_id || "unknown",
        variant_id: planData.variant_id || "unknown",
        amount,
        currency: "MXN",
        status: "completed",
        payment_method: "card",
        cardholder_name: formData.cardholderName,
        email: formData.email,
        phone: formData.phone,
        card_last4: formData.cardNumber.slice(-4),
        // Plan details
        destination: planData.destination,
        package_price: planData.packagePrice,
        adults: planData.adults,
        children: planData.children,
        savings_weeks: planData.savingsWeeks,
        earliest_checkin: planData.earliestCheckIn,
        // Metadata
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        meta_pixel_event_id: eventId,
        exported: false,
      });

    console.log(`✅ Payment processed: ${transactionId}`);

    // Send confirmation email (in production)
    // await sendConfirmationEmail(formData.email, planData, transactionId);

    return {
      success: true,
      transactionId,
      paymentId: paymentDoc.id,
      message: "Payment processed successfully",
    };
  } catch (error: any) {
    console.error("❌ Payment processing error:", error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError(
      "internal",
      "Payment processing failed",
      error.message
    );
  }
});

/**
 * Simulate payment processing
 * In production, replace with actual payment gateway integration
 */
async function simulatePaymentProcessing(
  formData: any,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate card validation
  const cardNumber = formData.cardNumber.replace(/\s/g, "");

  // Simple Luhn check
  if (!validateLuhn(cardNumber)) {
    return { success: false, error: "Invalid card number" };
  }

  // Simulate occasional payment failures (5% failure rate for testing)
  if (Math.random() < 0.05) {
    return { success: false, error: "Payment declined by bank" };
  }

  // Success
  return { success: true };
}

/**
 * Validate card number using Luhn algorithm
 */
function validateLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");

  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

