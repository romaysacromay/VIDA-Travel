# VIDA Travel - Deployment Checklist

## Pre-Deployment Setup

### 1. Firebase Project Configuration
- [ ] Firebase project created: `vida-travel-vacation-credit`
- [ ] Blaze plan enabled (required for Cloud Functions)
- [ ] Billing account linked

### 2. Firebase Services Enabled
- [ ] Firebase Hosting
- [ ] Cloud Firestore
- [ ] Cloud Functions
- [ ] Cloud Storage
- [ ] Firebase Authentication (Email/Password)
- [ ] Firebase Remote Config
- [ ] Google Analytics for Firebase

### 3. API Keys & Configuration
- [ ] Gemini API key obtained from [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] Firebase config added to `public/index.html`
- [ ] Google Analytics Measurement ID added
- [ ] Meta Pixel ID added (if using)

---

## Deployment Steps

### Step 1: Upload Configuration Files to Cloud Storage

```bash
# Set your bucket name (usually: [project-id].appspot.com)
BUCKET_NAME="vida-travel-vacation-credit.appspot.com"

# Upload pricing config
gsutil cp pricing-config.json gs://$BUCKET_NAME/pricing-config.json

# Upload RAG context
gsutil cp rag-context.json gs://$BUCKET_NAME/rag-context.json

# Set public read permissions (if needed)
gsutil acl ch -u AllUsers:R gs://$BUCKET_NAME/pricing-config.json
gsutil acl ch -u AllUsers:R gs://$BUCKET_NAME/rag-context.json
```

### Step 2: Upload Destination Images

```bash
# Upload destination images
gsutil -m cp -r public/images/destinations/* gs://$BUCKET_NAME/destination-images/

# Or use Firebase Hosting (images in public/images/destinations/)
```

### Step 3: Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore
```

### Step 4: Set Environment Variables

```bash
# Set Gemini API key
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"

# Verify
firebase functions:config:get
```

### Step 5: Build and Deploy Cloud Functions

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

### Step 6: Deploy Frontend

```bash
firebase deploy --only hosting
```

### Step 7: Configure Remote Config

1. Go to Firebase Console > Remote Config
2. Import `remoteconfig.template.json` or manually create parameters
3. Set up A/B testing experiments
4. Publish configuration

### Step 8: Enable BigQuery Export

1. Go to Firebase Console > Project Settings > Integrations
2. Enable BigQuery export for:
   - Google Analytics for Firebase
   - Cloud Firestore
3. Create dataset: `vida_analytics` (if not auto-created)

---

## Post-Deployment Verification

### Frontend Checks
- [ ] Page loads in Spanish by default
- [ ] Language toggle works (ES ↔ EN)
- [ ] Destination selector displays correctly (dropdown + cards)
- [ ] Date picker functions properly
- [ ] Family composition selector works
- [ ] Financial inputs validate correctly
- [ ] Simulation results display correctly
- [ ] Chat widget appears (bottom-right)
- [ ] Chat section works on main page
- [ ] 0% interest messaging is prominent
- [ ] Mobile responsiveness verified

### Backend Checks
- [ ] Cloud Functions deployed successfully
- [ ] `simulateVacationCredit` function responds correctly
- [ ] `chatAgent` function responds correctly
- [ ] Pricing config loads from Cloud Storage
- [ ] RAG context loads from Cloud Storage
- [ ] Firestore writes succeed
- [ ] Analytics events firing

### Analytics Checks
- [ ] Google Analytics receiving events
- [ ] Meta Pixel tracking (if configured)
- [ ] Language tracking working
- [ ] Conversion events tracking
- [ ] A/B variant assignment working

---

## Testing Checklist

### Functional Testing
- [ ] Complete user flow: Destination → Dates → Family → Salary → Results
- [ ] 15% salary rule enforced correctly
- [ ] Loan term auto-adjustment (6-12 months)
- [ ] 0% interest calculations accurate
- [ ] Date feasibility check working
- [ ] Guaranteed date calculation correct
- [ ] Chat agent responds in correct language
- [ ] RAG context used in chat responses

### Language Testing
- [ ] All UI text in Spanish by default
- [ ] Language toggle switches all content
- [ ] Error messages in selected language
- [ ] Chat responses in selected language
- [ ] Results dashboard in selected language

### Mobile Testing
- [ ] Date picker works on mobile
- [ ] Destination cards display correctly
- [ ] Form inputs accessible
- [ ] Chat widget accessible
- [ ] Results dashboard readable
- [ ] Language toggle accessible

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Cloud Functions response time < 2 seconds
- [ ] Images load efficiently
- [ ] No console errors

---

## Monitoring Setup

### Firebase Console
- [ ] Set up alerts for Cloud Functions errors
- [ ] Monitor Firestore usage
- [ ] Track Cloud Storage usage
- [ ] Set up Remote Config change notifications

### Analytics Dashboards
- [ ] Create conversion funnel dashboard
- [ ] Set up language preference dashboard
- [ ] Create A/B test comparison dashboard
- [ ] Set up destination popularity dashboard

---

## Rollback Plan

If issues occur:

1. **Frontend Rollback**:
   ```bash
   firebase hosting:channel:deploy previous-version
   ```

2. **Functions Rollback**:
   ```bash
   firebase functions:delete simulateVacationCredit
   firebase functions:delete chatAgent
   # Redeploy previous version
   ```

3. **Config Rollback**:
   - Revert `pricing-config.json` in Cloud Storage
   - Revert `rag-context.json` in Cloud Storage
   - Revert Remote Config to previous version

---

## Support Contacts

- Firebase Support: https://firebase.google.com/support
- Documentation: See `OPERATIONS.md` for operational guides
- Issues: Check Firebase Console logs and Cloud Functions logs

---

## Next Steps After Deployment

1. Monitor conversion rates by language
2. Analyze A/B test results weekly
3. Review chat interactions for common questions
4. Update RAG context based on user questions
5. Adjust pricing based on demand
6. Add new destinations as needed

