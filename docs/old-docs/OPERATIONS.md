# VIDA Travel - Operations Guide

This document provides instructions for managing the VIDA Travel platform, including destinations, pricing, RAG context, and analyzing A/B tests.

## Table of Contents

1. [Managing Destinations](#managing-destinations)
2. [Updating Seasonal Pricing](#updating-seasonal-pricing)
3. [Modifying RAG Context](#modifying-rag-context)
4. [Adding New Translations](#adding-new-translations)
5. [Analyzing A/B Test Results](#analyzing-ab-test-results)
6. [Exporting Data for Statistical Analysis](#exporting-data-for-statistical-analysis)
7. [Monitoring Conversion Funnel](#monitoring-conversion-funnel)

---

## Managing Destinations

### Adding a New Destination

1. **Update `pricing-config.json`**:
   - Add new destination entry in the `destinations` object
   - Include: `name` (bilingual), `basePrice`, `priceRange`, `seasonalPricing`
   - Example structure:
   ```json
   "new-destination": {
     "name": {
       "es-MX": "Nuevo Destino",
       "en-US": "New Destination"
     },
     "basePrice": 15000,
     "priceRange": {
       "min": 12000,
       "max": 18000
     },
     "seasonalPricing": {
       "high": {
         "months": [12, 1, 2, 3],
         "multiplier": 1.1
       },
       "medium": {
         "months": [4, 5, 11],
         "multiplier": 1.0
       },
       "low": {
         "months": [6, 7, 8, 9, 10],
         "multiplier": 0.9
       }
     }
   }
   ```

2. **Update `rag-context.json`**:
   - Add destination information in both `es-MX` and `en-US` sections
   - Include: name, description, priceRange, bestTime

3. **Add Destination Image**:
   - Upload image to Cloud Storage: `gs://[bucket]/destination-images/new-destination.jpg`
   - Or add to `public/images/destinations/new-destination.jpg`

4. **Update Frontend**:
   - Add destination to `public/js/destination-selector.js` destinations array
   - Add translations to `public/js/i18n.js` if needed

5. **Deploy**:
   - Upload updated `pricing-config.json` to Cloud Storage
   - Upload updated `rag-context.json` to Cloud Storage
   - Deploy frontend changes: `firebase deploy --only hosting`

---

## Updating Seasonal Pricing

### Method 1: Update pricing-config.json

1. Edit `pricing-config.json` locally
2. Update `basePrice` or `seasonalPricing` multipliers for desired destinations
3. Upload to Cloud Storage:
   ```bash
   gsutil cp pricing-config.json gs://[bucket-name]/pricing-config.json
   ```
4. Clear cache: The pricing engine caches config for 1 hour. Wait or restart Cloud Functions

### Method 2: Use Firebase Console

1. Go to Firebase Console > Storage
2. Navigate to `pricing-config.json`
3. Download, edit, and re-upload

### Pricing Structure

- **basePrice**: Base price per adult in MXN
- **priceRange**: Min/max range for display
- **seasonalPricing**: Multipliers by month
  - `high`: Peak season (typically 1.05-1.1x)
  - `medium`: Shoulder season (1.0x)
  - `low`: Off-season (0.9-0.95x)

---

## Modifying RAG Context

The RAG context is stored in Cloud Storage as `rag-context.json` with bilingual structure.

### Structure

```json
{
  "es-MX": {
    "mission": { "title": "...", "content": "..." },
    "model": { "title": "...", "content": "..." },
    "simulator": { "title": "...", "rules": [...] },
    "destinations": { "destination-id": {...} },
    "financing": { "title": "...", "details": [...], "guarantee": "..." },
    "eligibility": { "title": "...", "requirements": [...] },
    "faqs": [{ "question": "...", "answer": "..." }],
    "privacy": { "title": "...", "content": "..." }
  },
  "en-US": { ... }
}
```

### Updating RAG Context

1. **Download current context**:
   ```bash
   gsutil cp gs://[bucket-name]/rag-context.json ./rag-context.json
   ```

2. **Edit the file**:
   - Update sections as needed
   - Maintain bilingual structure
   - Keep formatting consistent

3. **Upload updated context**:
   ```bash
   gsutil cp rag-context.json gs://[bucket-name]/rag-context.json
   ```

4. **Clear cache**: RAG context is cached for 1 hour. Wait or restart Cloud Functions

### Adding New FAQs

Add to `faqs` array in both language sections:

```json
{
  "question": "Nueva pregunta?",
  "answer": "Nueva respuesta..."
}
```

---

## Adding New Translations

### Adding Translation Keys

1. **Edit `public/js/i18n.js`**:
   - Add new key-value pairs to both `es-MX` and `en-US` objects
   - Use dot notation: `"section.key": "Translation"`

2. **Use in HTML**:
   - Add `data-i18n="section.key"` attribute to elements
   - For placeholders: `data-i18n` on input elements
   - For titles: `data-i18n-title="section.key"`

3. **Use in JavaScript**:
   ```javascript
   const text = window.i18n.t('section.key');
   // With parameters:
   const text = window.i18n.t('section.key', { param: value });
   ```

4. **Deploy**: `firebase deploy --only hosting`

---

## Analyzing A/B Test Results

### Firebase Console

1. **Remote Config Experiments**:
   - Go to Firebase Console > Remote Config > Experiments
   - View experiment performance metrics
   - Compare conversion rates by variant

2. **Analytics Dashboard**:
   - Go to Firebase Console > Analytics
   - Filter by `experiment_variant_id` parameter
   - Compare events: `simulation_viewed`, `enrollment_fee_click`

### BigQuery Export

1. **Enable BigQuery Export**:
   - Firebase Console > Project Settings > Integrations
   - Enable BigQuery export for Analytics and Firestore

2. **Query Data**:
   ```sql
   SELECT 
     experiment_variant_id,
     COUNT(*) as sessions,
     COUNTIF(event_name = 'enrollment_fee_click') as conversions,
     COUNTIF(event_name = 'enrollment_fee_click') / COUNT(*) as conversion_rate
   FROM `[project-id].analytics_*.events_*`
   WHERE _TABLE_SUFFIX BETWEEN '20240101' AND '20240131'
   GROUP BY experiment_variant_id
   ```

3. **Conjoint Analysis**:
   ```sql
   SELECT 
     pricing_adjustment,
     loan_term,
     credit_percentage,
     COUNT(*) as sessions,
     COUNTIF(event_name = 'enrollment_fee_click') as conversions
   FROM `[project-id].firestore_export.conjointVariants`
   GROUP BY pricing_adjustment, loan_term, credit_percentage
   ```

---

## Exporting Data for Statistical Analysis

### Firestore Export

1. **Export Collections**:
   ```bash
   gcloud firestore export gs://[bucket-name]/exports/[date]
   ```

2. **Download from Cloud Storage**:
   ```bash
   gsutil -m cp -r gs://[bucket-name]/exports/[date] ./exports/
   ```

### Analytics Export

1. **BigQuery**:
   - Data automatically exported to BigQuery
   - Query `analytics_*` tables for events
   - Export to CSV/JSON for analysis

2. **Google Analytics**:
   - Go to Analytics > Reports > Export
   - Export custom reports with language, variant, conversion data

### Key Metrics to Export

- Session data: `simulatorSessions` collection
- Conversions: `conversions` collection
- Chat interactions: `chatSessions` collection
- Analytics events: `analyticsEvents` collection or BigQuery
- A/B variants: `abTestVariants` and `conjointVariants` collections

---

## Monitoring Conversion Funnel

### Google Analytics Dashboard

Create custom dashboard with:

1. **Funnel Steps**:
   - Page Load (with language)
   - Destination Selected
   - Dates Selected
   - Family Composition Set
   - Salary Entered
   - Simulation Viewed
   - Enrollment Fee Click (Conversion)

2. **Segmentation**:
   - By language (es-MX vs en-US)
   - By experiment variant
   - By destination
   - By loan term

3. **Key Metrics**:
   - Conversion rate by step
   - Drop-off points
   - Time to conversion
   - Language preference impact

### Firebase Analytics Events

Monitor these events:

- `page_load` - Initial landing
- `language_changed` - Language toggle usage
- `destination_selected` - Destination selection
- `dates_selected` - Date picker usage
- `family_composition_set` - Family size
- `salary_entered` - Financial input
- `simulation_viewed` - Results displayed
- `dates_guaranteed` / `dates_not_guaranteed` - Feasibility
- `chat_opened` / `chat_message_sent` - Chat engagement
- `enrollment_fee_click` - **CONVERSION**

### Meta Pixel Events

Track funnel in Facebook Ads Manager:

- `PageView` - Landing
- `ViewContent` - Simulation viewed
- `InitiateCheckout` - Enrollment fee click

---

## Troubleshooting

### Pricing Not Updating

- Check Cloud Storage file is uploaded correctly
- Wait 1 hour for cache to expire, or restart Cloud Functions
- Verify `pricing-config.json` JSON syntax is valid

### RAG Context Not Loading

- Verify file exists in Cloud Storage
- Check Cloud Functions logs for errors
- Verify JSON structure matches expected format
- Clear cache by restarting functions

### Translations Not Appearing

- Check `i18n.js` has correct keys
- Verify `data-i18n` attributes in HTML
- Check browser console for JavaScript errors
- Ensure language is set correctly in localStorage

### Analytics Not Tracking

- Verify Firebase Analytics is initialized
- Check browser console for tracking errors
- Verify event names match expected format
- Check Firebase Console > Analytics for events

---

## Support

For issues or questions:
- Check Firebase Console logs
- Review Cloud Functions logs: `firebase functions:log`
- Check browser console for frontend errors
- Review Firestore rules for permission issues

