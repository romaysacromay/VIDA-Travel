#!/bin/bash

# Firebase Deployment Script
# Make sure you're logged in: firebase login

export PATH="/tmp/node-v20.18.0-darwin-arm64/bin:$PATH"

cd "/Users/m1/Desktop/VIDA Travel"

echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Deployment complete!"

