# VIDA Travel - Vacation Credit Landing Page

Firebase-powered single-page application for VIDA Travel's vacation credit program with A/B testing, analytics, and AI chat agent capabilities.

## Project Structure

```
VIDA Travel/
├── firebase.json              # Firebase configuration
├── .firebaserc                # Firebase project ID
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Firestore indexes
├── remoteconfig.template.json  # Remote Config template for A/B testing
├── functions/                 # Cloud Functions
│   ├── src/
│   │   └── index.ts          # Vacation credit simulator & Gemini chat agent
│   ├── package.json
│   └── tsconfig.json
├── public/                    # Static files (hosted on Firebase Hosting)
│   ├── index.html            # Landing page
│   ├── css/
│   │   └── styles.css        # Branded styles
│   ├── js/
│   │   └── app.js           # Client-side logic
│   └── images/              # Branding assets (add vida-logo.png here)
├── config/
│   └── api-keys.example.json # API key template
└── brand.md                  # Brand guidelines

```

## Firebase Project ID

**Project ID**: `vida-travel-vacation-credit`

> **Note**: You'll need to create this project in Firebase Console or update `.firebaserc` with your actual project ID.

## Setup Instructions

### 1. Firebase Project Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project: `vida-travel-vacation-credit`
   - Enable billing (Blaze plan required for Cloud Functions)

2. **Initialize Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use vida-travel-vacation-credit
   ```

### 2. Enable Firebase Services

Enable the following services in Firebase Console:

- **Firebase Hosting**: For SPA hosting
- **Cloud Firestore**: For user data storage
- **Cloud Functions**: For backend logic
- **Firebase Authentication**: Enable Email/Password provider
- **Firebase Remote Config**: For A/B testing
- **Google Analytics for Firebase**: For analytics

### 3. Configure API Keys

1. Copy `config/api-keys.example.json` to `config/api-keys.json`
2. Update with your actual API keys:
   - **Firebase Config**: Get from Project Settings > General > Your apps
   - **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Google Analytics**: Get from Firebase Console > Analytics
   - **Meta Pixel ID**: Get from [Facebook Business Manager](https://business.facebook.com/)

3. Update `public/index.html` with Firebase config values
4. Update `public/js/app.js` with your Cloud Functions URLs

### 4. Set Environment Variables for Cloud Functions

```bash
cd functions
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
```

### 5. Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore
```

### 6. Deploy Cloud Functions

```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

### 7. Configure Remote Config

1. Go to Firebase Console > Remote Config
2. Import `remoteconfig.template.json` or manually create parameters
3. Set up A/B testing experiments in Firebase Console

### 8. Set Up BigQuery Export

1. Go to Firebase Console > Project Settings > Integrations
2. Enable BigQuery export for:
   - Google Analytics for Firebase
   - Cloud Firestore
3. Create dataset: `vida_analytics`
4. Tables will be automatically created for analytics events

### 9. Add Branding Assets

1. Place `vida-logo.png` in `public/images/`
2. Update `brand.md` with actual brand colors and fonts
3. Update CSS variables in `public/css/styles.css` based on `brand.md`

### 10. Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

## Features

### Vacation Credit Simulator
- Collects user inputs: destination, travel dates, family composition, salary, deposit amount
- Calculates monthly savings and time to reach goal
- Stores results in Firestore
- Tracks analytics events

### AI Chat Agent
- Powered by Google Gemini LLM
- Answers questions about vacation planning
- Stores conversation history in Firestore
- Tracks chat interactions

### A/B Testing
- Remote Config for experiment variants
- Tracks variant assignments per session
- Custom events for statistical analysis

### Analytics Integration
- **Google Analytics for Firebase**: Page views, custom events
- **Meta Pixel**: Conversion tracking
- **BigQuery Export**: For advanced analysis and conjoint analysis

### Custom Events Tracked
- `page_view`: Landing page view
- `search_submission`: Form submission
- `simulation_completed`: Vacation credit calculation completed
- `enrollment_fee_click`: "Pay my enrolment fee" button click
- `chat_message_sent`: Chat interaction

## Firestore Data Model

### Collections

1. **userInputs**: User form submissions
   - Fields: destination, travelDates, familyComposition, salary, depositAmount, userId, sessionId, experimentVariantId

2. **sessions**: User session data
   - Fields: userId, experimentVariantId, createdAt

3. **chatSessions/{sessionId}/messages**: Chat conversation history
   - Fields: userMessage, assistantMessage, timestamp, userId

4. **analyticsEvents**: Custom analytics events
   - Fields: eventName, userId, sessionId, experimentVariantId, timestamp, eventData

5. **experiments/{experimentId}/variants**: Experiment variant configurations
   - Fields: variantId, configuration

## Remote Config Parameters

- `package_price_base`, `package_price_variant_a`, `package_price_variant_b`
- `loan_size_base`, `loan_size_variant_a`
- `savings_period_base`, `savings_period_variant_a`
- `bonus_incentive_base`, `bonus_incentive_variant_a`
- `messaging_headline_control`, `messaging_headline_variant_a`

## Cloud Functions

### `simulateVacationCredit`
- **Endpoint**: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/simulateVacationCredit`
- **Method**: POST
- **Body**: User inputs (destination, dates, family, salary, deposit)
- **Returns**: Simulation results (monthly savings, months to save, etc.)

### `chatAgent`
- **Endpoint**: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/chatAgent`
- **Method**: POST
- **Body**: message, conversationHistory, userId, sessionId
- **Returns**: AI-generated response

### `exportToBigQuery`
- **Type**: Scheduled (daily)
- **Purpose**: Export analytics data to BigQuery for analysis

## Development

### Local Development

```bash
# Install dependencies
cd functions
npm install

# Run Firebase emulators
firebase emulators:start

# Build functions
npm run build
```

### Testing

1. Test Firestore rules: `firebase emulators:exec --only firestore "npm test"`
2. Test Cloud Functions locally using emulators
3. Test Remote Config variants in Firebase Console

## Security Notes

- API keys are stored in environment variables (Cloud Functions) and config files
- Never commit `config/api-keys.json` to version control
- Firestore security rules enforce user-based access control
- Cloud Functions use CORS for web requests

## Next Steps

1. ✅ Create Firebase project
2. ✅ Configure API keys
3. ✅ Deploy Firestore rules
4. ✅ Deploy Cloud Functions
5. ✅ Set up Remote Config experiments
6. ✅ Enable BigQuery export
7. ✅ Add branding assets (logo, update colors)
8. ✅ Deploy to hosting
9. ✅ Test analytics events
10. ✅ Set up A/B testing experiments

## Support

For issues or questions:
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Support: https://firebase.google.com/support

