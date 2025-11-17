#!/bin/bash
# VIDA Travel - Clean Start Script

echo "🧹 Cleaning Firebase Project..."
echo ""
echo "This will:"
echo "1. Delete all Cloud Functions"
echo "2. Clear Remote Config"
echo "3. Redeploy fresh hosting"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

# Delete functions
echo "🗑️  Deleting Cloud Functions..."
firebase functions:delete simulateVacationCredit --force
firebase functions:delete chatAgent --force
firebase functions:delete exportToBigQuery --force

echo "✅ Functions deleted"
echo ""

# Deploy fresh hosting
echo "🚀 Deploying new hosting..."
firebase deploy --only hosting

echo ""
echo "✨ Clean start complete!"
echo "Your new landing page is now live"
echo ""
echo "Next steps:"
echo "1. Visit: https://vida-travel-vacation-credit.web.app"
echo "2. Test the new design"
echo "3. Deploy functions when ready: cd functions && npm run build && cd .. && firebase deploy --only functions"
