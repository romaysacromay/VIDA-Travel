# 🚀 VIDA Travel - Deployment Guide

Complete step-by-step guide to deploy the VIDA Travel vacation credit simulator.

---

## Prerequisites Checklist

Before deploying, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Firebase project created (`vida-travel-vacation-credit`)
- [ ] Firebase billing enabled (required for Cloud Functions)
- [ ] Meta Pixel ID from Facebook Business Manager
- [ ] Meta Access Token for Conversion API
- [ ] Google Gemini API key
- [ ] Brand assets (logo + destination images)

---

## Step 1: Local Setup

### 1.1 Install Dependencies

```bash
cd "/Users/syffs/Desktop/VIDA Travel"

# Install root dependencies (if any)
npm install

# Install Functions dependencies
cd functions
npm install
cd ..
```

### 1.2 Configure Environment Variables

Create `functions/.env` (this file is gitignored):

```bash
# Gemini AI
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Meta Pixel & Conversion API
META_PIXEL_ID=1234567890123456
META_ACCESS_TOKEN=your_meta_access_token_here

# BigQuery (optional - defaults to Firebase project)
BIGQUERY_PROJECT_ID=vida-travel-vacation-credit
BIGQUERY_DATASET=vida_analytics

# Environment
NODE_ENV=production
```

**Where to get these:**
- **Gemini API Key**: https://makersuite.google.com/app/apikey
- **Meta Pixel ID**: https://business.facebook.com/events_manager
- **Meta Access Token**: Business Settings → System Users → Generate Token

### 1.3 Update Meta Pixel in HTML

Edit `public/index.html` line 19:

```javascript
fbq('init', '1234567890123456'); // Replace with your actual Pixel ID
```

Also update line 23:
```html
src="https://www.facebook.com/tr?id=1234567890123456&ev=PageView&noscript=1"
```

---

## Step 2: Add Brand Assets

### 2.1 Logo

Place your logo file at:
```
public/assets/Logo_1.0.png
```

Requirements:
- Format: PNG with transparent background
- Min width: 180px
- Aspect ratio maintained

### 2.2 Destination Images

Place images at:
```
public/assets/destinations/
├── cancun.jpg
├── playa.jpg
├── tulum.jpg
├── cabo.jpg
├── vallarta.jpg
└── cdmx.jpg
```

Requirements:
- Format: JPG or WebP
- Dimensions: Min 800×600px
- File size: < 500KB each

**Temporary placeholder**: If assets aren't ready, the app will show SVG placeholders.

---

## Step 3: Firebase Authentication

### 3.1 Login to Firebase

```bash
firebase login
```

### 3.2 Verify Project

```bash
firebase projects:list

# Should show: vida-travel-vacation-credit
```

### 3.3 Set Active Project

```bash
firebase use vida-travel-vacation-credit
```

---

## Step 4: Deploy Firestore Configuration

### 4.1 Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

Expected output:
```
✔  Deploy complete!
```

### 4.2 Deploy Indexes

```bash
firebase deploy --only firestore:indexes
```

This creates 15 composite indexes. It may take 10-15 minutes to build all indexes.

---

## Step 5: Deploy Cloud Functions

### 5.1 Build TypeScript

```bash
cd functions
npm run build
cd ..
```

Verify `functions/lib/` directory was created.

### 5.2 Deploy Functions

```bash
firebase deploy --only functions
```

This deploys 5 functions:
- `geminiChatAgent` - AI chat
- `processActivationPayment` - Payment processing
- `metaConversionAPI` - Server-side Meta Pixel
- `exportToBigQuery` - Scheduled BigQuery export
- `getRagContext` - Knowledge base helper

Expected output:
```
✔  functions[geminiChatAgent(us-central1)] Successful create operation.
✔  functions[processActivationPayment(us-central1)] Successful create operation.
✔  functions[metaConversionAPI(us-central1)] Successful create operation.
✔  functions[exportToBigQuery(us-central1)] Successful create operation.
```

**Note**: First deployment takes 3-5 minutes.

### 5.3 Set Environment Variables (Alternative)

If `.env` doesn't work, set via CLI:

```bash
firebase functions:config:set \
  gemini.api_key="your_key" \
  meta.pixel_id="your_pixel_id" \
  meta.access_token="your_token"

# Then redeploy
firebase deploy --only functions
```

---

## Step 6: Deploy Remote Config

```bash
firebase deploy --only remoteconfig
```

This uploads the 4 A/B test variants:
- Control (34%)
- Pricing High (22%)
- Pricing Low (22%)
- Loan 30 (22%)

---

## Step 7: Deploy Hosting

```bash
firebase deploy --only hosting
```

Expected output:
```
✔  Deploy complete!

Hosting URL: https://vida-travel-vacation-credit.web.app
```

---

## Step 8: Verify Deployment

### 8.1 Check Website

1. Open: `https://vida-travel-vacation-credit.web.app`
2. Verify:
   - [ ] Page loads without errors
   - [ ] Logo displays (or placeholder)
   - [ ] Destination cards show 6 options
   - [ ] Language toggle works (ES/EN)

### 8.2 Test Simulator Flow

1. Select destination (e.g., Cancún)
2. Choose adults: 2, children: 1
3. Enter salary: 25,000
4. Enter weekly deposit: 1,000
5. Click "Continuar" through steps
6. Verify calculator shows results
7. Verify date picker is restricted
8. Test chat widget (bottom-right)

### 8.3 Check Browser Console

Open DevTools (F12) and verify:
- ✅ No JavaScript errors
- ✅ Firebase initialized
- ✅ Variant assigned
- ✅ UTM tracker active
- ✅ Meta Pixel events firing

Look for:
```
✅ Firebase initialized successfully
✅ Variant assigned: control
✅ Language initialized: es
📄 Page view tracked
```

### 8.4 Check Meta Pixel

In Facebook Events Manager:
1. Go to Test Events
2. Enter your website URL
3. Interact with simulator
4. Verify events appear:
   - PageView
   - ViewContent (destination selected)
   - AddToCart (simulator completed)

---

## Step 9: Enable BigQuery Export

### 9.1 Enable BigQuery API

```bash
gcloud services enable bigquery.googleapis.com --project=vida-travel-vacation-credit
```

Or via Console:
1. Go to: https://console.cloud.google.com/apis/library/bigquery.googleapis.com
2. Click "Enable"

### 9.2 Create Dataset

The first scheduled export will auto-create the dataset. To create manually:

```bash
bq --project_id=vida-travel-vacation-credit mk --dataset vida_analytics
```

### 9.3 Test Export (Optional)

Trigger the export function manually:

```bash
# Via Firebase Console
# Functions → exportToBigQuery → Test Function

# Or wait for scheduled run (every 6 hours)
```

### 9.4 Verify Tables

After first export, check:

```bash
bq ls --project_id=vida-travel-vacation-credit vida_analytics
```

Should show:
- simulator_sessions
- analytics_events
- activation_payments
- meta_pixel_events
- variant_assignments
- chat_logs

---

## Step 10: Production Checklist

Before announcing launch:

### Security
- [ ] Firestore rules deployed and tested
- [ ] Environment variables secured (not in git)
- [ ] API keys rotated if previously exposed
- [ ] HTTPS enforced (automatic with Firebase Hosting)

### Performance
- [ ] Images optimized (< 500KB each)
- [ ] Lazy loading enabled (automatic with `loading="lazy"`)
- [ ] CDN cache configured (automatic with Firebase)

### Analytics
- [ ] Meta Pixel ID configured and firing events
- [ ] Google Analytics (optional) configured
- [ ] UTM parameters tested with `?utm_source=test`
- [ ] Conversion tracking verified in Meta Events Manager

### Content
- [ ] Logo displayed correctly
- [ ] All destination images loaded
- [ ] Spanish translations complete
- [ ] English translations complete
- [ ] Brand colors applied (Teal/Gold)

### Functionality
- [ ] All 5 steps navigate correctly
- [ ] Calculator validates inputs
- [ ] Date picker restricts correctly
- [ ] Payment form validates (Luhn check)
- [ ] Chat widget responds (if API key set)
- [ ] Success modal displays after payment

### Legal (Important!)
- [ ] Terms & Conditions page created
- [ ] Privacy Policy page created
- [ ] Cookie Policy page created
- [ ] Cookie consent banner added (GDPR)
- [ ] Data retention policy documented

---

## Step 11: Monitoring & Maintenance

### Daily Monitoring

1. **Firebase Console**
   - Check for errors: https://console.firebase.google.com/project/vida-travel-vacation-credit/overview
   - Monitor function executions
   - Check Firestore usage

2. **Meta Events Manager**
   - Verify event delivery
   - Check for diagnostic issues
   - Monitor conversion rates

3. **BigQuery**
   - Verify scheduled exports running
   - Check data quality
   - Run test queries

### Weekly Tasks

1. **Review Analytics**
   - Conversion rate by variant
   - Average package price
   - Top destinations
   - Drop-off points in funnel

2. **A/B Test Analysis**
   - Statistical significance (Chi-square test)
   - Winner determination (≥95% confidence)
   - Iterate variants based on learnings

3. **Performance**
   - Page load times
   - Function cold starts
   - API response times

### Monthly Tasks

1. **Cost Review**
   - Firebase usage and billing
   - Cloud Functions invocations
   - BigQuery storage and queries

2. **Security Audit**
   - Review Firestore rules
   - Rotate API keys
   - Check for vulnerabilities

---

## Rollback Procedure

If issues arise after deployment:

### 1. Rollback Hosting

```bash
# View deployment history
firebase hosting:channel:list

# Rollback to previous
firebase hosting:rollback
```

### 2. Rollback Functions

```bash
# Redeploy previous version
firebase deploy --only functions:geminiChatAgent --version=X
```

### 3. Rollback Remote Config

Via Firebase Console:
1. Remote Config → Version History
2. Select previous version
3. Click "Rollback"

---

## Troubleshooting

### Issue: Functions deployment fails

**Error**: `HTTP Error: 403, Permission denied`

**Fix**:
```bash
# Enable required APIs
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Check IAM permissions
gcloud projects get-iam-policy vida-travel-vacation-credit
```

### Issue: Firestore indexes taking too long

**Solution**: Indexes can take 10-20 minutes. Check status:

```bash
firebase firestore:indexes
```

Or in Console: https://console.firebase.google.com/project/vida-travel-vacation-credit/firestore/indexes

### Issue: Meta Pixel not firing

**Checklist**:
1. Pixel ID in HTML matches Events Manager
2. No ad blockers in test browser
3. Check browser console for `fbq is not defined` error
4. Test in incognito mode
5. Use Meta Pixel Helper Chrome extension

### Issue: Chat not responding

**Checklist**:
1. `GEMINI_API_KEY` set in `functions/.env`
2. Functions deployed after setting env vars
3. Check Cloud Functions logs: `firebase functions:log`
4. Verify API key is valid: https://makersuite.google.com/app/apikey
5. Check quota limits (Gemini free tier: 60 requests/minute)

---

## Performance Optimization

### After Launch

1. **Enable Caching**
```json
// firebase.json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|webp)",
        "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
      }
    ]
  }
}
```

2. **Optimize Images**
```bash
# Use ImageOptim, TinyPNG, or:
npm install -g imagemin-cli
imagemin public/assets/**/*.{jpg,png} --out-dir=public/assets/optimized
```

3. **Enable Compression**
Automatic with Firebase Hosting (gzip/brotli)

---

## Success Metrics

Track these KPIs weekly:

| Metric | Target | Calculation |
|--------|--------|-------------|
| Conversion Rate | 2-5% | Payments / Sessions |
| Avg Package Price | MXN 30,000 | Sum(prices) / Bookings |
| Simulator Completion | 40%+ | Step 4 / Sessions |
| Chat Engagement | 15%+ | Chat Opens / Sessions |
| CAC by Variant | < MXN 500 | Ad Spend / Conversions |

---

## Next Steps

1. **Launch Marketing Campaign**
   - Instagram ads with UTM parameters
   - Facebook retargeting pixel
   - Influencer partnerships

2. **Iterate Based on Data**
   - Analyze A/B test results (2-4 weeks)
   - Identify winning variant
   - Launch new tests (pricing, messaging, UI)

3. **Scale Infrastructure**
   - Increase Cloud Functions max instances
   - Optimize BigQuery queries
   - Add CDN for assets

4. **Enhance Features**
   - Add payment gateway integration
   - Build admin dashboard
   - Implement email notifications
   - Add SMS reminders for deposits

---

## Support

**Technical Issues**: Create GitHub issue  
**Business Questions**: business@vidatravel.com  
**Emergency Rollback**: Call development team

---

**Deployment completed!** 🎉

Your VIDA Travel vacation credit simulator is now live and ready to empower Mexican families to achieve their travel dreams.

---

**Last Updated**: November 2024  
**Version**: 1.0.0

