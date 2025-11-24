#!/bin/bash

echo "=========================================="
echo "  🚀 Setting Up Auto-Deploy to Firebase"
echo "=========================================="
echo ""

cd "/Users/m1/Desktop/VIDA Travel"

# Check if workflow file exists locally
if [ ! -f ".github/workflows/firebase-deploy.yml" ]; then
    echo "❌ Workflow file not found locally"
    exit 1
fi

echo "✅ Workflow file found locally"
echo ""

# Step 1: Check GitHub CLI authentication
echo "📋 Step 1: Checking GitHub CLI authentication..."
if ! gh auth status &>/dev/null; then
    echo "❌ Not authenticated with GitHub CLI"
    echo "Please run: gh auth login"
    exit 1
fi

echo "✅ Authenticated with GitHub"
echo ""

# Step 2: Check if we have workflow scope
echo "📋 Step 2: Checking token scopes..."
SCOPES=$(gh auth status 2>&1 | grep "Token scopes" | cut -d"'" -f2)

if [[ ! "$SCOPES" == *"workflow"* ]]; then
    echo "⚠️  Token missing 'workflow' scope"
    echo ""
    echo "🔧 Re-authenticating with workflow scope..."
    echo "   This will open your browser for authentication."
    echo ""
    read -p "Press Enter to continue..."
    
    gh auth login --scopes repo,workflow --web
    
    if [ $? -ne 0 ]; then
        echo "❌ Authentication failed"
        exit 1
    fi
fi

echo "✅ Token has required scopes"
echo ""

# Step 3: Check if secret exists
echo "📋 Step 3: Checking GitHub secrets..."
if gh secret list | grep -q "FIREBASE_SERVICE_ACCOUNT"; then
    echo "✅ FIREBASE_SERVICE_ACCOUNT secret exists"
else
    echo "❌ FIREBASE_SERVICE_ACCOUNT secret not found"
    echo ""
    echo "The secret was supposed to be set already. Let me try to set it again..."
    
    if [ -f "/Users/m1/Downloads/vida-travel-vacation-credit-firebase-adminsdk-fbsvc-4f64d8e481.json" ]; then
        gh secret set FIREBASE_SERVICE_ACCOUNT < "/Users/m1/Downloads/vida-travel-vacation-credit-firebase-adminsdk-fbsvc-4f64d8e481.json"
        echo "✅ Secret set successfully"
    else
        echo "❌ Service account JSON file not found"
        exit 1
    fi
fi

echo ""

# Step 4: Commit and push workflow file
echo "📋 Step 4: Pushing workflow file to GitHub..."
echo ""

git add .github/workflows/firebase-deploy.yml
git commit -m "feat: add GitHub Actions auto-deploy workflow" 2>/dev/null || echo "No changes to commit (file already committed)"

echo "Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "  ✅ AUTO-DEPLOY SETUP COMPLETE! 🎉"
    echo "=========================================="
    echo ""
    echo "🚀 From now on, every push to 'main' will automatically deploy to Firebase!"
    echo ""
    echo "📊 Monitor deployments at:"
    echo "   https://github.com/romaysacromay/VIDA-Travel/actions"
    echo ""
    echo "🔥 Firebase Console:"
    echo "   https://console.firebase.google.com/project/vida-travel-vacation-credit"
    echo ""
    echo "🌐 Live Site:"
    echo "   https://vida-travel-vacation-credit.web.app"
    echo ""
else
    echo ""
    echo "=========================================="
    echo "  ❌ PUSH FAILED"
    echo "=========================================="
    echo ""
    echo "The file has been committed locally but couldn't be pushed."
    echo "This might be due to:"
    echo "  1. Token scope issues (need 'workflow' scope)"
    echo "  2. Network issues"
    echo "  3. Repository permissions"
    echo ""
    echo "📖 See SETUP_AUTO_DEPLOY.md for alternative setup methods"
    exit 1
fi

