# 🎯 VIDA Travel - Complete Conversion Flow Setup

## Your Conversion Funnel

```
Step 1: PageView
   ↓ (automatic on page load)

Step 2: ViewContent  
   ↓ (user clicks destination)

Step 3: AddToCart
   ↓ (user completes simulator)

Step 4: InitiateCheckout
   ↓ (user clicks CTA button - "Obtener mi crédito")

Step 5: AddPaymentInfo 
   ↓ (user enters email + confirms OTP) ← NEEDS SETUP

Step 6: Purchase ⭐
   ↓ (user clicks "Activar crédito ($500)") ← NEEDS CONNECTION
```

---

## 📧 Step 5: Email + OTP Verification (AddPaymentInfo Event)

### What Happens:
1. User enters their email address
2. System sends OTP code via Resend
3. User enters OTP to verify
4. ✅ **AddPaymentInfo event fires**
5. Shows "Activar crédito ($500)" button

### Files to Create/Modify:

#### 1. Email Verification Component (`/public/js/email-verification.js`)

```javascript
/**
 * Email Verification with OTP via Resend
 */
import { analytics } from './analytics.js';

export class EmailVerification {
  constructor() {
    this.email = null;
    this.verified = false;
    this.otpSent = false;
  }

  /**
   * Send OTP to email
   */
  async sendOTP(email) {
    try {
      const response = await fetch('https://us-central1-vida-travel-vacation-credit.cloudfunctions.net/sendVerificationOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      const result = await response.json();
      this.email = email;
      this.otpSent = true;
      
      console.log('✅ OTP sent to:', email);
      return result;
    } catch (error) {
      console.error('❌ Failed to send OTP:', error);
      throw error;
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(email, otpCode) {
    try {
      const response = await fetch('https://us-central1-vida-travel-vacation-credit.cloudfunctions.net/verifyOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode })
      });

      if (!response.ok) {
        throw new Error('Invalid OTP');
      }

      const result = await response.json();
      
      if (result.verified) {
        this.verified = true;
        this.email = email;
        
        // 🎯 FIRE AddPaymentInfo EVENT HERE
        const planData = this.getPlanData();
        if (planData) {
          analytics.trackPaymentInfoAdded({
            ...planData,
            email: email
          });
        }
        
        console.log('✅ Email verified, AddPaymentInfo event sent');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      throw error;
    }
  }

  getPlanData() {
    try {
      const planDataStr = sessionStorage.getItem('vida_vacation_plan');
      return planDataStr ? JSON.parse(planDataStr) : null;
    } catch (e) {
      return null;
    }
  }

  isVerified() {
    return this.verified;
  }

  getEmail() {
    return this.email;
  }
}

export const emailVerification = new EmailVerification();
export default emailVerification;
```

#### 2. Backend Cloud Function for OTP (`/functions/src/sendVerificationOTP.ts`)

```typescript
/**
 * Send OTP via Resend
 */
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { Resend } from 'resend';

export const sendVerificationOTP = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    const { email } = request.body;

    if (!email || !email.includes('@')) {
      response.status(400).json({ error: "Invalid email" });
      return;
    }

    // Initialize Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("❌ Resend API key not configured");
      response.status(500).json({ error: "Email service not configured" });
      return;
    }

    const resend = new Resend(resendApiKey);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in Firestore (expires in 10 minutes)
    const expiresAt = Date.now() + (10 * 60 * 1000);
    await admin.firestore().collection('otp_codes').doc(email).set({
      otp,
      email,
      expiresAt,
      verified: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: 'VIDA Travel <noreply@vidatravel.com>', // Change to your domain
      to: email,
      subject: 'Tu código de verificación - VIDA Travel',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #006B5E;">Verifica tu email</h2>
          <p>Tu código de verificación es:</p>
          <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>Este código expira en 10 minutos.</p>
          <p>Si no solicitaste este código, ignora este email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">VIDA Travel - Crédito Vacacional</p>
        </div>
      `
    });

    console.log('✅ OTP sent to:', email);

    response.json({
      success: true,
      message: "OTP sent successfully",
      emailId: emailResult.id
    });

  } catch (error: any) {
    console.error("❌ Error sending OTP:", error);
    response.status(500).json({
      success: false,
      error: error.message || "Failed to send OTP"
    });
  }
});
```

#### 3. Verify OTP Function (`/functions/src/verifyOTP.ts`)

```typescript
/**
 * Verify OTP code
 */
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

export const verifyOTP = onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    const { email, otp } = request.body;

    if (!email || !otp) {
      response.status(400).json({ error: "Email and OTP required" });
      return;
    }

    // Get stored OTP
    const otpDoc = await admin.firestore().collection('otp_codes').doc(email).get();

    if (!otpDoc.exists) {
      response.status(400).json({ 
        verified: false, 
        error: "OTP not found or expired" 
      });
      return;
    }

    const otpData = otpDoc.data()!;

    // Check if expired
    if (Date.now() > otpData.expiresAt) {
      await otpDoc.ref.delete();
      response.status(400).json({ 
        verified: false, 
        error: "OTP expired" 
      });
      return;
    }

    // Check if OTP matches
    if (otpData.otp !== otp) {
      response.status(400).json({ 
        verified: false, 
        error: "Invalid OTP" 
      });
      return;
    }

    // Mark as verified
    await otpDoc.ref.update({
      verified: true,
      verifiedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ OTP verified for:', email);

    response.json({
      verified: true,
      email: email
    });

  } catch (error: any) {
    console.error("❌ Error verifying OTP:", error);
    response.status(500).json({
      verified: false,
      error: error.message || "Failed to verify OTP"
    });
  }
});
```

---

## 💳 Step 6: Purchase Event (Click "Activar crédito")

### Current Code Location:
`/public/js/activation-payment.js` - Line 191

### What's Already There:
```javascript
// Track purchase
await analytics.trackPurchaseCompleted(planData, {
  transactionId: result.transactionId,
  paymentMethod: 'card'
});
```

### What You Need to Do:
The Purchase event will fire when user clicks "Activar crédito ($500)" button **after email is verified**.

---

## 🚀 Implementation Steps

### 1. Install Resend in Functions

```bash
cd "/Users/syffs/Desktop/VIDA Travel/functions"
npm install resend
```

### 2. Add Resend API Key

Get your API key from: https://resend.com/api-keys

```bash
cd "/Users/syffs/Desktop/VIDA Travel"
firebase functions:config:set resend.api_key="re_xxxxxxxxxxxxx"
```

### 3. Create the Email Verification UI

Add this to your modal or wherever user enters email:

```html
<!-- Email Verification Step -->
<div id="email-verification-step" class="payment-step">
  <h3>Verifica tu email</h3>
  
  <!-- Email Input -->
  <div id="email-input-section">
    <input 
      type="email" 
      id="user-email" 
      placeholder="tu@email.com"
      required
    />
    <button id="send-otp-btn" class="btn-primary">
      Enviar código
    </button>
  </div>

  <!-- OTP Input (hidden initially) -->
  <div id="otp-input-section" style="display: none;">
    <p>Ingresa el código que enviamos a <strong id="email-display"></strong></p>
    <input 
      type="text" 
      id="otp-code" 
      placeholder="000000"
      maxlength="6"
      required
    />
    <button id="verify-otp-btn" class="btn-primary">
      Verificar
    </button>
    <button id="resend-otp-btn" class="btn-secondary">
      Reenviar código
    </button>
  </div>

  <!-- Verified (shows activation button) -->
  <div id="verified-section" style="display: none;">
    <p>✅ Email verificado</p>
    <button id="activate-credit-btn" class="btn-primary btn-large">
      Activar crédito ($500)
    </button>
  </div>
</div>
```

### 4. Add JavaScript Logic

```javascript
// In your app.js or modal handler

import { emailVerification } from './email-verification.js';
import { analytics } from './analytics.js';

// Send OTP
document.getElementById('send-otp-btn').addEventListener('click', async () => {
  const email = document.getElementById('user-email').value;
  
  try {
    await emailVerification.sendOTP(email);
    
    // Show OTP input section
    document.getElementById('email-input-section').style.display = 'none';
    document.getElementById('otp-input-section').style.display = 'block';
    document.getElementById('email-display').textContent = email;
    
    alert('Código enviado! Revisa tu email.');
  } catch (error) {
    alert('Error al enviar código. Intenta de nuevo.');
  }
});

// Verify OTP
document.getElementById('verify-otp-btn').addEventListener('click', async () => {
  const email = document.getElementById('user-email').value;
  const otp = document.getElementById('otp-code').value;
  
  try {
    const verified = await emailVerification.verifyOTP(email, otp);
    
    if (verified) {
      // ✅ AddPaymentInfo event already fired in verifyOTP()
      
      // Show activation button
      document.getElementById('otp-input-section').style.display = 'none';
      document.getElementById('verified-section').style.display = 'block';
      
      alert('✅ Email verificado!');
    } else {
      alert('Código incorrecto');
    }
  } catch (error) {
    alert('Error al verificar código');
  }
});

// Activate Credit ($500) - PURCHASE EVENT
document.getElementById('activate-credit-btn').addEventListener('click', async () => {
  const planData = emailVerification.getPlanData();
  const email = emailVerification.getEmail();
  
  if (!emailVerification.isVerified()) {
    alert('Por favor verifica tu email primero');
    return;
  }
  
  try {
    // Process activation (could be Stripe, payment gateway, etc.)
    const transactionId = `VIDA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 🎯 FIRE PURCHASE EVENT
    await analytics.trackPurchaseCompleted({
      ...planData,
      email: email
    }, {
      transactionId: transactionId,
      paymentMethod: 'activation',
      amount: 500,
      currency: 'MXN'
    });
    
    console.log('🎉 Purchase event fired!');
    
    // Show success
    alert('🎉 ¡Crédito activado! Te enviamos los detalles por email.');
    
    // Redirect or show success page
    window.location.href = '/success';
    
  } catch (error) {
    console.error('Error activating credit:', error);
    alert('Error al activar crédito');
  }
});
```

---

## 📊 Complete Event Flow Summary

| Step | User Action | Event Fired | Code Location |
|------|-------------|-------------|---------------|
| 1 | Loads page | PageView | `index.html` (automatic) |
| 2 | Clicks destination | ViewContent | `app.js` line ~382 |
| 3 | Uses simulator | AddToCart | `app.js` line ~698 |
| 4 | Clicks "Obtener crédito" | InitiateCheckout | `app.js` line ~944 |
| 5 | Enters email + verifies OTP | **AddPaymentInfo** | `email-verification.js` (new) |
| 6 | Clicks "Activar crédito ($500)" | **Purchase ⭐** | Your activation handler (new) |

---

## 🔧 Quick Setup Commands

```bash
cd "/Users/syffs/Desktop/VIDA Travel"

# 1. Install Resend
cd functions
npm install resend

# 2. Set Resend API key (get from resend.com)
cd ..
firebase functions:config:set resend.api_key="YOUR_RESEND_API_KEY"

# 3. Deploy functions
firebase deploy --only functions

# 4. Deploy hosting (with new email verification UI)
firebase deploy --only hosting
```

---

## ✅ Testing Checklist

- [ ] User receives OTP email via Resend
- [ ] OTP verification works
- [ ] AddPaymentInfo event fires after OTP verification
- [ ] "Activar crédito" button appears
- [ ] Purchase event fires when button is clicked
- [ ] Events appear in Facebook Events Manager
- [ ] Transaction ID is unique and tracked

---

**Ready to implement! Let me know when you want to set up the Resend integration!** 🚀

