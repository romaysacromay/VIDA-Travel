#!/bin/bash
# VIDA Travel Deployment Script

set -e

echo "🚀 Starting VIDA Travel Deployment..."
echo ""

# Check Firebase login
echo "📋 Checking Firebase authentication..."
firebase projects:list > /dev/null 2>&1 || {
    echo "❌ Not logged in to Firebase. Please run: firebase login"
    exit 1
}

echo "✓ Firebase authenticated"
echo ""

# Set project
echo "📦 Setting Firebase project..."
firebase use vida-travel-vacation-credit
echo ""

# Upload config files to Cloud Storage
echo "📤 Uploading configuration files to Cloud Storage..."
echo "Note: If gsutil is not available, upload manually via Firebase Console:"
echo "  1. Go to Firebase Console > Storage"
echo "  2. Upload pricing-config.json and rag-context.json to root"
echo ""

if command -v gsutil &> /dev/null; then
    gsutil cp pricing-config.json gs://vida-travel-vacation-credit.appspot.com/pricing-config.json
    gsutil cp rag-context.json gs://vida-travel-vacation-credit.appspot.com/rag-context.json
    echo "✓ Config files uploaded"
else
    echo "⚠️  gsutil not found. Please upload config files manually:"
    echo "  - pricing-config.json → gs://vida-travel-vacation-credit.appspot.com/"
    echo "  - rag-context.json → gs://vida-travel-vacation-credit.appspot.com/"
fi
echo ""

# Check Gemini API key
echo "🔑 Checking Gemini API key..."
GEMINI_KEY=$(firebase functions:config:get gemini.api_key 2>/dev/null | grep -o '"[^"]*"' | tr -d '"' || echo "")
if [ -z "$GEMINI_KEY" ] || [ "$GEMINI_KEY" = "YOUR_GEMINI_API_KEY" ]; then
    echo "⚠️  Gemini API key not set. Please set it with:"
    echo "  firebase functions:config:set gemini.api_key=\"YOUR_ACTUAL_KEY\""
    echo ""
    read -p "Do you want to set it now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter Gemini API key: " GEMINI_KEY
        firebase functions:config:set gemini.api_key="$GEMINI_KEY"
        echo "✓ Gemini API key set"
    fi
else
    echo "✓ Gemini API key already configured"
fi
echo ""

# Deploy Firestore rules
echo "📝 Deploying Firestore rules..."
firebase deploy --only firestore
echo ""

# Deploy Cloud Functions
echo "⚙️  Deploying Cloud Functions..."
firebase deploy --only functions
echo ""

# Deploy Hosting
echo "🌐 Deploying Hosting..."
firebase deploy --only hosting
echo ""

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Upload config files to Cloud Storage (if not done):"
echo "     - Firebase Console > Storage > Upload pricing-config.json and rag-context.json"
echo ""
echo "  2. Configure Remote Config:"
echo "     - Firebase Console > Remote Config"
echo "     - Import remoteconfig.template.json or create parameters manually"
echo "     - Set up A/B testing experiments"
echo ""
echo "  3. Enable BigQuery Export (optional):"
echo "     - Firebase Console > Project Settings > Integrations"
echo "     - Enable BigQuery export for Analytics and Firestore"
echo ""
echo "  4. Test the application:"
echo "     - Visit: https://vida-travel-vacation-credit.web.app"
echo "     - Test simulator flow"
echo "     - Test chat widget"
echo "     - Verify language toggle"
echo ""


