# VIDA Travel - Complete Deployment Guide

## 🎉 Current Status

✅ **Hosting Deployed**: https://vida-travel-vacation-credit.web.app  
✅ **Firestore Rules Deployed**  
✅ **All Code Ready**  
⚠️ **Pending**: Blaze Plan Upgrade, Config Uploads, Gemini API Key

---

## Step-by-Step Completion Guide

### STEP 1: Enable Blaze Plan (REQUIRED)

**Why**: Cloud Functions require Blaze (pay-as-you-go) plan.

**Action**:
1. Visit: https://console.firebase.google.com/project/vida-travel-vacation-credit/usage/details
2. Click "Upgrade" or "Modify plan"
3. Select "Blaze Plan"
4. Add billing account (credit card required)
5. Complete upgrade

**Note**: Free tier includes $300 credit/month, which should cover initial testing.

---

### STEP 2: Upload Configuration Files to Cloud Storage

**Files to Upload**:
- `pricing-config.json`
- `rag-context.json`

**Method 1: Firebase Console (Easiest)**
1. Go to: https://console.firebase.google.com/project/vida-travel-vacation-credit/storage
2. Click "Get Started" if Storage not initialized
3. Click "Upload file"
4. Upload `pricing-config.json` to root
5. Upload `rag-context.json` to root

**Method 2: Using gcloud SDK**
```bash
# Install gcloud SDK first: https://cloud.google.com/sdk/docs/install
gcloud auth login
gsutil cp pricing-config.json gs://vida-travel-vacation-credit.appspot.com/
gsutil cp rag-context.json gs://vida-travel-vacation-credit.appspot.com/
```

**Method 3: Using Node.js Script (After Blaze enabled)**
```bash
cd functions
node -e "
const admin = require('firebase-admin');
admin.initializeApp();
const bucket = admin.storage().bucket();
Promise.all([
  bucket.upload('../pricing-config.json', {destination: 'pricing-config.json'}),
  bucket.upload('../rag-context.json', {destination: 'rag-context.json'})
]).then(() => console.log('✓ Uploaded')).catch(e => console.error(e));
"
```

**Verify Upload**:
- Check Firebase Console > Storage
- Both files should be visible in root directory

---

### STEP 3: Set Gemini API Key

**Get API Key**:
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

**Set the Key**:
```bash
firebase functions:config:set gemini.api_key="YOUR_ACTUAL_API_KEY_HERE"
```

**Verify**:
```bash
firebase functions:config:get
```

Should show:
```
gemini:
  api_key: "YOUR_KEY"
```

---

### STEP 4: Deploy Cloud Functions

**After Blaze plan enabled**:
```bash
cd "/Users/syffs/Desktop/VIDA Travel"
firebase deploy --only functions
```

**Expected Output**:
```
✔  functions[simulateVacationCredit(us-central1)]: Successful create operation.
✔  functions[chatAgent(us-central1)]: Successful create operation.

Function URLs:
  simulateVacationCredit: https://us-central1-vida-travel-vacation-credit.cloudfunctions.net/simulateVacationCredit
  chatAgent: https://us-central1-vida-travel-vacation-credit.cloudfunctions.net/chatAgent
```

**Note**: Function URLs are already configured in `public/js/app.js` and `public/js/chat-widget.js`

---

### STEP 5: Configure Remote Config

**Access**: https://console.firebase.google.com/project/vida-travel-vacation-credit/config

**Add Parameters** (one by one):

1. **zero_interest_headline_es**
   - Type: String
   - Default: "0% de Interés Garantizado"
   - Variant A: "Crédito Sin Intereses"
   - Variant B: "0% de Interés Garantizado en tu Crédito de Viaje"

2. **zero_interest_headline_en**
   - Type: String
   - Default: "0% Interest Guaranteed"
   - Variant A: "Interest-Free Travel Credit"
   - Variant B: "0% Interest Guaranteed on Travel Credit"

3. **cta_text_es**
   - Type: String
   - Default: "Pagar mi cuota de inscripción"
   - Variant A: "Comenzar mi fondo de viaje"

4. **cta_text_en**
   - Type: String
   - Default: "Pay my enrolment fee"
   - Variant A: "Start My Vacation Fund"

5. **hero_background_image**
   - Type: String
   - Default: "cancun"
   - Variant A: "puerto-vallarta"
   - Variant B: "los-cabos"

6. **pricing_display_emphasis**
   - Type: String
   - Default: "total_price"
   - Variant A: "monthly_payment"

7. **default_loan_term**
   - Type: Number
   - Default: 6
   - Variant A: 12
   - Variant B: 9

**Publish Configuration**:
- Click "Publish changes" after adding all parameters

**Set Up A/B Testing**:
1. Go to "Experiments" tab
2. Click "Create experiment"
3. Select parameters to test
4. Set traffic allocation (e.g., 33% control, 33% variant A, 33% variant B)
5. Define success metric: `enrollment_fee_click` event
6. Start experiment

---

### STEP 6: Test End-to-End Flow

**Test URL**: https://vida-travel-vacation-credit.web.app

#### Test 1: Language Toggle
- [ ] Page loads in Spanish
- [ ] Click EN button → all text switches to English
- [ ] Click ES button → all text switches back to Spanish
- [ ] Language preference persists on refresh

#### Test 2: Destination Selection
- [ ] Click destination dropdown → see 6 options
- [ ] Switch to card view → see 6 destination cards
- [ ] Select a destination → card highlights
- [ ] Analytics event fires (check browser console)

#### Test 3: Date Selection
- [ ] Select check-in date
- [ ] Select check-out date (must be after check-in)
- [ ] Invalid dates show error
- [ ] Analytics event fires

#### Test 4: Family Composition
- [ ] Select 1-2 adults
- [ ] Enter number of children (0+)
- [ ] Analytics event fires

#### Test 5: Financial Inputs
- [ ] Enter monthly salary (e.g., 15000)
- [ ] Enter weekly deposit (e.g., 500)
- [ ] Validation works (deposit not too high)
- [ ] Analytics event fires

#### Test 6: Simulation
- [ ] Click "Calcular Crédito de Vacaciones"
- [ ] Results display:
  - [ ] Total package price
  - [ ] Savings target (80%)
  - [ ] Weeks to save
  - [ ] Loan amount (20%)
  - [ ] Loan term (6-12 months)
  - [ ] Monthly payment (≤15% of salary)
  - [ ] Guaranteed departure date
  - [ ] 0% interest messaging prominent
- [ ] Check browser console for function call
- [ ] Check Firestore for session data

#### Test 7: Chat Widget
- [ ] Floating button visible (bottom-right)
- [ ] Click button → modal opens
- [ ] Welcome message in Spanish
- [ ] Type question → get response
- [ ] Switch language → chat responds in new language
- [ ] Check Firestore for chat messages

#### Test 8: Chat Section
- [ ] Scroll to chat section
- [ ] Type message → get response
- [ ] Conversation history maintained

#### Test 9: Enrollment Button
- [ ] Click "Pagar mi cuota de inscripción"
- [ ] Analytics event fires (`enrollment_fee_click`)
- [ ] Check Firebase Analytics dashboard

#### Test 10: Mobile Responsiveness
- [ ] Open on mobile device or resize browser
- [ ] All components readable
- [ ] Date picker works on mobile
- [ ] Destination cards stack properly
- [ ] Chat widget accessible

---

## Verification Checklist

### Firebase Console Checks

**Storage**:
- [ ] `pricing-config.json` uploaded
- [ ] `rag-context.json` uploaded

**Functions**:
- [ ] `simulateVacationCredit` deployed
- [ ] `chatAgent` deployed
- [ ] No errors in function logs

**Firestore**:
- [ ] Rules deployed
- [ ] Test write succeeds (check simulator session)

**Remote Config**:
- [ ] All parameters added
- [ ] Configuration published
- [ ] A/B experiments created (optional)

**Analytics**:
- [ ] Events appearing in dashboard
- [ ] Language tracking working
- [ ] Conversion events tracking

---

## Troubleshooting

### Functions Not Working

**Check Logs**:
```bash
firebase functions:log
```

**Common Issues**:
1. **Config files not found**: Upload to Cloud Storage
2. **Gemini API key error**: Set the key correctly
3. **CORS errors**: Functions have CORS enabled, check browser console
4. **Timeout**: Increase function timeout in Firebase Console

### Pricing Not Loading

1. Verify `pricing-config.json` in Cloud Storage
2. Check function logs for errors
3. Wait 1 hour for cache to expire, or restart functions
4. Verify JSON syntax is valid

### Chat Not Responding

1. Verify Gemini API key is set
2. Check function logs for API errors
3. Verify `rag-context.json` uploaded
4. Check RAG context JSON syntax

### Analytics Not Tracking

1. Verify Firebase Analytics initialized in `index.html`
2. Check browser console for errors
3. Verify Measurement ID is correct
4. Check Firebase Console > Analytics for events

---

## Next Steps After Deployment

1. **Monitor Analytics**: Check conversion rates daily
2. **Review Chat Logs**: Identify common questions, update RAG context
3. **A/B Test Results**: Analyze weekly, adjust variants
4. **Update Pricing**: Adjust based on demand (see `PRICING_CONFIG.md`)
5. **Add Real Images**: Replace placeholder destination images
6. **Optimize**: Based on user feedback and analytics

---

## Support Resources

- **Firebase Console**: https://console.firebase.google.com/project/vida-travel-vacation-credit
- **Function Logs**: `firebase functions:log`
- **Documentation**: See `OPERATIONS.md` and `PRICING_CONFIG.md`
- **Deployment Script**: `./deploy.sh` (after Blaze enabled)

---

**Status**: Ready for final deployment steps! 🚀


