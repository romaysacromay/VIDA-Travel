/**
 * VIDA Travel - Send OTP Verification Email via Resend
 */

import { onRequest } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const sendVerificationOTP = onRequest(async (request, response) => {
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

    const { email, name, language } = request.body;
    const lang = language || 'es'; // Default to Spanish

    // Validate email with better error messages
    if (!email) {
      response.status(400).json({ 
        success: false,
        error: "Email es requerido" 
      });
      return;
    }

    const emailTrimmed = email.trim().toLowerCase();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      response.status(400).json({ 
        success: false,
        error: "Formato de email inválido. Por favor verifica tu dirección de email." 
      });
      return;
    }

    // Check for common email issues
    if (emailTrimmed.length > 254) {
      response.status(400).json({ 
        success: false,
        error: "Email demasiado largo" 
      });
      return;
    }

    // Get Resend API key
    const resendApiKey =
      process.env.RESEND_API_KEY ||
      functions.config().resend?.api_key;

    if (!resendApiKey) {
      console.error("❌ Resend API key not configured");
      response.status(500).json({ error: "Email service not configured" });
      return;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Firestore (expires in 10 minutes)
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin
      .firestore()
      .collection("otp_codes")
      .doc(emailTrimmed)
      .set({
        otp,
        email: emailTrimmed,
        name: (name || "Usuario").trim(),
        expiresAt,
        verified: false,
        attempts: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    // Send email via Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "VIDA Travel <noreply@romay.tech>", // Using verified romay.tech domain
        to: [emailTrimmed],
        subject: lang === 'es' ? "Tu código de verificación - VIDA Travel" : "Your verification code - VIDA Travel",
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código de Verificación</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #006B5E 0%, #008C7A 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
                VIDA Travel
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">
                ${lang === 'es' ? 'Crédito Vacacional Sin Intereses' : 'Interest-Free Vacation Credit'}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">
                ${lang === 'es' ? 'Verifica tu email' : 'Verify your email'}
              </h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                ${lang === 'es' ? 'Hola' : 'Hello'}${name ? ` <strong>${name}</strong>` : ""},
              </p>

              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                ${lang === 'es' ? 
                  'Para activar tu crédito vacacional, ingresa el siguiente código de verificación:' : 
                  'To activate your vacation credit, enter the following verification code:'}
              </p>

              <!-- OTP Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 30px 0;">
                    <div style="background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%); border: 2px dashed #006B5E; border-radius: 12px; padding: 24px; display: inline-block;">
                      <div style="font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #006B5E; font-family: 'Courier New', monospace;">
                        ${otp}
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="color: #999; font-size: 14px; text-align: center; margin: 20px 0 30px 0;">
                ${lang === 'es' ? 
                  'Este código expira en <strong>10 minutos</strong>' : 
                  'This code expires in <strong>10 minutes</strong>'}
              </p>

              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 30px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  ${lang === 'es' ? 
                    '<strong>⚠️ Seguridad:</strong> Si no solicitaste este código, ignora este email. Tu cuenta está segura.' : 
                    '<strong>⚠️ Security:</strong> If you didn\'t request this code, ignore this email. Your account is safe.'}
                </p>
              </div>

              <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                ${lang === 'es' ? 
                  '¿Tienes preguntas? Contáctanos en <a href="mailto:soporte@vidatravel.com" style="color: #006B5E; text-decoration: none;">soporte@vidatravel.com</a>' : 
                  'Questions? Contact us at <a href="mailto:soporte@vidatravel.com" style="color: #006B5E; text-decoration: none;">soporte@vidatravel.com</a>'}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                ${lang === 'es' ? 'VIDA Travel - Crédito Vacacional' : 'VIDA Travel - Vacation Credit'}
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                ${lang === 'es' ? 
                  '© 2025 VIDA Travel. Todos los derechos reservados.' : 
                  '© 2025 VIDA Travel. All rights reserved.'}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error("❌ Resend API error:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const emailResult = await emailResponse.json();

    console.log("✅ OTP sent successfully to:", emailTrimmed);

    response.json({
      success: true,
      message: "OTP sent successfully",
      emailId: emailResult.id,
    });
  } catch (error: any) {
    console.error("❌ Error sending OTP:", error);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Error details:", {
      message: error.message,
      name: error.name,
      code: error.code
    });
    
    // Provide more specific error messages
    let errorMessage = "Failed to send OTP";
    let statusCode = 500;
    
    if (error.message?.includes("Resend API")) {
      errorMessage = "Error del servicio de email. Intenta de nuevo en unos momentos.";
    } else if (error.message?.includes("Invalid email")) {
      errorMessage = "Email inválido. Por favor verifica tu dirección de email.";
      statusCode = 400;
    } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
      errorMessage = "Error de conexión. Verifica tu internet e intenta de nuevo.";
    } else {
      errorMessage = error.message || "Error al enviar código. Intenta de nuevo.";
    }
    
    response.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

