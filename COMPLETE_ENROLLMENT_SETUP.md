# 🚀 Complete Enrollment Flow Setup Guide

## ✅ What We Just Created

### Files Created:
1. ✅ `/public/js/enrollment-form.js` - Frontend enrollment logic
2. ✅ `/public/enrollment-form.html` - Complete form UI
3. ✅ `/functions/src/sendVerificationOTP.ts` - Send OTP via Resend
4. ✅ `/functions/src/verifyOTP.ts` - Verify OTP code
5. ✅ Updated `/functions/src/index.ts` - Export new functions

---

## 🎯 Your Complete Conversion Flow

```
User Journey → Meta Pixel Event

1. Visits website → PageView ✅
2. Clicks destination → ViewContent ✅  
3. Uses simulator → AddToCart ✅
4. Clicks "Obtener crédito" → InitiateCheckout ✅
5. Fills form (name, email, phone, region)
6. Verifies email with OTP → AddPaymentInfo 🆕
7. Clicks "Activar crédito ($500)" → Purchase ⭐ 🆕
```

---

## 📋 Setup Steps

### Step 1: Get Resend API Key

1. Go to https://resend.com
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy it (starts with `re_...`)

### Step 2: Install Resend (Not needed - we use their API directly)

The functions use Resend's API directly via fetch, so no npm install needed!

### Step 3: Configure API Key in Firebase

```bash
cd "/Users/syffs/Desktop/VIDA Travel"

# Set the Resend API key
firebase functions:config:set resend.api_key="YOUR_RESEND_API_KEY"
```

### Step 4: Build Functions

```bash
cd functions
npm run build
```

### Step 5: Deploy Functions

```bash
cd ..
firebase deploy --only functions
```

This will deploy:
- ✅ `sendVerificationOTP` - Sends OTP email
- ✅ `verifyOTP` - Verifies code
- ✅ `metaConversionAPI` - Tracks server-side events (already deployed)

### Step 6: Add Form to Your Site

You have two options:

#### Option A: Add to Modal

In your `app.js`, when user clicks "Obtener mi crédito", show the enrollment form:

```javascript
// In your InitiateCheckout handler
document.getElementById('heroCtaBtn').addEventListener('click', function() {
  // Track InitiateCheckout
  fbq('track', 'InitiateCheckout', {...});
  
  // Show enrollment form modal
  showEnrollmentModal();
});

function showEnrollmentModal() {
  // Load the enrollment form HTML into your modal
  const modalBody = document.getElementById('modalBody');
  
  fetch('/enrollment-form.html')
    .then(response => response.text())
    .then(html => {
      modalBody.innerHTML = html;
      
      // Import and initialize the enrollment form
      import('./js/enrollment-form.js').then(module => {
        module.enrollmentForm.init();
      });
    });
}
```

#### Option B: Create Separate Page

1. Copy `/public/enrollment-form.html` content
2. Create `/public/enroll.html`
3. Add the enrollment form HTML
4. Link to it from your CTA buttons

---

## 🧪 Testing the Complete Flow

### 1. Test Locally First

```bash
# Make sure everything is deployed
firebase deploy

# Visit your site
open https://vidatravel.romay.tech
```

### 2. Complete User Journey

1. **Open DevTools** (F12 → Console)
2. **Click a destination** → See `ViewContent`
3. **Use simulator** → See `AddToCart`
4. **Click "Obtener mi crédito"** → See `InitiateCheckout`
5. **Fill enrollment form:**
   - Name: Juan Pérez
   - Email: your-test@email.com
   - Phone: 555-123-4567
   - Region: Ciudad de México
6. **Click Continue** → OTP section appears
7. **Check your email** → Copy 6-digit code
8. **Enter OTP** → See `AddPaymentInfo` event 🎯
9. **Click "Activar crédito ($500)"** → See `Purchase` event ⭐

### 3. Verify in Facebook

**Events Manager → Test Events** should show:
```
PageView
ViewContent
AddToCart
InitiateCheckout
AddPaymentInfo     ← NEW!
Purchase           ← NEW! ($500)
```

---

## 📊 What Each Event Sends

### AddPaymentInfo (After OTP Verification)
```javascript
{
  content_name: "Cancún",
  content_type: "enrollment",
  value: 500,
  currency: "MXN"
}
```

### Purchase (After Clicking "Activar crédito")
```javascript
{
  content_name: "Cancún",
  content_type: "enrollment_fee",
  value: 500,
  currency: "MXN",
  transaction_id: "VIDA_1732209600_abc123"
}
```

---

## 🔒 Security Features Included

✅ OTP expires after 10 minutes  
✅ Maximum 5 verification attempts  
✅ Email validation  
✅ Phone number formatting  
✅ Secure storage in Firestore  
✅ CORS enabled for your domain  
✅ IP and user agent logging  

---

## 🎨 Form UI Features

✅ Mobile responsive  
✅ Mexican states dropdown  
✅ Phone number auto-formatting (XXX-XXX-XXXX)  
✅ Email validation  
✅ Loading indicators  
✅ Success/error messages  
✅ Beautiful email template  
✅ Resend OTP button  
✅ Professional success modal  

---

## 📧 Email Template Features

The OTP email includes:
- ✅ VIDA Travel branding
- ✅ Large, clear OTP code
- ✅ 10-minute expiration notice
- ✅ Security warning
- ✅ Mobile responsive design
- ✅ Professional footer

---

## 🐛 Troubleshooting

### OTP Not Sending

**Check:**
1. Resend API key is set: `firebase functions:config:get`
2. Functions are deployed: `firebase deploy --only functions`
3. Check Functions logs: `firebase functions:log --only sendVerificationOTP`

**Common Issues:**
- API key not configured
- Resend account not verified
- Email domain not verified (use onboarding@resend.dev for testing)

### OTP Not Verifying

**Check:**
1. Code is 6 digits
2. Code hasn't expired (10 minutes)
3. Not exceeding 5 attempts
4. Check Firestore collection: `otp_codes`

### Events Not Firing

**Check:**
1. Browser console for errors
2. `fbq` is defined: `typeof fbq !== 'undefined'`
3. Meta Pixel initialized
4. Check Facebook Test Events tool

---

## 🔧 Configuration Options

### Change OTP Expiration

In `/functions/src/sendVerificationOTP.ts`:
```typescript
const expiresAt = Date.now() + 10 * 60 * 1000; // Change 10 to desired minutes
```

### Change Max Attempts

In `/functions/src/verifyOTP.ts`:
```typescript
if (otpData.attempts >= 5) { // Change 5 to desired max
```

### Customize Email Template

Edit the HTML in `/functions/src/sendVerificationOTP.ts`

### Change Email Sender

```typescript
from: "VIDA Travel <your-email@your-domain.com>",
```
Note: You need to verify your domain in Resend first!

---

## 📱 Mobile Optimization

The form is fully mobile responsive:
- Touch-friendly inputs
- Proper input types (email, tel, number)
- Large tap targets
- Readable font sizes
- Auto-zoom disabled on focus

---

## 🎯 Next Steps After Setup

1. **Test everything** with real email
2. **Monitor Events Manager** for 24 hours
3. **Check match quality** score
4. **Create Facebook campaigns** using Purchase event
5. **Set up custom audiences**:
   - AddPaymentInfo but no Purchase (abandoned)
   - Purchase in last 30 days (exclude from ads)
   - InitiateCheckout but no AddPaymentInfo (retarget)

---

## 📈 Expected Results

### Immediately:
- ✅ Events appear in Test Events
- ✅ OTP emails delivered
- ✅ Users can complete enrollment

### Within 24-48 hours:
- ✅ Event match quality calculated
- ✅ Conversion funnel visible
- ✅ Can create ad campaigns

### For Ad Campaigns:
- ✅ Use "Purchase" as conversion event
- ✅ $500 MXN value tracked
- ✅ Server-side + client-side tracking
- ✅ Deduplication working

---

## ✅ Deployment Checklist

- [ ] Resend account created
- [ ] API key obtained
- [ ] API key configured in Firebase
- [ ] Functions built successfully
- [ ] Functions deployed
- [ ] Enrollment form added to site
- [ ] Tested OTP send
- [ ] Tested OTP verify
- [ ] Tested AddPaymentInfo event
- [ ] Tested Purchase event
- [ ] Verified in Facebook Events Manager
- [ ] Checked Firestore collections
- [ ] Mobile testing complete

---

## 🆘 Quick Commands Reference

```bash
# Configure Resend API key
firebase functions:config:set resend.api_key="YOUR_KEY"

# Build functions
cd functions && npm run build

# Deploy everything
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy only hosting
firebase deploy --only hosting

# View functions logs
firebase functions:log

# View specific function logs
firebase functions:log --only sendVerificationOTP

# Check configuration
firebase functions:config:get
```

---

## 🎉 You're All Set!

Your complete conversion tracking is now ready:

1. ✅ Client-side Meta Pixel
2. ✅ Server-side Conversions API
3. ✅ Email verification with OTP
4. ✅ Complete user enrollment flow
5. ✅ All 6 key conversion events tracked
6. ✅ Professional UI/UX
7. ✅ Mobile optimized
8. ✅ Security built-in

**Ready to deploy and start tracking conversions!** 🚀

