#!/bin/bash
# VIDA Travel - Cleanup Only (No Deploy)

echo "🧹 Cleaning Firebase Project..."
echo ""
echo "This will ONLY:"
echo "1. Delete all Cloud Functions"
echo "2. NOT deploy anything"
echo "3. Keep all configurations intact"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Cancelled."
    exit 1
fi

# Delete functions if they exist
echo "🗑️  Deleting Cloud Functions..."
firebase functions:delete simulateVacationCredit --force 2>/dev/null || echo "   (simulateVacationCredit not found - OK)"
firebase functions:delete chatAgent --force 2>/dev/null || echo "   (chatAgent not found - OK)"
firebase functions:delete exportToBigQuery --force 2>/dev/null || echo "   (exportToBigQuery not found - OK)"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Nothing has been deployed."
echo "When ready to deploy, commit to git and push to trigger CI/CD"
