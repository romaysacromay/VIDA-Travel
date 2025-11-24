# 🧪 Meta Pixel Testing Guide

## ✅ Your Local Test Server is Running!

Your site is now live at: **http://localhost:5000**

---

## 🎯 Quick Test (2 minutes)

### Option 1: Use the Test Page (Easiest)

1. **Open the test page in your browser:**
   ```
   http://localhost:5000/test-pixel.html
   ```

2. **What you'll see:**
   - ✅ Pixel status indicator
   - Test buttons for each event type
   - Real-time console showing events
   - Instructions for Facebook verification

3. **Click the test buttons:**
   - 📍 ViewContent (destination view)
   - 🛒 AddToCart (simulator complete)
   - 💳 InitiateCheckout (enrollment started)
   - ✅ Purchase (PRIMARY CONVERSION - $500)

4. **Check the console:**
   - Events should appear in the on-page console
   - Also open Browser DevTools (F12) → Console tab
   - Look for `📊 Event tracked via fbq` messages

### Option 2: Test the Real Site

1. **Open your main site:**
   ```
   http://localhost:5000
   ```

2. **Open Browser DevTools (F12) → Console**

3. **Perform real actions:**
   - Page loads → PageView event
   - Click a destination → ViewContent event
   - Complete simulator → AddToCart event
   - Click enrollment button → InitiateCheckout event

---

## 🔍 What to Look For

### In Browser Console (F12):

You should see these logs:

```
✅ Meta Pixel initialized with ID: 872606122006111
📊 Meta Pixel: PageView {...}
📊 Meta Pixel: ViewContent {content_name: "Cancún", value: 15000, ...}
✅ Event sent to Conversion API: ViewContent
```

### Expected Console Output:

✅ **Good Signs:**
- `Meta Pixel initialized`
- `Event tracked: [EventName]`
- `Event sent to Conversion API`
- No red error messages

❌ **Warning Signs:**
- `fbq is not defined`
- `Failed to load resource`
- Red error messages
- No event logs appearing

---

## 📊 Verify in Facebook Events Manager

### Step 1: Open Facebook Test Events

1. Go to: https://business.facebook.com/events_manager2
2. Select your Data Source (Pixel ID: **872606122006111**)
3. Click on **"Test Events"** tab (left sidebar)

### Step 2: Test Your Website

**Method A: Enter Website URL**
1. In Test Events, click "Test Browser Events"
2. Enter: `http://localhost:5000/test-pixel.html`
3. Note: This may not work for localhost, use Method B

**Method B: Use Browser Extension** (Recommended)
1. Click "Open Website" button in Test Events
2. In the opened window, navigate to your test page
3. Events will be tracked in real-time

**Method C: Use Meta Pixel Helper**
1. Install [Meta Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/meta-pixel-helper)
2. Visit your test page
3. Click the extension icon
4. Should show "Found 1 Pixel" with ID 872606122006111
5. Lists all events being fired

### Step 3: Verify Events Appear

Events should appear within **10-20 seconds**:

```
Event Name       | Event Time      | Source
-----------------|-----------------|---------
PageView         | 2:30:15 PM     | Browser
ViewContent      | 2:30:25 PM     | Browser
AddToCart        | 2:30:35 PM     | Browser
Purchase         | 2:30:45 PM     | Browser
```

---

## 🔧 Testing the Conversions API

The Conversions API requires your functions to be deployed. For now, it will fail gracefully with console warnings.

### To Test Conversions API:

1. **Deploy Functions First:**
   ```bash
   firebase deploy --only functions
   ```

2. **Test After Deployment:**
   - Visit your live site or localhost
   - Trigger events
   - Check Functions logs:
   ```bash
   firebase functions:log --only metaConversionAPI
   ```

3. **Check Firestore:**
   - Go to Firebase Console → Firestore
   - Look for collection: `meta_conversions_api`
   - Each event should create a document with API response

---

## ✅ Success Checklist

### Client-Side (Meta Pixel)
- [ ] Test page loads without errors
- [ ] Browser console shows "Meta Pixel initialized"
- [ ] PageView event fires automatically
- [ ] Test buttons trigger events successfully
- [ ] Events appear in browser console with data
- [ ] Meta Pixel Helper shows pixel is active

### Facebook Events Manager
- [ ] Pixel shows up (ID: 872606122006111)
- [ ] Test Events tool is accessible
- [ ] Events appear in Test Events (within 20 seconds)
- [ ] Event parameters are correct (value, currency, etc.)
- [ ] No error events

### Server-Side (After Deployment)
- [ ] Functions deploy successfully
- [ ] Conversions API logs show success messages
- [ ] Firestore collection has event documents
- [ ] Events Manager shows both Browser + Server events
- [ ] Deduplication is working (no duplicate events)

---

## 🐛 Troubleshooting

### Issue: Pixel Not Loading

**Symptoms:**
- Console error: `fbq is not defined`
- No events appearing

**Solutions:**
1. Check ad blocker is disabled
2. Verify pixel code is in `<head>` section
3. Check browser console for loading errors
4. Try incognito/private mode

### Issue: Events Not Appearing in Facebook

**Symptoms:**
- Browser console shows events
- Facebook Test Events is empty

**Solutions:**
1. Wait 30 seconds (events can be delayed)
2. Use Meta Pixel Helper extension
3. Check you're looking at correct Pixel (872606122006111)
4. Verify Facebook Business account access
5. Try testing on deployed site instead of localhost

### Issue: Conversions API Not Working

**Symptoms:**
- Console error: `Failed to send to Conversion API`
- Functions logs show errors

**Solutions:**
1. Verify functions are deployed: `firebase deploy --only functions`
2. Check environment config: `firebase functions:config:get`
3. Verify access token is valid
4. Check Functions logs: `firebase functions:log`
5. Ensure Firebase project has billing enabled

---

## 📈 Test Data Reference

### Sample ViewContent Event:
```javascript
{
  content_name: 'Cancún',
  content_type: 'destination',
  content_ids: ['cancun'],
  value: 15000,
  currency: 'MXN'
}
```

### Sample Purchase Event (PRIMARY CONVERSION):
```javascript
{
  content_name: 'Vacation Package',
  content_type: 'enrollment_fee',
  value: 500,
  currency: 'MXN',
  transaction_id: 'txn_abc123'
}
```

---

## 🎯 Next Steps After Testing

1. ✅ Verify all events work locally
2. ✅ Deploy to production: `firebase deploy`
3. ✅ Test on live site
4. ✅ Verify in Facebook Events Manager (production)
5. ✅ Check Match Quality score (after 24 hours)
6. ✅ Create Facebook ad campaigns
7. ✅ Monitor conversion tracking

---

## 🆘 Need Help?

### Quick Commands:

**View server logs:**
```bash
cd "/Users/syffs/Desktop/VIDA Travel"
firebase serve --only hosting
```

**Check Functions logs:**
```bash
firebase functions:log
```

**View environment config:**
```bash
firebase functions:config:get
```

**Deploy everything:**
```bash
firebase deploy
```

### Resources:
- Test Page: http://localhost:5000/test-pixel.html
- Main Site: http://localhost:5000
- Facebook Events Manager: https://business.facebook.com/events_manager2
- Meta Pixel Helper: https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc

---

**Your server is running. Open http://localhost:5000/test-pixel.html to start testing!** 🚀

