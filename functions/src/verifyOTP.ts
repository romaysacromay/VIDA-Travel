/**
 * VIDA Travel - Verify OTP Code
 */

import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

export const verifyOTP = onRequest(async (request, response) => {
  // Enable CORS
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "POST");
  response.set("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  try {
    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    const { email, otp } = request.body;

    // Validate inputs
    if (!email || !otp) {
      response.status(400).json({
        verified: false,
        error: "Email and OTP are required",
      });
      return;
    }

    // Get stored OTP document
    const otpDoc = await admin
      .firestore()
      .collection("otp_codes")
      .doc(email)
      .get();

    if (!otpDoc.exists) {
      response.status(400).json({
        verified: false,
        error: "OTP not found or expired. Please request a new code.",
      });
      return;
    }

    const otpData = otpDoc.data()!;

    // Check if already verified
    if (otpData.verified) {
      response.json({
        verified: true,
        email: email,
        message: "Email already verified",
      });
      return;
    }

    // Check if expired
    if (Date.now() > otpData.expiresAt) {
      await otpDoc.ref.delete();
      response.status(400).json({
        verified: false,
        error: "OTP expired. Please request a new code.",
      });
      return;
    }

    // Check attempt limit (max 5 attempts)
    if (otpData.attempts >= 5) {
      await otpDoc.ref.delete();
      response.status(400).json({
        verified: false,
        error: "Too many failed attempts. Please request a new code.",
      });
      return;
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      // Increment attempts
      await otpDoc.ref.update({
        attempts: admin.firestore.FieldValue.increment(1),
      });

      const attemptsLeft = 5 - (otpData.attempts + 1);
      response.status(400).json({
        verified: false,
        error: `Invalid OTP. ${attemptsLeft} attempts remaining.`,
      });
      return;
    }

    // OTP is valid! Mark as verified
    await otpDoc.ref.update({
      verified: true,
      verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ OTP verified successfully for:", email);

    // Log verification event
    await admin.firestore().collection("user_verifications").add({
      email,
      verified: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ip: request.ip,
      userAgent: request.headers["user-agent"],
    });

    response.json({
      verified: true,
      email: email,
      message: "Email verified successfully",
    });
  } catch (error: any) {
    console.error("❌ Error verifying OTP:", error);
    response.status(500).json({
      verified: false,
      error: error.message || "Failed to verify OTP",
    });
  }
});

