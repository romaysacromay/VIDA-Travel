# VIDA Travel - Quick Start Deployment

## 🚀 Fast Track Deployment

### Step 1: Upload Config Files (2 minutes)

**Easiest Method - Firebase Console:**
1. Open: https://console.firebase.google.com/project/vida-travel-vacation-credit/storage
2. Click "Get Started" if Storage not initialized
3. Click "Upload file"
4. Upload `pricing-config.json`
5. Upload `rag-context.json`

**Done!** ✅

---

### Step 2: Set Gemini API Key (1 minute)

```bash
# Get your key from: https://makersuite.google.com/app/apikey
firebase functions:config:set gemini.api_key="YOUR_ACTUAL_KEY_HERE"
```

**Verify:**
```bash
firebase functions:config:get
```

---

### Step 3: Deploy Functions (5 minutes)

**First, enable Blaze Plan:**
- Visit: https://console.firebase.google.com/project/vida-travel-vacation-credit/usage/details
- Click "Upgrade" → Select Blaze Plan
- Add billing (free $300/month credit included)

**Then deploy:**
```bash
cd "/Users/syffs/Desktop/VIDA Travel"
firebase deploy --only functions
```

**Expected output:**
```
✔  functions[simulateVacationCredit(us-central1)]: Successful
✔  functions[chatAgent(us-central1)]: Successful
```

---

### Step 4: Configure Remote Config (5 minutes)

Run the helper script:
```bash
./setup-remote-config.sh
```

Or manually:
1. Go to: https://console.firebase.google.com/project/vida-travel-vacation-credit/config
2. Add parameters from `remoteconfig.template.json`
3. Publish changes

**Minimum required parameters:**
- `zero_interest_headline_es` = "0% de Interés Garantizado"
- `zero_interest_headline_en` = "0% Interest Guaranteed"
- `cta_text_es` = "Pagar mi cuota de inscripción"
- `cta_text_en` = "Pay my enrolment fee"

---

### Step 5: Test Everything (5 minutes)

**Visit:** https://vida-travel-vacation-credit.web.app

**Quick Test Checklist:**
- [ ] Page loads in Spanish
- [ ] Language toggle works (ES ↔ EN)
- [ ] Select destination → see 6 options
- [ ] Select dates → date picker works
- [ ] Enter salary & deposit → validation works
- [ ] Click "Calcular" → results appear
- [ ] Check results show 0% interest messaging
- [ ] Click chat widget → modal opens
- [ ] Type message → get response
- [ ] Click "Pagar mi cuota" → no errors

**Check Function Logs:**
```bash
firebase functions:log
```

**Check Analytics:**
- Firebase Console > Analytics
- Should see events: `page_load`, `destination_selected`, etc.

---

## ✅ Success Indicators

**Everything Working:**
- ✅ Simulator calculates prices correctly
- ✅ Results show loan terms (6-12 months)
- ✅ Monthly payment ≤ 15% of salary
- ✅ Chat responds in selected language
- ✅ 0% interest messaging visible
- ✅ Analytics events firing

**If Something's Wrong:**
1. Check browser console (F12) for errors
2. Check function logs: `firebase functions:log`
3. Verify config files in Storage
4. Verify Gemini API key is set
5. Check Firestore rules allow writes

---

## 🎯 You're Done!

The application is now fully deployed and ready for testing!

**Next Steps:**
- Monitor analytics in Firebase Console
- Review chat logs to improve RAG context
- Run A/B tests via Remote Config
- Replace placeholder images with real photos

**Support:**
- See `COMPLETE_DEPLOYMENT_GUIDE.md` for detailed troubleshooting
- See `OPERATIONS.md` for ongoing management
- See `PRICING_CONFIG.md` for pricing updates


