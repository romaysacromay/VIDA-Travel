# 🎯 Quick Purchase Event Setup

## Your Current Flow (What You Told Me):

1. **AddPaymentInfo** fires when: User enters email + confirms OTP
2. **Purchase** fires when: User clicks "Activar crédito ($500)" button

---

## 🚀 Quick Implementation (No Resend needed yet)

For testing purposes, let's get the Purchase event working first, then add Resend OTP later.

### Where is the "Activar crédito ($500)" button?

Based on your screenshot, this button should be in your enrollment/activation flow.

### Simple Test Version:

Add this to your app.js or wherever the activation button is:

```javascript
// Find the activation button
const activateBtn = document.querySelector('[data-action="activate-credit"]');
// Or use specific ID if you know it

if (activateBtn) {
  activateBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    
    // Get plan data
    const planDataStr = sessionStorage.getItem('vida_vacation_plan');
    const planData = planDataStr ? JSON.parse(planDataStr) : {};
    
    // Generate transaction ID
    const transactionId = `VIDA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 🎯 FIRE PURCHASE EVENT
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Purchase', {
        content_name: planData.destination || 'Vacation Package',
        content_type: 'enrollment_fee',
        value: 500,
        currency: 'MXN',
        transaction_id: transactionId
      });
      
      console.log('🎉 Purchase event fired!', {
        value: 500,
        transaction_id: transactionId
      });
    }
    
    // Continue with your activation logic...
    alert('¡Crédito activado! Purchase event sent to Facebook.');
  });
}
```

---

## 📍 Where to Add This Code?

### Option 1: In app.js at the bottom
Add around line ~1200 (after your init code)

### Option 2: Find where your modal/activation flow is
Look for where the "$500" or "Activar crédito" button is defined

---

## 🧪 How to Test Right Now:

1. **Open your site:** https://vidatravel.romay.tech
2. **Open Console** (F12)
3. **Complete the flow:**
   - Click a destination
   - Use the simulator
   - Click "Obtener mi crédito"
   - Look for the "Activar crédito ($500)" button
   - Click it

4. **Check console for:** `🎉 Purchase event fired!`

5. **Check Facebook Test Events:**
   - Go to Events Manager → Test Events
   - Should see "Purchase" event with value: 500 MXN

---

## 📊 Current Events Working:

✅ PageView  
✅ ViewContent  
✅ AddToCart  
✅ InitiateCheckout  
✅ Lead  
⏳ AddPaymentInfo (needs OTP setup)  
⏳ Purchase (needs button connection)  

---

## 🎯 Next Steps:

1. **Find the activation button** in your code
2. **Add the Purchase event** tracking
3. **Test it** (see event in console + Facebook)
4. **Then** we'll add the OTP/email verification for AddPaymentInfo

---

**Want me to help find where the "Activar crédito" button is in your code?**

