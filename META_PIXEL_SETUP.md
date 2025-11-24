# Meta Pixel & Conversions API Setup Guide

## ✅ Setup Complete

Your VIDA Travel website is now configured with Meta (Facebook) Pixel tracking and the Conversions API for optimal event tracking and ad performance.

## 📊 Configuration Details

### Meta Pixel ID
- **Pixel ID**: `872606122006111`
- **Setup Method**: Dataset Quality API (Recommended)
- **Created**: November 21, 2025

### Access Token
- **Type**: Conversions API Access Token
- **Configured**: ✅ Yes (stored securely in Firebase environment)

## 🎯 Event Tracking Setup

### Client-Side (Meta Pixel)
The pixel is installed in `/public/index.html` and tracks these events:

1. **PageView** - Automatic page views
2. **ViewContent** - When user views a destination
3. **AddToCart** - When user completes the travel simulator
4. **InitiateCheckout** - When user clicks enrollment button
5. **AddPaymentInfo** - When payment method is selected
6. **Purchase** - When $500 activation payment is completed (PRIMARY CONVERSION)
7. **Lead** - Form submissions
8. **Contact** - Chat interactions

### Server-Side (Conversions API)
Events are also sent server-side via Firebase Functions for:
- Better tracking accuracy (bypasses ad blockers)
- Deduplication with client-side events (using eventID)
- Improved attribution and match quality

## 🔧 Technical Implementation

### 1. Meta Pixel Code (HTML)
Located in `/public/index.html` (lines 23-38):
```html
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '872606122006111');
fbq('track', 'PageView');
</script>
```

### 2. Client-Side Tracking Module
Located in `/public/js/meta-tracking.js`:
- Handles all client-side pixel events
- Enriches events with UTM parameters and variant data
- Generates unique eventIDs for deduplication
- Automatically sends events to Conversions API

### 3. Server-Side Function
Located in `/functions/src/metaConversionAPI.ts`:
- Receives events from the client
- Sends to Meta Conversions API
- Includes user data (IP, user agent, fbc, fbp cookies)
- Logs all conversions to Firestore

## 🚀 Deployment

### Deploy to Firebase
```bash
cd "/Users/syffs/Desktop/VIDA Travel"

# Deploy everything (hosting + functions)
firebase deploy

# Or deploy separately:
firebase deploy --only hosting  # Deploy the pixel
firebase deploy --only functions # Deploy Conversions API
```

### Environment Variables
The following are configured in Firebase:
- `meta.pixel_id` = `872606122006111`
- `meta.access_token` = Your access token

For local development, these are in `/functions/.env` (not committed to git).

## 📈 Testing & Verification

### 1. Test Events Tool
Use Facebook's Test Events tool to verify events are being received:
1. Go to Meta Events Manager
2. Navigate to your pixel (872606122006111)
3. Click "Test Events" tab
4. Enter your website URL or use browser extension
5. Perform actions on your site
6. Verify events appear in real-time

### 2. Browser Console
Events are logged to console for debugging:
```javascript
// You'll see logs like:
📊 Meta Pixel: ViewContent {content_name: "Cancún", value: 15000, ...}
✅ Event sent to Conversion API: ViewContent
```

### 3. Check Firestore
All Conversion API events are logged to Firestore:
- Collection: `meta_conversions_api`
- Fields: event_name, event_id, event_data, api_response, timestamp

## 🎯 Key Events to Monitor

### Primary Conversion: Purchase
This is your main conversion event for ad optimization:
```javascript
metaTracking.trackPurchase({
  destination: 'Cancún',
  packagePrice: 15000,
  savingsWeeks: 15,
  loanAmount: 3000
}, {
  transactionId: 'txn_123abc'
});
```

**Value**: $500 MXN (activation fee)
**Optimization Goal**: Use this for your ad campaigns

### Secondary Events
- **InitiateCheckout**: Early conversion signal
- **AddToCart**: Engagement signal for retargeting
- **ViewContent**: Audience building and dynamic ads

## 🔐 Security Notes

1. **Access Token**: Stored securely in Firebase environment, never exposed to client
2. **Event Deduplication**: EventIDs prevent double-counting
3. **User Privacy**: Complies with data collection requirements
4. **HTTPS Only**: All API calls use secure connections

## 📊 Facebook Ad Campaign Setup

### Recommended Campaign Structure

#### Campaign 1: Conversion Campaign
- **Objective**: Conversions
- **Conversion Event**: Purchase (value: $500)
- **Budget**: Start with test budget
- **Bid Strategy**: Lowest cost or cost cap

#### Campaign 2: Retargeting
- **Objective**: Conversions
- **Audience**: 
  - ViewContent in last 30 days
  - AddToCart in last 14 days
  - Exclude: Purchases in last 30 days
- **Event**: Purchase

### Custom Conversions (Optional)
Create these in Events Manager:
1. **Simulator Completed**: AddToCart event
2. **Enrollment Started**: InitiateCheckout event
3. **High-Value Destinations**: ViewContent where value > $20,000

## 🐛 Troubleshooting

### Events Not Showing in Facebook
1. Check browser console for errors
2. Verify pixel ID is correct (872606122006111)
3. Disable ad blockers when testing
4. Check Facebook's Test Events tool
5. Wait 20 minutes for data to process

### Conversion API Issues
1. Check Firebase Functions logs: `firebase functions:log`
2. Verify environment variables are set
3. Check that access token hasn't expired
4. Review Firestore collection `meta_conversions_api` for errors

### Match Quality Issues
- Ensure fbc and fbp cookies are being captured
- Verify IP address is being sent (server-side)
- Consider collecting email/phone (hashed) for better matching

## 📚 Resources

- [Meta Pixel Setup Guide](https://www.facebook.com/business/help/952192354843755)
- [Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Event Parameters Reference](https://developers.facebook.com/docs/meta-pixel/reference)
- [Dataset Quality API](https://developers.facebook.com/docs/marketing-api/conversions-api/dataset-quality-api)

## 🎉 Next Steps

1. ✅ Deploy to production: `firebase deploy`
2. ✅ Test events using Facebook Test Events tool
3. ✅ Create Facebook ad campaigns using the Purchase event
4. ✅ Monitor Event Match Quality in Events Manager
5. ✅ Set up custom audiences for retargeting
6. ✅ Configure automated rules and alerts

---

**Last Updated**: November 21, 2025
**Contact**: Built for VIDA Travel by Isaac Romay

