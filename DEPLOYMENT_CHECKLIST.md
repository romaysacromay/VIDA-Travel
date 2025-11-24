# Meta Pixel Deployment Checklist

## ✅ Completed Setup

### 1. Meta Pixel Configuration
- [x] Pixel ID configured: `872606122006111`
- [x] Pixel code installed in `/public/index.html`
- [x] Client-side tracking module configured (`/public/js/meta-tracking.js`)
- [x] Auto-tracking on page load
- [x] Event deduplication with unique eventIDs

### 2. Conversions API Setup
- [x] Access token generated and secured
- [x] Firebase environment variables configured
- [x] Server-side function created (`/functions/src/metaConversionAPI.ts`)
- [x] Local development environment file (`.env`)
- [x] Functions built successfully
- [x] Security: .gitignore configured to protect credentials

### 3. Event Tracking Implementation
- [x] PageView (automatic)
- [x] ViewContent (destination views)
- [x] AddToCart (simulator completion)
- [x] InitiateCheckout (enrollment clicks)
- [x] AddPaymentInfo (payment method selection)
- [x] Purchase (PRIMARY - $500 activation payment)
- [x] Lead (form submissions)
- [x] Custom events support

### 4. Data Enrichment
- [x] UTM parameter tracking
- [x] A/B variant tracking
- [x] Session tracking
- [x] Facebook cookies (fbc, fbp)
- [x] User agent capture
- [x] IP address (server-side)

## 🚀 Ready to Deploy

### Deploy Command
```bash
cd "/Users/syffs/Desktop/VIDA Travel"
firebase deploy
```

Or deploy separately:
```bash
# Deploy hosting (Meta Pixel)
firebase deploy --only hosting

# Deploy functions (Conversions API)
firebase deploy --only functions
```

## 🧪 Post-Deployment Testing

### Step 1: Verify Pixel Installation
1. Visit your website: https://vida-travel-vacation-credit.web.app
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for: `✅ Meta Pixel initialized`
5. Verify PageView event fires

### Step 2: Test Event Tracking
1. Click on a destination → Should log `ViewContent`
2. Complete simulator → Should log `AddToCart`
3. Click enrollment → Should log `InitiateCheckout`
4. Check console for confirmation messages

### Step 3: Verify in Facebook
1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Select Pixel ID: `872606122006111`
3. Go to "Test Events" tab
4. Perform actions on your site
5. Verify events appear in real-time (within 20 seconds)

### Step 4: Check Conversions API
1. Perform an action that triggers an event
2. Check browser console for: `✅ Event sent to Conversion API`
3. Go to Firebase Console → Firestore
4. Check collection: `meta_conversions_api`
5. Verify events are being logged with API responses

### Step 5: Verify Match Quality
After 24-48 hours:
1. Go to Events Manager
2. Check "Dataset Quality" score
3. Should see both Pixel and Conversions API events
4. Check "Event Match Quality" (aim for 6.0+)
5. Review "Deduplication" rate

## 📊 Facebook Ad Setup (After Testing)

### Create Conversion Campaign
1. Go to Ads Manager
2. Create new campaign
3. **Objective**: Conversions
4. **Conversion Event**: Purchase (Pixel: 872606122006111)
5. **Budget**: Start with test budget ($10-20/day)
6. **Audience**: 
   - Location: Mexico
   - Age: 25-55
   - Interests: Travel, vacation, family activities
7. **Placements**: Automatic or Facebook/Instagram feeds
8. **Creative**: Use your landing page

### Custom Audiences (Recommended)
1. **Warm Audience**: ViewContent in last 30 days
2. **Hot Audience**: AddToCart in last 14 days
3. **Exclude**: Purchases in last 30 days

## 🔍 Monitoring

### Daily Checks
- [ ] Check Facebook Events Manager for event volume
- [ ] Monitor conversion count
- [ ] Review match quality score

### Weekly Checks
- [ ] Review campaign performance
- [ ] Check Firestore logs for errors
- [ ] Verify access token is valid
- [ ] Review Firebase Functions logs

### Monthly Checks
- [ ] Refresh access token if needed (tokens can expire)
- [ ] Review and optimize event parameters
- [ ] Audit tracking implementation
- [ ] Update documentation

## ⚠️ Important Notes

### Access Token Expiration
- Your access token may expire after 60-90 days
- Facebook will notify you via email
- Generate a new token in Meta Business Suite
- Update Firebase config: `firebase functions:config:set meta.access_token="NEW_TOKEN"`
- Redeploy functions

### Privacy & Compliance
- ✅ Events are anonymized server-side
- ✅ User data is hashed where required
- ✅ HTTPS encryption for all data transmission
- ⚠️ Consider adding a cookie consent banner
- ⚠️ Review GDPR/CCPA requirements

### Best Practices
- Always test in incognito/private mode
- Use Facebook Pixel Helper Chrome extension
- Monitor error rates in Firebase Functions logs
- Keep access tokens secure (never commit to git)
- Regular backups of Firebase configuration

## 📞 Support

### If Events Aren't Tracking
1. Check browser console for JavaScript errors
2. Verify pixel ID is correct
3. Check Firebase Functions logs: `firebase functions:log`
4. Test with Facebook Pixel Helper extension
5. Review Firestore collection for error messages

### If Conversions API Fails
1. Check Functions logs: `firebase functions:log --only metaConversionAPI`
2. Verify environment variables: `firebase functions:config:get`
3. Test access token validity in Meta Graph API Explorer
4. Check that Firebase project has billing enabled

### Resources
- Meta Events Manager: https://business.facebook.com/events_manager2
- Firebase Console: https://console.firebase.google.com
- Test Events: Use Facebook's Test Events tool
- Documentation: `/META_PIXEL_SETUP.md`

---

**Setup Date**: November 21, 2025
**Ready for Production**: ✅ YES
**Next Step**: Deploy to production → `firebase deploy`

